import React, { useState, useEffect, useReducer } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import * as ImagePicker from 'expo-image-picker';
import { stateMachine, reducer } from '../Processing/StateMachine'


export default function ReportPage() {

    const [image, setImage] = useState(null);
    const [state, dispatch] = useReducer(reducer, stateMachine.initial)

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const pickImageFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const nextPress = {
        initial: { text: 'Upload', action: () => handleUpload() },
        ready: { text: 'Confirm', action: () => confirmation() },
        classifying: { text: 'Identifying', action: () => next() },
        details: { text: 'Details', action: () => { console.log("Details entered"); next() } },
        location: { text: 'Select', action: () => { selectLocation() } },
        complete: { text: 'Report', action: () => { } },
    }

    return (
        <Container>
            {
                nextPress[state].text === 'Upload' ?
                    <Grid>
                        <Row onPress={pickImage} style={{ backgroundColor: '#212121', borderStyle: 'solid', borderColor: '#000000', borderBottomWidth: 1 }}>
                            <View style={styles.iconWrapper}>
                                <Icon style={styles.uploadIcon} name='cloud-upload-outline' type='Ionicons' />
                            </View>
                        </Row>
                        <Row onPress={pickImageFromCamera} style={{ backgroundColor: '#212121' }}>
                            <View style={styles.iconWrapper}>
                                <Icon style={styles.uploadIcon} name='camera-outline' type='Ionicons' />
                            </View>
                        </Row>
                    </Grid> : null
            }
        </Container>
    )
}

const styles = StyleSheet.create({
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    uploadIcon: {
        fontSize: 100
    }
})