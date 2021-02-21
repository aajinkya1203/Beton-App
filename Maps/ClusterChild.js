import React, { useState, useEffect } from "react";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native'
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';
import { isEqual } from "lodash";
import { Container, Header, Content, Icon, Text, Button } from 'native-base';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w';

const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;

console.log("Width: ", width)
console.log('Height: ', height)

const mapStyle = [
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

export default function ClusterChild(props) {

    const [initialRegion, setInitialRegion] = useState(props.initRegion)

    const tempRegion = {
        latitude: 52.5,
        longitude: 19.2,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04 * ASPECT_RATIO,
    }

    const handleButton = () => {
        props.handleSearch()
    }

    return (
        <MapView
            customMapStyle={mapStyle}
            initialRegion={initialRegion ? initialRegion : tempRegion}
            onRegionChangeComplete={reg => {
                if (reg) {
                    setInitialRegion(reg)
                }
            }}
            style={{ flex: 1 }} provider={PROVIDER_GOOGLE}>
            <Marker coordinate={{ latitude: 52.4, longitude: 18.7 }} />
            <Marker coordinate={{ latitude: 52.1, longitude: 18.4 }} />
            <Marker coordinate={{ latitude: 52.6, longitude: 18.3 }} />
            <Marker coordinate={{ latitude: 51.6, longitude: 18.0 }} />
            <Marker coordinate={{ latitude: 53.1, longitude: 18.8 }} />
            <Marker coordinate={{ latitude: 52.9, longitude: 19.4 }} />
            <Marker coordinate={{ latitude: 52.2, longitude: 21 }} />
            <Marker coordinate={{ latitude: 52.4, longitude: 21 }} />
            <Marker coordinate={{ latitude: 51.8, longitude: 20 }} />
            <Button iconLeft onPress={() => handleButton()} style={{ top: height * 0.07, left: width * 0.82, width: 90 }} rounded><Icon name='search-outline'/></Button>
        </MapView>
    )
}

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
});
