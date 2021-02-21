import React, { useEffect, useState, useContext } from "react";
import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
    View,
    ActivityIndicator
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images } from "../constants";
import { AuthContext } from './context'
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';


const { width, height } = Dimensions.get("screen");

const argonTheme = {
    COLORS: {
        DEFAULT: '#172B4D',
        PRIMARY: '#5E72E4',
        SECONDARY: '#F7FAFC',
        LABEL: '#FE2472',
        INFO: '#11CDEF',
        ERROR: '#F5365C',
        SUCCESS: '#2DCE89',
        WARNING: '#FB6340',
        /*not yet changed */
        MUTED: '#ADB5BD',
        INPUT: '#DCDCDC',
        INPUT_SUCCESS: '#7BDEB2',
        INPUT_ERROR: '#FCB3A4',
        ACTIVE: '#5E72E4', //same as primary
        BUTTON_COLOR: '#9C26B0', //wtf
        PLACEHOLDER: '#9FA5AA',
        SWITCH_ON: '#5E72E4',
        SWITCH_OFF: '#D4D9DD',
        GRADIENT_START: '#6B24AA',
        GRADIENT_END: '#AC2688',
        PRICE_COLOR: '#EAD5FB',
        BORDER_COLOR: '#E7E7E7',
        BLOCK: '#E7E7E7',
        ICON: '#172B4D',
        HEADER: '#525F7F',
        BORDER: '#CAD1D7',
        WHITE: '#FFFFFF',
        BLACK: '#000000'
    }
};

const Login = (props) => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn } = useContext(AuthContext)


    console.log("Email: ", email)
    console.log("Password: ", password)


    const loginHandle = (userName, password) => {
        signIn(userName, password)
    }

    // useEffect(() => {
    //     console.log("Sign in useffect is running")
    //     console.log("Check this: ", props.show)
    // }, [props.show])

    if (props.load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <PacmanIndicator color='white' />
            </View>
        )
    }

    return (
        <Block flex middle>
            <StatusBar hidden />
            <ImageBackground
                source={require('../imgs/register-bg.png')}
                style={{ width, height, zIndex: 1 }}
            >
                <Block flex middle>
                    <Block style={styles.registerContainer}>
                        <Block flex={0.25} middle style={styles.socialConnect}>
                            <Text color="#8898AA" size={12}>
                                Sign In with
                            </Text>
                            <Block row style={{ marginTop: theme.SIZES.BASE }}>
                                <Button style={{ ...styles.socialButtons, marginRight: 30 }}>
                                    <Block row>
                                        <Icon
                                            name="logo-github"
                                            family="Ionicon"
                                            size={14}
                                            color={"black"}
                                            style={{ marginTop: 2, marginRight: 5 }}
                                        />
                                        <Text style={styles.socialTextButtons}>GITHUB</Text>
                                    </Block>
                                </Button>
                                <Button style={styles.socialButtons}>
                                    <Block row>
                                        <Icon
                                            name="logo-google"
                                            family="Ionicon"
                                            size={14}
                                            color={"black"}
                                            style={{ marginTop: 2, marginRight: 5 }}
                                        />
                                        <Text style={styles.socialTextButtons}>GOOGLE</Text>
                                    </Block>
                                </Button>
                            </Block>
                        </Block>
                        <Block flex>
                            <Block flex={0.17} middle>
                                <Text color="#8898AA" size={12}>
                                    Or sign in the classic way
                        </Text>
                            </Block>
                            <Block flex center>
                                <KeyboardAvoidingView
                                    style={{ flex: 1 }}
                                    behavior="padding"
                                    enabled
                                >

                                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                        <Input
                                            onChangeText={(text) => setEmail(text)}
                                            borderless
                                            placeholder="Email"
                                            iconContent={
                                                <Icon
                                                    size={16}
                                                    color={argonTheme.COLORS.ICON}
                                                    name="ic_mail_24px"
                                                    family="ArgonExtra"
                                                    style={styles.inputIcons}
                                                />
                                            }
                                        />
                                    </Block>
                                    <Block width={width * 0.8}>
                                        <Input
                                            onChangeText={(text) => setPassword(text)}
                                            password
                                            borderless
                                            placeholder="Password"
                                            iconContent={
                                                <Icon
                                                    size={16}
                                                    color={argonTheme.COLORS.ICON}
                                                    name="padlock-unlocked"
                                                    family="ArgonExtra"
                                                    style={styles.inputIcons}
                                                />
                                            }
                                        />
                                        {
                                            props.show ?
                                                <Block row style={styles.passwordCheck} key={props.signInError}>
                                                    <Text size={12} color={argonTheme.COLORS.MUTED}>
                                                        {props.signInError}
                                                    </Text>
                                                </Block> : null
                                        }
                                    </Block>


                                    <Block row width={width * 0.75} style={{ alignItems: 'center', justifyContent: 'center', bottom: height * 0.0005 }}>
                                        {/*<Checkbox
                                            checkboxStyle={{
                                                borderWidth: 3
                                            }}
                                            color={argonTheme.COLORS.PRIMARY}
                                            label="I agree with the"
                                        />*/}
                                        <Button
                                            style={{ width: 100 }}
                                            color="transparent"
                                            textStyle={{
                                                color: argonTheme.COLORS.PRIMARY,
                                                fontSize: 14
                                            }}
                                        >
                                            or Sign up
                                            </Button>
                                    </Block>
                                    <Block middle>
                                        <Button onPress={() => loginHandle(email, password)} color="primary" style={styles.createButton}>
                                            <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                Sign In
                                        </Text>
                                        </Button>
                                    </Block>
                                </KeyboardAvoidingView>
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </ImageBackground>
        </Block>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.6,
        backgroundColor: "#F4F5F7",
        borderRadius: 4,
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: "hidden",
    },
    socialConnect: {
        backgroundColor: argonTheme.COLORS.WHITE,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#8898AA"
    },
    socialButtons: {
        width: 120,
        height: 40,
        backgroundColor: "#fff",
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1
    },
    socialTextButtons: {
        color: argonTheme.COLORS.PRIMARY,
        fontWeight: "800",
        fontSize: 14
    },
    inputIcons: {
        marginRight: 12
    },
    passwordCheck: {
        paddingLeft: 15,
        paddingTop: 13,
        paddingBottom: 30
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25
    }
});

export default Login;
