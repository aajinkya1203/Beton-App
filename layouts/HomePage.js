import React, { useState, useEffect } from 'react'
import { View, Image, Dimensions } from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Carousel from 'react-native-snap-carousel';
import { useFonts } from 'expo-font';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
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
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { findUsingZipCode } from '../queries/query';
import { ProgressBar, Colors } from 'react-native-paper';
import { useLazyQuery } from 'react-apollo';
import ByYou from '../Charts/ByYou'
import Nearby from '../Charts/Nearby'
import { addBaseReport, addReport, decrypt, existingBaseCoordinate } from '../queries/query'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AppleHeader from "react-native-apple-header";
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today = new Date()
import { Container, Header, Content, Icon, Button, Text } from 'native-base';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

function HomePage(props) {

    const [token, setToken] = useState(global.tempo);
    const [getChartData, { called, loading, data }] = useLazyQuery(
        decrypt,
        {
            variables: {
                token: token || global.tempo
            }
        }
    );

    const [loaded] = useFonts({
        Lexand: require('../assets/font/LexendDeca-Regular.ttf'),
    });

    const [loaded1] = useFonts({
        mplus: require('../assets/font/mplus.ttf'),
    });

    const [carouselItems, setCarousalItems] = useState(
        [
            {
                title: "Item 1",
                text: 0,
                text1: 'District',
                color: "rgb(35, 37, 47)",
                backgroundGradientFrom: "#097679",
                backgroundGradientTo: "#00d4ff"
            },
            {
                title: "Item 2",
                text: 0,
                text1: 'Reported nearby you',
                color: "rgb(35, 37, 47)",
                backgroundGradientFrom: "#3f5efb",
                backgroundGradientTo: "#fc466b",
            },
            {
                title: "Item 3",
                text: 0,
                text1: 'Reported by you',
                color: "rgb(35, 37, 47)",
                backgroundGradientFrom: "#097679",
                backgroundGradientTo: "#00d4ff",
            },
        ]
    )

    const [activeIndex, setActiveIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ height: height * 0.45 }}>
                <Card style={{ height: height * 0.5, backgroundColor: item.color, borderRadius: 24, paddingLeft: width * 0.05 }}>
                    <View style={{ height: height * 0.15 }}>
                        {
                            called && !loading && data && data.decrypt ?
                                <>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 70, marginTop: height * 0.02, color: '#fff' }}>{item.text}{item.text === 1 ? <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#fff' }}>pothole</Text> : <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#fff' }}>potholes</Text>}</Text>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 15, marginTop: height * 0.005, color: '#fff' }}>{item.text1}</Text>
                                </> :
                                <SkeletonPlaceholder highlightColor={'#ffffff'}>
                                    <View style={{ width: width * 0.4, height: height * 0.05, marginTop: height * 0.02, borderRadius: 12 }}></View>
                                    <View style={{ width: width * 0.6, height: height * 0.03, marginTop: height * 0.02, borderRadius: 6 }}></View>
                                </SkeletonPlaceholder>
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <View>
                            {
                                item.title == 'Item 3' ?
                                    <ByYou backgroundGradientFrom={item.backgroundGradientFrom} backgroundGradientTo={item.backgroundGradientTo} /> : null
                            }
                            {
                                item.title == 'Item 2' ?
                                    <Nearby backgroundGradientFrom={item.backgroundGradientFrom} backgroundGradientTo={item.backgroundGradientTo} /> : null
                            }
                        </View>
                    </View>
                </Card>
            </View >
        )
    }

    useEffect(() => {
        // ! When refreshed, global parameters gets refreshed :/
        // ! so get them from async storage
        if (global.tempo == undefined) {
            async function getMyToken() {
                let t_token = await AsyncStorage.getItem("userToken");
                if (t_token != undefined) {
                    global.tempo = t_token;
                    setToken(t_token)
                }
            }
            getMyToken();
        } else {
            // console.log("Fucking hell, no token waitt now")
        }
    }, [])

    useEffect(() => {
        getChartData()
    }, [token])

    useEffect(() => {
        if (props.findUsingZipCode && !props.findUsingZipCode.loading && props.findUsingZipCode.findUsingZipCode && data && data.decrypt) {
            setCarousalItems([
                {
                    title: "Item 1",
                    text: 25,
                    text1: 'District',
                    color: "rgb(35, 37, 47)",
                    backgroundGradientFrom: "#fb3f3f",
                    backgroundGradientTo: "#000000"
                },
                {
                    title: "Item 2",
                    text: props.findUsingZipCode.findUsingZipCode.length,
                    text1: 'Reported nearby you',
                    color: "rgb(35, 37, 47)",
                    backgroundGradientFrom: "#3f5efb",
                    backgroundGradientTo: "#fc466b"
                },
                {
                    title: "Item 3",
                    text: data.decrypt.reports.length,
                    text1: 'Reported by you',
                    color: "rgb(35, 37, 47)",
                    backgroundGradientFrom: "#3ffbad",
                    backgroundGradientTo: "#000000"
                },
            ])
        }
    }, [props.findUsingZipCode, data])

    console.log("Props in homepage: ", props.homepage)

    return (
        <View style={{ flex: 1, backgroundColor: '#171A1F' }}>
            {
                loaded ?
                    <ParallaxScrollView
                        backgroundColor="#171A1F"
                        contentBackgroundColor="#171A1F"
                        parallaxHeaderHeight={height * 0.4}
                        renderForeground={() => (
                            <>
                                <View onPress={() => props.navigation.navigate('Profile')} style={{ position: 'absolute', height: height * 0.07, width: width * 0.15, borderRadius: 24, marginLeft: width * 0.79, marginTop: height * 0.08 }}><Image style={{ height: '100%', width: '100%', borderRadius: 24 }} source={require('../imgs/prof.jpg')} /></View>
                            </>
                        )}
                        renderBackground={() => (
                            <>
                                <AppleHeader dateTitle={''} containerStyle={{ paddingTop: height * 0.07, height: height * 0.09, paddingLeft: width * 0.05, backgroundColor: '#171A1F', fontFamily: 'Lexand' }} largeTitle='' largeTitleFontColor='#fff' />
                                <View style={{ height: height * 0.6, width: width }}>
                                    <Image style={{ height: height, width: width }} source={require('../imgs/solidBack.jpeg')} />
                                    <View style={{ position: 'absolute', paddingLeft: width * 0.05, paddingRight: width * 0.05, paddingBottom: height * 0.02, backgroundColor: 'rgb(35, 37, 47)', borderTopRightRadius: 24, borderBottomRightRadius: 24 }}>
                                        {
                                            console.log("Data inside", data),
                                            loaded1 && data ?
                                                <>
                                                    <Text style={{ fontFamily: 'mplus', fontSize: 40, marginTop: height * 0.02, color: '#fff' }}>Hello,</Text>
                                                    <Text style={{ fontFamily: 'mplus', fontSize: 40, color: '#fff' }}>{data.decrypt.name} 👋</Text>
                                                </> : null
                                        }
                                    </View>
                                    <View style={{ position: 'absolute', paddingLeft: width * 0.05, marginTop: height * 0.12 }}>
                                        {
                                            loaded1 ?
                                                <>
                                                    <Text style={{ fontFamily: 'mplus', fontSize: 18, marginTop: height * 0.06, color: '#fff' }}>📍{global.city}</Text>
                                                    <Button iconLeft rounded style={{ width: '80%', justifyContent: 'center', alignItems: 'center', marginLeft: width * 0.01, height: height * 0.035, marginTop: height * 0.005 }}><Text style={{ fontFamily: 'mplus', fontSize: 15, color: '#fff' }}>Overview</Text></Button>
                                                </> : null
                                        }
                                    </View>
                                </View>
                            </>
                        )}
                    >
                        <View style={{ height: height * 0.95, paddingTop: height * 0.02, backgroundColor: '#171A1F' }}>
                            <Carousel
                                layout={"default"}
                                data={carouselItems}
                                renderItem={renderItem}
                                sliderWidth={width}
                                itemWidth={width * 0.8}
                                itemHeight={height * 0.5}
                                onSnapToItem={index => setActiveIndex(index)}
                                activeSlideAlignment={'center'}
                                firstItem={1}
                            />
                            <View style={{ height: height * 0.45 }}>
                                <View style={{ height: height * 0.2, width: width, backgroundColor: 'rgb(35, 37, 47)', borderRadius: 24 }}>
                                    {
                                        called && !loading && data && data.decrypt ?
                                            <>
                                                <Text style={{ fontFamily: 'Lexand', fontSize: 12, color: 'white', marginTop: height * 0.02, marginLeft: width * 0.08 }}>MY BETON REWARDS</Text>
                                                <Text style={{ fontFamily: 'Lexand', fontSize: 60, color: 'white', marginTop: height * 0.01, marginLeft: width * 0.08 }}>{data.decrypt.karma}{data.decrypt.karma < 25 ? <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: 'white' }}>/25☆</Text> : data.decrypt.karma < 65 ? <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: 'white' }}>/65☆</Text> : <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: 'white' }}>♾️</Text>}</Text>
                                                {
                                                    data.decrypt.karma < 25 ?
                                                        <ProgressBar progress={data.decrypt.karma * 4} color={'grey'} style={{ height: height * 0.015, borderRadius: 12 }} /> :
                                                        data.decrypt.karma < 65 ?
                                                            <ProgressBar progress={data.decrypt.karma / 65} color={'grey'} style={{ height: height * 0.015, borderRadius: 12 }} /> :
                                                            <ProgressBar progress={1} color={'grey'} style={{ height: height * 0.015, borderRadius: 12 }} />
                                                }
                                                {
                                                    data.decrypt.karma < 25 ?
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 20, color: 'white', marginTop: height * 0.01, marginLeft: width * 0.08 }}>{25 - data.decrypt.karma}☆ to Intermediate</Text> : data.decrypt.karma < 65 ? <Text style={{ fontFamily: 'Lexand', fontSize: 20, color: 'white', marginTop: height * 0.01, marginLeft: width * 0.08 }}>{65 - data.decrypt.karma}☆ to Pro</Text> : <Text style={{ fontFamily: 'Lexand', fontSize: 20, color: 'white', marginTop: height * 0.01, marginLeft: width * 0.08 }}>You are a Pro</Text>
                                                }

                                            </> :
                                            <SkeletonPlaceholder highlightColor={'#ffffff'}>
                                                <View style={{ paddingLeft: width * 0.05 }}>
                                                    <View style={{ width: width * 0.2, height: height * 0.02, marginTop: height * 0.01, borderRadius: 6 }}></View>
                                                    <View style={{ width: width * 0.4, height: height * 0.07, marginTop: height * 0.02, borderRadius: 12 }}></View>
                                                    <View style={{ width: width * 0.6, height: height * 0.03, marginTop: height * 0.02, borderRadius: 6 }}></View>
                                                </View>
                                            </SkeletonPlaceholder>
                                    }
                                </View>
                            </View>
                        </View>
                    </ParallaxScrollView> : null
            }
        </View>
    )
}

export default compose(
    graphql(findUsingZipCode, {
        name: "findUsingZipCode",
        options: () => {
            console.log("Global postCode: ", global.postCode, typeof (global.postCode))
            return {
                variables: {
                    zip: global.postCode
                }
            }
        }
    })
)(HomePage)
