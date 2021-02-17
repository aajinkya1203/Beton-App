import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import PriceMarker from './PriceMarker';

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

    render() {
        return (
            <MapView style={styles.map} region={this.state.region}
                onPress={(e) => this.setState({ markers: [{ latlng: e.nativeEvent.coordinate }] })}>
                {
                    console.log("Markers: ", this.state.markers),
                    this.state.markers && (this.state.markers).length !== 0 ?
                    <MapView.Marker coordinate={(this.state.markers[0]).latlng} /> :null
                }
            </MapView>
        );
    }
}

SelectMap.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default SelectMap;