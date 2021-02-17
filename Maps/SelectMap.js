import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, ProviderPropType, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import PriceMarker from './PriceMarker';
import { h, w } from '../constants'
import Geocoder from 'react-native-geocoding';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function log(eventName, e) {
    console.log(eventName, e.nativeEvent);
}

var addressComponent = null

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
            a: {
                latitude: LATITUDE + SPACE,
                longitude: LONGITUDE + SPACE,
            },
            b: {
                latitude: LATITUDE - SPACE,
                longitude: LONGITUDE - SPACE,
            },
            markers: []
        };
    }

    getAddress(coords) {
        console.log("Checkjasbdj", coords)
        this.setState({ markers: [{ latlng: coords }] });
        Geocoder.from({
            ...coords
        }).then(json => {
            addressComponent = json.results[0].address_components[0];
            console.log(addressComponent.long_name);
        }).catch(error => console.warn(error));
    }

    componentDidMount() {
        Geocoder.init("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");
    }

    render() {
        return (
            <View style={styles.map}>
                <MapView style={styles.map} region={this.state.region}
                    onPress={(e) => this.getAddress(e.nativeEvent.coordinate)} customMapStyle={mapStyle} provider={PROVIDER_GOOGLE}>
                    {
                        console.log("Markers: ", this.state.markers),
                        this.state.markers && (this.state.markers).length !== 0 ?
                            <Marker coordinate={(this.state.markers[0]).latlng} >
                                <Callout style={styles.plainView}>
                                    <View>
                                        <Text>This is a plain view</Text>
                                    </View>
                                </Callout>
                            </Marker> : null
                    }
                </MapView>
                <TouchableOpacity style={styles.overlay}>
                    {
                        this.state.markers && (this.state.markers).length !== 0 ?
                            <Text style={styles.text}></Text>
                            : <Text style={styles.text}>Select a location</Text>
                    }
                </TouchableOpacity>
            </View>
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