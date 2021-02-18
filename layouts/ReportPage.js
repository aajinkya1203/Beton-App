import React, { useState, useEffect, useReducer } from 'react'
import { StyleSheet, Text, View, Alert, Image, Dimensions, StatusBar } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Body, Left, Right, Title } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import * as ImagePicker from 'expo-image-picker';
import { stateMachine, reducer } from '../Processing/StateMachine'
import { fetch, bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'
import { h, w } from '../constants'
import * as tf from '@tensorflow/tfjs';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import { addUser } from '../queries/query'
import Geocode from "react-geocode";
import SelectMap from '../Maps/SelectMap'
import * as Location from 'expo-location';


let coords = ''

function ReportPage(props) {

    const [image, setImage] = useState(null);
    const [state, dispatch] = useReducer(reducer, stateMachine.initial)
    const [url, setUrl] = useState('')
    const [modelReady, setModelReady] = useState(true)
    const [userLocation, setUserLocation] = useState(null)
    const [potholeDetector, setPotholeDetector] = useState(true)

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

    // set response language. Defaults to english.
    Geocode.setLanguage("en");

    const next = () => dispatch('next')
    const previous = () => dispatch('previous')

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { camStatus } = await ImagePicker.requestCameraPermissionsAsync();
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log("Users location: ", location)
            setUserLocation(location)
        })();
    }, []);

    const resetting = () => {
        previous()
        console.log("Reset is working: ", state)
    }

    const cloudUpload = (result) => {

        if (!result.cancelled) {
            const uri = result.uri
            const type = result.type

            const uriArr = uri.split('/')
            console.log("Uriarr: ", uriArr)
            const name = uriArr[uriArr.length - 1]

            const source = {
                uri,
                type,
                name
            }
            setImage(source);
            console.log("Handle Upload triggered")
            const fileData = new FormData();
            console.log("Main Image", source);
            fileData.append("file", source);
            fileData.append("upload_preset", "levitation");
            fileData.append("cloud_name", "levitation");

            // saving to cloud first
            fetch('https://api.cloudinary.com/v1_1/levitation/image/upload', {
                method: "POST",
                body: fileData
            }).then(res => res.json()).then(data => {
                console.log(data);
                setUrl(data.url)
                console.log("Photo uploaded")
                next()
            }).catch(err => {
                console.log(err);
                return err
            })
        }
    }


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        cloudUpload(result)
    }

    const pickImageFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        cloudUpload(result)
    }

    function imageToTensor(rawImageData) {
        const TO_UINT8ARRAY = true;
        const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
        // Drop the alpha channel info for mobilenet
        const buffer = new Uint8Array(width * height * 3);
        let offset = 0; // offset into original data
        for (let i = 0; i < buffer.length; i += 3) {
            buffer[i] = data[offset];
            buffer[i + 1] = data[offset + 1];
            buffer[i + 2] = data[offset + 2];
            offset += 4;
        }
        return tf.tensor3d(buffer, [height, width, 3]);
    }


    const identify = async () => {

        console.log("Identify is running")

        const response = await fetch(url, {}, { isBinary: true });
        const rawImageData = await response.arrayBuffer();
        const imageTensor = imageToTensor(rawImageData).resizeBilinear([224, 224]).reshape([1, 224, 224, 3])
        let result = await potholeDetector.predict(imageTensor).data()

        // console.log("No Pothole: ", result[0])
        // console.log("Pothole: ", result[1])

        console.log("Result: ", result)
        next()

        // const name = 'Kuku'
        // const email = 'pratit23@gmail.com'
        // const password = '2323@'
        // const address = 'This is the address'
        // const dob = '202012'

        // let res = await props.addUser({
        //     variables: {
        //         name,
        //         email,
        //         password,
        //         address,
        //         dob
        //     }
        // })

        // console.log("Res: ", res)

    }

    const getCoords = (coord) => {
        console.log("Check this: ", coord)
        coords = coord
    }

    const confirmation = async () => {
        console.log("Confirmation started")
        identify()
        next()
    }

    const selectLocation = () => {
        console.log("Select location is working")
        //next()
    }

    const nextPress = {
        initial: { text: 'Upload' },
        ready: { text: 'Confirm', action: () => confirmation() },
        classifying: { text: 'Identifying', action: () => next() },
        details: { text: 'Details', action: () => { console.log("Details entered"); next() } },
        location: { text: 'Select', action: () =>  selectLocation()  },
        complete: { text: 'Report', action: () => { } },
    }

    useEffect(() => {
        async function loadModel() {
            const tfReady = await tf.ready();
            const modelJson = await require("../assets/model/model.json");
            const modelWeight = await require("../assets/model/weights.bin");
            const potholeDetect = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));
            setPotholeDetector(potholeDetect)
            console.log("[+] Model Loaded")
        }
        loadModel()
    }, []);

    return (
        <Container>
            <StatusBar
                animated={true}
                backgroundColor="#61dafb" />

            {
                nextPress[state].text === 'Upload' ?
                    <Grid style={{ backgroundColor: '#264653' }}>
                        <Row onPress={pickImage} style={{ backgroundColor: '#e76f51', borderRadius: 24, marginTop: h * 0.06, marginLeft: w * 0.07, marginRight: w * 0.07 }}>
                            <View style={styles.iconWrapper}>
                                <Icon style={styles.uploadIcon} name='cloud-upload-outline' type='Ionicons' />
                            </View>
                        </Row>
                        <Row onPress={pickImageFromCamera} style={{ backgroundColor: '#e76f51', marginTop: h * 0.02, marginLeft: w * 0.07, marginRight: w * 0.07, marginBottom: h * 0.02, borderRadius: 24 }}>
                            <View style={styles.iconWrapper}>
                                <Icon style={styles.uploadIcon} name='camera-outline' type='Ionicons' />
                            </View>
                        </Row>
                    </Grid> : null
            }
            {
                nextPress[state].text === 'Confirm' ?
                    <Grid >
                        <Row style={{ backgroundColor: '#ffffff' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    style={{ width: w * 0.8, height: h * 0.4, borderRadius: 24, marginBottom: h * 0.2, marginTop: h * 0.3, marginLeft: w * 0.2, marginRight: w * 0.2 }}
                                    source={{
                                        uri: image.uri,
                                    }}
                                />
                            </View>
                        </Row>
                        <Col>
                            <Row size={1}>
                                <Col>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>Do you confirm you have to upload this photo?</Text>
                                    </View>
                                </Col>
                            </Row>
                            <Row size={3}>
                                <Col>
                                    <View>
                                        <Button onPress={nextPress[state].action} style={{ width: 0.25 * w, marginLeft: w * 0.22, justifyContent: 'center' }} primary><Text> Confirm </Text></Button>
                                    </View>
                                </Col>
                                <Col>
                                    <View>
                                        <Button style={{ width: 0.25 * w, marginLeft: w * 0.03, justifyContent: 'center' }} danger><Text> Cancel </Text></Button>
                                    </View>
                                </Col>
                            </Row>
                        </Col>
                    </Grid> : null
            }
            {
                nextPress[state].text === 'Select' ?
                    <SelectMap userLocation={userLocation} selectLocation={selectLocation} resetting={resetting}/> : null
            }
        </Container>
    )
}

export default compose(
    graphql(addUser, { name: "addUser" })
)(ReportPage)

const styles = StyleSheet.create({
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    uploadIcon: {
        fontSize: 100
    }
})