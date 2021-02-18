import React from "react";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const INITIAL_REGION = {
  latitude: 52.5,
  longitude: 19.2,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

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

const ClusterMap = () => (
  <MapView customMapStyle={mapStyle} initialRegion={INITIAL_REGION} style={{ flex: 1 }} provider={PROVIDER_GOOGLE}>
    <Marker coordinate={{ latitude: 52.4, longitude: 18.7 }} />
    <Marker coordinate={{ latitude: 52.1, longitude: 18.4 }} />
    <Marker coordinate={{ latitude: 52.6, longitude: 18.3 }} />
    <Marker coordinate={{ latitude: 51.6, longitude: 18.0 }} />
    <Marker coordinate={{ latitude: 53.1, longitude: 18.8 }} />
    <Marker coordinate={{ latitude: 52.9, longitude: 19.4 }} />
    <Marker coordinate={{ latitude: 52.2, longitude: 21 }} />
    <Marker coordinate={{ latitude: 52.4, longitude: 21 }} />
    <Marker coordinate={{ latitude: 51.8, longitude: 20 }} />
  </MapView>
);

export default ClusterMap;