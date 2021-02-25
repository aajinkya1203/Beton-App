import React, { useState, useEffect, useReducer } from 'react'
import { StyleSheet, Text, View, Alert, Image, Dimensions, StatusBar } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Body, Left, Right, Title, Toast } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import * as ImagePicker from 'expo-image-picker';
import { stateMachine, reducer } from '../Processing/StateMachine'
import { fetch, bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'
import { h, w } from '../constants'
import * as tf from '@tensorflow/tfjs';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import Geocode from "react-geocode";
import SelectMap from '../Maps/SelectMap'
import Spinner from 'react-native-loading-spinner-overlay';
import BottomSheet from 'reanimated-bottom-sheet';
import { useFonts } from 'expo-font';
import GradientButton from 'react-native-gradient-buttons';
import { useLazyQuery } from 'react-apollo';
import { addBaseReport, addReport, decrypt, existingBaseCoordinate } from '../queries/query'
import AsyncStorage from '@react-native-async-storage/async-storage'


const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;

function ReportPage(props) {

    const [image, setImage] = useState(null);
    const [state, dispatch] = useReducer(reducer, stateMachine.initial)
    const [url, setUrl] = useState('')
    const [modelReady, setModelReady] = useState(true)
    const [userLocation, setUserLocation] = useState(null)
    const [potholeDetector, setPotholeDetector] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [coords, setCoords] = useState([0,0])
    const [address, setAddress] = useState(null)
    //const [imagePickerResult, setImagePickerResult] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

    // set response language. Defaults to english.
    Geocode.setLanguage("en");

    const next = () => dispatch('next')
    const previous = () => dispatch('previous')

    const resetting = () => {
        previous()
        console.log("Reset is working: ", state)
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <PulseIndicator color='white' />
                <Text style={{ color: 'white' }}>Fetching...</Text>
            </View>
        )
    }

    const [existingBase, { called, loading, data }] = useLazyQuery(
        existingBaseCoordinate,
        {
            variables: {
                latitude: `${coords[0]}`,
                longitude: `${coords[1]}`
            }
        }
    );

    const handleReport = async () => {
        console.log("Coords in Handle Report: ", coords)
        console.log("Props in Handle Report: ", props)
        await existingBase();
        if (called && loading) {
            console.log("Loading...")
        };
        if (data && data.existingBaseCoordinate) {
            console.log("Data here", data)
            console.log("Image url", url)
            if (url != "") {
                if (data.existingBaseCoordinate.location == null) {
                    // call base point query mutation here
                    let res = await props.addBaseReport({
                        variables: {
                            image: url,
                            address: address,
                            location: `${coords[0]} ${coords[1]}`,
                            reportedAt: new Date().toDateString(),
                            reportedOn: new Date().toLocaleString().split(", ")[1],
                            userID: props.decrypt.decrypt.id,
                            noOfReports: 1
                        }
                    })
                    console.log("res in base", res);
                    if (res && res.data && res.data.addBaseReport) {
                        alert("Report successfully submitted!");
                    }
                    else {
                        alert("Uh-oh! Something went wrong!")
                    }
                } else {
                    // call dependenty point query mutation here
                    let res = await props.addReport({
                        variables: {
                            image: url,
                            address: address,
                            location: `${coords[0]} ${coords[1]}`,
                            reportedAt: new Date().toDateString(),
                            reportedOn: new Date().toLocaleString().split(", ")[1],
                            userID: props.decrypt.decrypt.id,
                            baseParent: data.existingBaseCoordinate.id,
                            level: props.decrypt.decrypt.level
                        }
                    })
                    console.log("res in dep", res);
                    console.log("res in base", res);
                    if (res && res.data && res.data.addBaseReport) {
                        alert("Report successfully submitted!");
                    }
                    else {
                        alert("Uh-oh! Something went wrong!")
                    }
                }
            }
        }

    }

    const cloudUpload = (result) => {

        if (!result.cancelled) {
            setUploading(true)
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
                body: fileData,
            }).then(res => res.json()).then(data => {
                console.log(data);
                setUrl(data.url)
                console.log("Photo uploaded")
                setUploading(false)
                next()
            }).catch((err) => {
                setUploading(false)
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

    }

    const confirmation = async () => {
        console.log("Confirmation started")
        identify()
        next()
    }

    const selectLocation = () => {
        console.log("Select location is working")
        next()
    }

    const getCoords = (coordinates, address) => {
        console.log("Selected Coordinates: ", coordinates)
        setCoords([coordinates[0].latlng.latitude, coordinates[0].latlng.longitude])
        console.log("Selected Region: ", address)
        setAddress(address)
    }


    const nextPress = {
        initial: { text: 'Upload' },
        ready: { text: 'Confirm', action: () => confirmation() },
        classifying: { text: 'Identifying', action: () => next() },
        details: { text: 'Details', action: () => { console.log("Details entered"); next() } },
        location: { text: 'Select', action: () => selectLocation() },
        complete: { text: 'Complete', action: () => { } },
    }

    useEffect(() => {
        console.log("This is running: ", coords)
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


    const [loaded] = useFonts({
        Lexand: require('../assets/font/LexendDeca-Regular.ttf'),
    });

    const renderContent = () => (
        <View
            style={{
                backgroundColor: '#E8EBF3',
                padding: 16,
                height: height * 0.5,
            }}
        >
            <Text style={{ fontFamily: 'Lexand', fontSize: 25 }}>1. Your Selection 📸</Text>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
            />
            <Text style={{ fontFamily: 'Lexand', fontSize: 18, marginTop: height * 0.02 }}>Name: {(image.uri).substring(image.uri.length - 11, image.uri.length)}</Text>
            <Text style={{ fontFamily: 'Lexand', fontSize: 18, marginTop: height * 0.02 }}>Uploaded on: {Date().toLocaleString()}</Text>
            <Text style={{ fontFamily: 'Lexand', fontSize: 25, marginTop: height * 0.04 }}>2. Selected Location 🎯</Text>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
            />
            <Text style={{ fontFamily: 'Lexand', fontSize: 18, marginTop: height * 0.02 }}>Pothole possibly located at: {address}</Text>
            <Grid style={{ marginLeft: 0 }}>
                <Col>
                    <GradientButton onPressAction={() => handleReport()} text="Submit" width={'100%'} height={'40%'} style={{ marginLeft: 0, marginTop: 20 }} blueViolet impact />
                </Col>
                <Col>
                    <GradientButton
                        text="Cancel"
                        gradientBegin="#F21B3F"
                        gradientEnd="#D9594C"
                        gradientDirection="diagonal"
                        width={'100%'}
                        height={'40%'}
                        impact
                        impactStyle='Heavy'
                        onPressAction={() => resetting()}
                        style={{ marginTop: 20 }}
                    />
                </Col>
            </Grid>
        </View>
    );

    return (
        <Container>
            <Spinner
                visible={uploading}
                textContent={'Uploading...'}
                textStyle={styles.spinnerTextStyle}
            />
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
                                        <Button onPress={() => resetting()} style={{ width: 0.25 * w, marginLeft: w * 0.03, justifyContent: 'center' }} danger><Text> Cancel </Text></Button>
                                    </View>
                                </Col>
                            </Row>
                        </Col>
                    </Grid> : null
            }
            {
                nextPress[state].text === 'Select' ?
                    <SelectMap getCoords={getCoords} resetting={resetting} selectLocation={selectLocation} /> : null
            }
            {
                nextPress[state].text === 'Complete' ?
                    <>
                        <View style={{ height: height * 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
                            <Image
                                style={{ width: w * 0.8, height: h * 0.4, borderRadius: 24, marginBottom: h * 0.2, marginTop: h * 0.3, marginLeft: w * 0.2, marginRight: w * 0.2 }}
                                source={{
                                    uri: image.uri,
                                }}
                            />
                        </View>
                        <BottomSheet
                            //ref={sheetRef}
                            snapPoints={[350, 350]}
                            renderContent={renderContent}
                            initialSnap={1}
                            borderRadius={24}
                            enabledGestureInteraction={false}
                        //renderHeader={renderHeader}
                        />
                    </>
                    :
                    null
            }
        </Container>
    )
}

export default compose(
    graphql(addBaseReport, { name: "addBaseReport" }),
    graphql(addReport, { name: "addReport" }),
    graphql(decrypt, {
        name: "decrypt",
        options: () => {
            console.log("Global Tempo: ", global.tempo, typeof(global.tempo))
            return {
                variables: {
                    token: global.tempo
                }
            }
        }
    })
)(ReportPage)

const styles = StyleSheet.create({
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    uploadIcon: {
        fontSize: 100
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    baseText: {
        fontFamily: 'Lexend Deca',
    }
})