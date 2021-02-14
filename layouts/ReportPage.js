import React, { useState, useEffect, useReducer } from 'react'
import { StyleSheet, Text, View, Alert, Image, Dimensions, StatusBar } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Body, Left, Right, Title } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import * as ImagePicker from 'expo-image-picker';
import { stateMachine, reducer } from '../Processing/StateMachine'
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'
import { h, w } from '../constants'
import * as tf from '@tensorflow/tfjs';

export default function ReportPage() {

    const [image, setImage] = useState(null);
    const [state, dispatch] = useReducer(reducer, stateMachine.initial)
    const [url, setUrl] = useState('')

    const next = () => dispatch('next')

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
    }, []);

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
            }).catch(err => {
                console.log(err);
                return err
            })
        }
        next()
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


    const identify = async () => {
        //Wait for tensorflow module to be ready
        const tfReady = await tf.ready();

        if (tfReady) {
            console.log("Model is ready")
        } else {
            console.log("Model is not ready")
        }

        const modelJson = await require("../assets/model/model.json");
        const modelWeight = await require("../assets/model/weights.bin");
        const potholeDetector = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));

        const res = potholeDetector.predict()

        console.log("[+] Res: ", res)
    }



    const confirmation = () => {
        console.log("Confirmation started")
        // Alert.alert(
        //     "Alert Title",
        //     "My Alert Msg",
        //     [
        //         {
        //             text: "Cancel",
        //             onPress: () => console.log("Cancel Pressed"),
        //             style: "cancel"
        //         },
        //         { text: "OK", onPress: () => console.log("OK Pressed") }
        //     ],
        //     { cancelable: false }
        // );
        identify()
    }

    const nextPress = {
        initial: { text: 'Upload' },
        ready: { text: 'Confirm', action: () => confirmation() },
        classifying: { text: 'Identifying', action: () => next() },
        // details: { text: 'Details', action: () => { console.log("Details entered"); next() } },
        // location: { text: 'Select', action: () => { selectLocation() } },
        // complete: { text: 'Report', action: () => { } },
    }

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
                                        <Button style={{ width: 0.25 * w, marginLeft: w * 0.22, justifyContent: 'center' }} primary><Text> Confirm </Text></Button>
                                    </View>
                                </Col>
                                <Col>
                                    <View>
                                        <Button style={{ width: 0.25 * w, marginLeft: w * 0.03, justifyContent: 'center'}} danger><Text> Cancel </Text></Button>
                                    </View>
                                </Col>
                            </Row>
                        </Col>
                    </Grid> : null
            }
        </Container>
    )
}

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