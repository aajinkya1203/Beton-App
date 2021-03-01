import React, { useState, useEffect, useMemo, useCallback } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native'
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';
import { isEqual, set } from "lodash";
import { Container, Header, Content, Icon, Text, Button } from 'native-base';
import { Switch } from 'galio-framework';
import * as Location from 'expo-location';
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
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BottomSheet from 'reanimated-bottom-sheet';


const GOOGLE_PLACES_API_KEY = 'AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w';

const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;

console.log("Width: ", width)
console.log('Height: ', height)

const darkStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
]

const lightStyle = [
    {
        "featureType": "poi.attraction",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]


const DirectionsMap = (props) => {

    const [initialRegion, setInitialRegion] = useState(props.from)
    const [isLoading, setIsLoading] = useState(true)
    const [tempRegion, setTempRegion] = useState(null)
    const [showStart, setShowStart] = useState(props.showStart)
    const [changeHeight, setChangeHeight] = useState(false)
    const [toggle, setToggle] = useState(true)
    const [enc, setEnc] = useState(true)

    const handleButton = () => {
        props.handleSearch()
    }

    // const [isOn, { called, loading, data }] = useLazyQuery(
    //     isOnLine,
    //     {
    //         variables: {
    //             location: "16.038612345464614 73.57858923198849"
    //         }
    //     }
    // );

    // variables
    const snapPoints = useMemo(() => ['50%', '100%'], []);

    const handleGetDirections = async () => {
        const data = {
            source: {
                latitude: props.from.latitude,
                longitude: props.from.longitude
            },
            destination: {
                latitude: props.to.latitude,
                longitude: props.to.longitude
            },
            params: [
                {
                    key: "travelmode",
                    value: "driving"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                    key: "dir_action",
                    value: "navigate"       // this instantly initializes navigation using the given travel mode
                }
            ],
        }

        console.log("prarararap", props)
        getDirections(data)
    }

    const checkTest = async() => {
        // var merged = [].concat.apply([], enc);
        // console.log("BRR; ", merged[merged.length - 1])
        // var pt = turf.point([16.00039, 73.67176]);
        // var line = turf.lineString(merged);
        // var isPointOnLine = turf.booleanWithin(pt, line);
        // console.log("Is Point on line: ", isPointOnLine)

        // // merged.sort(([a, b], [c, d]) => c - a || b - d);
        // // console.log("Merged is", merged)

        // var array = [[123, 3], [745, 4], [643, 5], [643, 2]];
        // array.sort(([a, b], [c, d]) => c - a || b - d);
        // console.log(array)
        
        
        // isOn();
        // if(loading){
        //     console.log("calledd and loading")
        // }
        // if(data){
        //     console.log("Datatatatatatatatatatatat", data)
        // }
        // var pt = turf.point([0, 0]);
        // var line = turf.lineString([[-1, -1], [1, 10], [1.5, 2.2]]);
        // var isPointOnLine = turf.booleanPointOnLine(pt, line);
        // console.log("Is Point on line: ", isPointOnLine)
    }
    

    useEffect(() => {
        setTimeout(async () => {
            try {
                let value = await AsyncStorage.getItem('currLocation')
                console.log("Curr location: ", JSON.parse(value))
                setTempRegion(JSON.parse(value))
                setIsLoading(false)
            } catch (e) {
                console.log("Error fetching location: ", e)
            }
        }, 1000)
    }, [isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <PulseIndicator color='white' />
                <Text style={{ color: 'white' }}>Getting your current location...</Text>
            </View>
        )
    }

    //const sheetRef = React.useRef(null);

    const renderInner = () => (
        <Text>Hello</Text>
    )

    const renderContent = () => (
        <View
            style={{
                backgroundColor: '#FFFFFA',
                padding: 16,
                height: 450,
            }}
        >
            <Text>Swipe down to close</Text>
        </View>
    );

    const renderHeader = () => (
        <View
            style={{
                backgroundColor: '#FFFFFA',
                padding: 16,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <View style={{ height: 10, width: 30, backgroundColor: '#212121', borderRadius: 12 }}></View>
        </View>
    );

    //const sheetRef = React.useRef(null);

    return (
        <>
            <View
                style={{
                    flex: 1,
                }}
            >
                <MapView
                    customMapStyle={toggle ? darkStyle : lightStyle}
                    initialRegion={initialRegion ? {
                        ...initialRegion,
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.08 * ASPECT_RATIO,
                    } : tempRegion}
                    onRegionChangeComplete={reg => {
                        if (reg) {
                            setInitialRegion(reg)
                        }
                    }}
                    style={{ flex: 1 }} provider={PROVIDER_GOOGLE}>
                    <MapViewDirections
                        origin={props.from}
                        destination={props.to}
                        apikey={GOOGLE_PLACES_API_KEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                    <Button iconLeft onPress={() => handleButton()} style={{ top: height * 0.07, left: width * 0.82, width: 90 }} rounded><Icon name='search-outline' /></Button>
                    <Switch
                        value={toggle}
                        onChange={() => setToggle(!toggle)}
                        style={{ top: height * 0.09, left: width * 0.85 }}
                    />
                    {
                        <>
                            <Button iconLeft onPress={() => handleGetDirections()} style={{ top: height * 0.5, left: width * 0.82, width: 90 }} rounded><Text>Start</Text></Button>
                            <Button iconLeft onPress={() => checkTest()} style={{ top: height * 0.2, left: width * 0.82, width: 90 }} rounded><Text>Check</Text></Button>
                        </>
                    }
                </MapView>
            </View>
            <BottomSheet
                //ref={sheetRef}
                snapPoints={[400, 100]}
                renderContent={renderContent}
                initialSnap={1}
                renderHeader={renderHeader}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.1,
    },
    container1: {
        padding: 24,
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.3,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.1,
        width: width * 0.8,
        left: width * 0.1,
        borderRadius: 24
    },
    plainView: {
        width: 60,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default DirectionsMap
