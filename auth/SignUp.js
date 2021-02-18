import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images } from "../constants";
import { AuthContext } from './context'

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

const Register = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [dob, setDob] = useState('')

    console.log("Name: ", name)
    console.log("Email: ", email)
    console.log("Password: ", password)
    console.log("Address: ", address)
    console.log("DOB: ", dob)


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
                                Sign up with
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
                                    Or sign up the classic way
                        </Text>
                            </Block>
                            <ScrollView>
                                <Block flex center>
                                    <KeyboardAvoidingView
                                        style={{ flex: 1 }}
                                        behavior="padding"
                                        enabled
                                    >
                                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                            <Input
                                                onChangeText={(text) => setName(text)}
                                                borderless
                                                placeholder="Name"
                                                iconContent={
                                                    <Icon
                                                        size={16}
                                                        color={argonTheme.COLORS.ICON}
                                                        name="hat-3"
                                                        family="ArgonExtra"
                                                        style={styles.inputIcons}
                                                    />
                                                }
                                            />
                                        </Block>
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
                                            <Block row style={styles.passwordCheck}>
                                                <Text size={12} color={argonTheme.COLORS.MUTED}>
                                                    password strength:
                                                </Text>
                                                <Text bold size={12} color={argonTheme.COLORS.SUCCESS}>
                                                    {" "}
                                                strong
                                            </Text>
                                            </Block>
                                        </Block>
                                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                            <Input
                                                onChangeText={(text) => setAddress(text)}
                                                borderless
                                                placeholder="Address"
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
                                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                            <Input
                                                onChangeText={(text) => setDob(text)}
                                                borderless
                                                placeholder="DOB"
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

                                        <Block row width={width * 0.75}>
                                            <Checkbox
                                                checkboxStyle={{
                                                    borderWidth: 3
                                                }}
                                                color={argonTheme.COLORS.PRIMARY}
                                                label="I agree with the"
                                            />
                                            <Button
                                                style={{ width: 100 }}
                                                color="transparent"
                                                textStyle={{
                                                    color: argonTheme.COLORS.PRIMARY,
                                                    fontSize: 14
                                                }}
                                            >
                                                Privacy Policy
                                            </Button>
                                        </Block>
                                        <Block middle>
                                            <Button color="primary" style={styles.createButton}>
                                                <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                    CREATE ACCOUNT
                                        </Text>
                                            </Button>
                                        </Block>
                                    </KeyboardAvoidingView>
                                </Block>
                            </ScrollView>
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
        height: height * 0.85,
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
        top: height * 0.03
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

export default Register;
