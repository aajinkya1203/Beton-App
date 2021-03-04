import React, { useState, useEffect } from "react";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';
import { isEqual } from "lodash";
import { Container, Header, Content, Icon, Text, Button } from 'native-base';
import { Switch } from 'galio-framework';
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
const GOOGLE_PLACES_API_KEY = 'AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w';

const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;

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

function ClusterChild(props) {

    const [initialRegion, setInitialRegion] = useState(props.initRegion)
    const [isLoading, setIsLoading] = useState(true)
    const [tempRegion, setTempRegion] = useState(null)

    const [toggle, setToggle] = useState(true)

    const handleButton = () => {
        props.handleSearch()
    }

    // const [location, setLocation] = useState(null);
    // const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        setTimeout(async () => {
            try {
                let value = await AsyncStorage.getItem('currLocation')
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
                <Text style={{ color: 'white' }}>Fetching...</Text>
            </View>
        )
    }

    console.log("clustterr boahh", global.allMarkers)
    return (
        <View style={StyleSheet.absoluteFillObject}>
            <MapView
                customMapStyle={toggle ? darkStyle : lightStyle}
                loadingEnabled
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
                {
                    global.allMarkers && global.allMarkers.length > 0 ?
                        global.allMarkers.map((marker, key) => {
                            console.log("Type of marker: ", typeof (marker))
                            if (typeof (marker) != 'undefined') {
                                return (
                                    <Marker key={key} coordinate={{ latitude: Number(marker.location.split(" ")[0]), longitude: Number(marker.location.split(" ")[1]) }}><Image source={require('../imgs/pothole.png')} style={{ height: 35, width: 35 }} /></Marker>
                                )
                            }
                        }) : null
                }
                {/* // !This gives error on Android */}
                {/* <Button iconLeft onPress={() => handleButton()} style={{ top: height * 0.07, left: width * 0.82, width: 90 }} rounded><Icon name='search-outline' /></Button>
                <Switch
                    value={toggle}
                    onChange={() => setToggle(!toggle)}
                    style={{ top: height * 0.09, left: width * 0.85 }}
                /> */}
            </MapView>
        </View>
    )
}

export default ClusterChild

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.5,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        position: 'absolute',
        top: height * 0.09,
        backgroundColor: '#286FD4',
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.05,
        width: width * 0.2,
        right: width * 0.01,
        borderRadius: 24
    },
    plainView: {
        width: 60,
    },
});
