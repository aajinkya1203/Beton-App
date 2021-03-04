import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, ProviderPropType, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import PriceMarker from './PriceMarker';
import { h, w } from '../constants'
import Geocoder from 'react-native-geocoding';
import { Container, Header, Content, Button, Icon, Text } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

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

class SelectMap extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            add_first: '',
            add_last: '',
            selectedLat: null,
            selectLng: null,
            needDetails: false,
            address: '',
            isLoading: true,
            region: null
        };
    }

    handleRestart() {
        this.props.resetting()
    }

    handleSubmit() {
        console.log("Handle Submit is working")
        let latFence = ((this.state.region.latitude).toString()).substring(3, 5)
        let lngFence = ((this.state.region.longitude).toString()).substring(3, 5)
        console.log("Lat fence: ", latFence)
        console.log("Lng fence: ", lngFence)

        if (parseInt(latFence) === parseInt(this.state.selectLat) || parseInt(lngFence) === parseInt(this.state.selectLng)) {
            console.log("Valid coords!")
            this.props.selectLocation()
        } else {
            console.log("Invalid coords!")
        }

    }

    getAddress(coords) {
        // console.log("Checkjasbdj", coords)
        this.setState({ markers: [{ latlng: coords }], selectLat: (((coords.latitude).toString()).substring(3, 5)).toString(), selectLng: (((coords.longitude).toString()).substring(3, 5)).toString() });
        // Geocoder.from({
        //     ...coords
        // }).then(json => {
        //     addressComponent = json.results[0].address_components[0];
        //     console.log(addressComponent.long_name);
        //     this.setState({ add_first: addressComponent.short_name, add_last: addressComponent.long_name })
        // }).catch(error => console.warn(error));

        (async () => {
            let regionName = await Location.reverseGeocodeAsync({ longitude: coords.longitude, latitude: coords.latitude });
            //console.log("Region Name: ", regionName)
            let area = regionName[0].name
            let city = regionName[0].city
            let district = regionName[0].subregion
            let postalCode = regionName[0].postalCode
            let address = area + ', ' + city + ', ' + district + ', ' + postalCode
            this.setState({ add_first: address })
            console.log("Test markers: ", this.state.markers)
            this.props.getCoords(this.state.markers, address)
        })();

    }

    async componentDidMount() {
        console.log("User Location: ", this.state.userLocation)
        Geocoder.init("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

        setTimeout(async () => {
            try {
                let value = await AsyncStorage.getItem('currLocation')
                this.setState({
                    region: JSON.parse(value),
                    isLoading: false
                })
                console.log("Checking this: ", this.state.region)
            } catch (e) {
                console.log("Error fetching location: ", e)
            }
        }, 1000)
    }



    render() {
        const latDelta = w * 0.00003

        return (
            <>
                {
                    this.state && this.state.isLoading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                            <PulseIndicator color='white' />
                            <Text style={{ color: 'white' }}>Getting your current location...</Text>
                        </View> :
                        <View style={styles.map}>
                            <MapView style={styles.map} region={{ latitude: this.state.region.latitude, longitude: this.state.region.longitude, latitudeDelta: latDelta, longitudeDelta: ASPECT_RATIO * latDelta }}
                                onPress={(e) => this.getAddress(e.nativeEvent.coordinate)} customMapStyle={mapStyle} provider={PROVIDER_GOOGLE}>
                                {
                                    this.state.markers && (this.state.markers).length !== 0 ?
                                        <Marker coordinate={(this.state.markers[0]).latlng} >
                                            <Callout style={styles.plainView}>
                                                <View>
                                                    <Text>This is a plain view</Text>
                                                </View>
                                            </Callout>
                                        </Marker> :
                                        <Marker coordinate={{ latitude: this.state.region.latitude, longitude: this.state.region.longitude }} >
                                            <Callout style={styles.plainView}>
                                                <View>
                                                    <Text>This is a plain view</Text>
                                                </View>
                                            </Callout>
                                        </Marker>
                                }
                                <Button onPress={() => this.handleSubmit()} style={{ top: h * 0.07, left: w * 0.82, width: w * 0.12 }} rounded><Text><Icon name='arrow-forward-outline' style={{ fontSize: 18 }} /></Text></Button>
                                <Button onPress={() => this.handleRestart()} style={{ top: h * 0.07, left: w * 0.05, width: w * 0.12, position: 'absolute' }} rounded danger><Text><Icon name='refresh-outline' style={{ fontSize: 18 }} /></Text></Button>
                            </MapView>
                            <TouchableOpacity style={styles.overlay}>
                                {
                                    this.state.markers && (this.state.markers).length !== 0 ?
                                        <Text style={styles.text}>{this.state.add_first}, {this.state.add_last}</Text>
                                        : <Text style={styles.text}>Click on the location of the pothole</Text>
                                }
                            </TouchableOpacity>
                        </View>
                }
            </>
        );
    }
}

SelectMap.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        height: h * 0.5,
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
        height: h * 0.1,
        width: w * 0.8,
        left: w * 0.1,
        borderRadius: 24
    },
    plainView: {
        width: 60,
    },
});

export default SelectMap;