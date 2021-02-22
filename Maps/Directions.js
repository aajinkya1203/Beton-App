import React, { useState, useEffect } from "react";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native'
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';
import { isEqual } from "lodash";
import DirectionsMap from './DirectionsMap'
import { h as height, w as width } from '../constants'
import { Container, Header, Content, Icon, Text, Button } from 'native-base';
import { FAB } from 'react-native-paper'

const GOOGLE_PLACES_API_KEY = 'AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w';

const ASPECT_RATIO = width / height;

console.log("Width: ", width)
console.log('Height: ', height)


const Directions = () => {

  Geocoder.init("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

  const [initialRegion, setInitialRegion] = useState({
    latitude: 52.5,
    longitude: 19.2,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04 * ASPECT_RATIO,
  })

  const [showSearch, setShowSearch] = useState(false)
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)

  const handleSearch = () => {
    setShowSearch(true)
  }

  const handleFrom = (data) => {

    var region = null

    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log("From Location: ", from);

        region = {
          latitude: location.lat,
          longitude: location.lng,
        }

        setFrom(region)
        console.log("From : ", from)
      })
      .catch(error => console.warn(error));
  }

  const handleTo = (data) => {

    var region = null

    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log("To Location: ", to);

        region = {
          latitude: location.lat,
          longitude: location.lng,
        }

        setTo(region)
        setShowSearch(false)
        console.log("To: ", to)
      })
      .catch(error => console.warn(error));
  }

  return (
    <>
      {
        showSearch ?
          <GooglePlacesAutocomplete
            placeholder="From"
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en', // language of the results
            }}
            onPress={(data, details = null) => { handleFrom(data.structured_formatting.main_text) }}
            onFail={(error) => console.error(error)}
            requestUrl={{
              url:
                'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
              useOnPlatform: 'web',
            }}
            styles={{
              container: {
                backgroundColor: 'white',
              },
              textInputContainer: {
                backgroundColor: '#f5f5f5',
                height: 38,
                marginTop: height * 0.07,
                // borderTopRightRadius: 12,
                // borderTopLeftRadius: 12,
                // borderBottomLeftRadius: 12,
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
                borderRadius: 24
              },
              textInput: {
                height: 38,
                color: '#5d5d5d',
                backgroundColor: '#f5f5f5',
                fontSize: 16,
                position: 'absolute',
                width: width * 0.9,
                // borderTopRightRadius: 12,
                // borderTopLeftRadius: 12,
                // borderBottomLeftRadius: 12,
                paddingLeft: width * 0.05,
                borderRadius: 24
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              row: {
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
              },
              separator: {
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
              },
              poweredContainer: {
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
              },
              listView: {
                borderRadius: 12,
              }
            }}
          >
            <GooglePlacesAutocomplete
              placeholder="To"
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: 'en', // language of the results
              }}
              onPress={(data, details = null) => { handleTo(data.structured_formatting.main_text) }}
              onFail={(error) => console.error(error)}
              requestUrl={{
                url:
                  'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                useOnPlatform: 'web',
              }}
              styles={{
                container: {
                  backgroundColor: 'white',
                },
                textInputContainer: {
                  backgroundColor: '#f5f5f5',
                  height: 38,
                  marginTop: height * 0.02,
                  // borderTopRightRadius: 12,
                  // borderTopLeftRadius: 12,
                  // borderBottomLeftRadius: 12,
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                  borderRadius: 24
                },
                textInput: {
                  height: 38,
                  color: '#5d5d5d',
                  backgroundColor: '#f5f5f5',
                  fontSize: 16,
                  position: 'absolute',
                  width: width * 0.9,
                  // borderTopRightRadius: 12,
                  // borderTopLeftRadius: 12,
                  // borderBottomLeftRadius: 12,
                  paddingLeft: width * 0.05,
                  borderRadius: 24
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
                row: {
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                },
                separator: {
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                },
                poweredContainer: {
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                },
                listView: {
                  borderRadius: 12,
                }
              }}
            >
              <FAB
                style={styles.fab}
                small
                icon="close"
                onPress={() => setShowSearch(false)}
              />
            </GooglePlacesAutocomplete>
            </GooglePlacesAutocomplete>
          : <DirectionsMap from={from} to={to} handleSearch={handleSearch} />
      }
    </>
  )
};

const styles = StyleSheet.create({
        searchBox: {
        padding: 10,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: '#ecf0f1',
    top: 50
  },
  overlay: {
        position: 'absolute',
    top: 70,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    height: height * 0.1,
    width: width * 0.8,
    left: width * 0.1
  },
  fab: {
        position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
  },
});

export default Directions;