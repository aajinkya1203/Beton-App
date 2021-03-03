import React, { useState, useEffect } from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
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

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

function HomePage(props) {

    const chartData = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["Rainy Days"] // optional
    };

    const [loaded] = useFonts({
        Lexand: require('../assets/font/LexendDeca-Regular.ttf'),
    });

    const [carouselItems, setCarousalItems] = useState(
        [
            {
                title: "Item 1",
                text: 0,
                text1: 'District',
                color: "rgba(0, 99, 191, 0.4)",
                backgroundGradientFrom: "#097679",
                backgroundGradientTo: "#00d4ff"
            },
            {
                title: "Item 2",
                text: 0,
                text1: 'City',
                color: "rgba(255, 99, 71, 0.4)",
                backgroundGradientFrom: "#3f5efb",
                backgroundGradientTo: "#fc466b",
            },
            {
                title: "Item 3",
                text: 0,
                text1: 'State',
                color: "rgba(251, 188, 5, 0.4)",
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
                <Card style={{ height: height * 0.5, backgroundColor: item.color, borderRadius: 24, paddingLeft: width * 0.05 }} isDark>
                    <View style={{ height: height * 0.15 }}>
                        {
                            loaded ?
                                <>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 70, marginTop: height * 0.02 }}>{item.text}{item.text === 1 ? <Text style={{ fontFamily: 'Lexand', fontSize: 15 }}>pothole</Text> : <Text style={{ fontFamily: 'Lexand', fontSize: 15 }}>potholes</Text>}</Text>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 15, marginTop: height * 0.005 }}>{item.text1}</Text>
                                </> : null
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
        console.log("Props on homepage: ", props)
        if (!props.findUsingZipCode.loading) {
            setCarousalItems([
                {
                    title: "Item 1",
                    text: 25,
                    text1: 'District',
                    color: "rgba(255, 99, 71, 0.4)",
                    backgroundGradientFrom: "#fb3f3f",
                    backgroundGradientTo: "#000000"
                },
                {
                    title: "Item 2",
                    text: props.findUsingZipCode.findUsingZipCode.length,
                    text1: 'Reported nearby you',
                    color: "rgba(0, 99, 191, 0.4)",
                    backgroundGradientFrom: "#3f5efb",
                    backgroundGradientTo: "#fc466b"
                },
                {
                    title: "Item 3",
                    text: props.decrypt.decrypt.reports.length,
                    text1: 'Reported by you',
                    color: "rgba(251, 188, 5, 0.4)",
                    backgroundGradientFrom: "#3ffbad",
                    backgroundGradientTo: "#000000"
                },
            ])
        }
    }, [props.findUsingZipCode.loading])

    return (
        <ParallaxScrollView
            backgroundColor="white"
            contentBackgroundColor="white"
            parallaxHeaderHeight={height * 0.6}
            renderForeground={() => (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        loaded ?
                            <>
                                <Text style={{ fontFamily: 'Lexand', fontSize: 50, marginTop: height * 0.02 }}>Beton</Text>
                                <Text style={{ fontFamily: 'Lexand', fontSize: 20, marginTop: height * 0.005 }}>📍{global.city}</Text>
                            </> : null
                    }
                </View>
            )}
            renderBackground={() => (
                <View style={{ height: height * 0.6, width: width }}>
                    <Image style={{ height: height, width: width }} source={require('../imgs/mountain.jpg')} />
                </View>
            )}
        >
            <View style={{ height: height * 0.95, paddingTop: height * 0.02 }}>
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
                    <View style={{ height: height * 0.2, width: width, backgroundColor: '#3C3735' }}>
                        {
                            loaded ?
                                <>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 12, color: 'white', marginTop: height * 0.02, marginLeft: width * 0.08 }}>MY BETON REWARDS</Text>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 60, color: 'white', marginTop: height * 0.01, marginLeft: width * 0.08 }}>{props.decrypt.decrypt.karma}{ props.decrypt.decrypt.karma < 25 ? <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: 'white' }}>/25☆</Text> : props.decrypt.decrypt.karma < 65 ? <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: 'white' }}>/65☆</Text> : <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: 'white' }}>♾️</Text>}</Text>
                                    <ProgressBar progress={0.5} color={'grey'} style={{ height: height * 0.015, borderRadius: 12 }} />
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 20, color: 'white', marginTop: height * 0.01, marginLeft: width * 0.08 }}>5☆ to Amatuer</Text>
                                </> : null
                        }
                    </View>
                </View>
            </View>
        </ParallaxScrollView>
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
    }),
    graphql(decrypt, {
        name: "decrypt",
        options: () => {
            console.log("Global Tempo: ", global.tempo, typeof (global.tempo))
            return {
                variables: {
                    token: global.tempo
                }
            }
        }
    })
)(HomePage)
