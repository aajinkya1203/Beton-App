import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import { decrypt, AddAccReport } from './queries/query'
import * as Location from 'expo-location';

var normalArray = []

function Acee(props) {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = async () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
        if (accelerometerData.y <= -1.25) {
          setShowMessage(true)
        } else {
          setShowMessage(false)
        }
      })
    );
    try {
      Accelerometer.addListener(async (accelerometerData) => {
        if (accelerometerData.y <= -1.25) {
          console.log("New location: ", newLocation)
          let newLocation = await Location.getCurrentPositionAsync({
            maximumAge: 60000, // only for Android
            accuracy: Location.Accuracy.Lowest,
          })
          console.log("New location: ", newLocation)
          if (newLocation) {
            var x = newLocation.coords.latitude + ' ' + newLocation.coords.longitude
            console.log("X: ", x)
            let obj = {
              location: x,
              userID: props.decrypt.decrypt.id,
              reportedAt: new Date().toDateString(),
              reportedOn: new Date().toLocaleString().split(", ")[1]
            }
            console.log("boah boah boah boah boah", obj)
            normalArray.push(obj);
            console.log("Pothole detected!")
            if (normalArray != []) {
              let res = await props.AddAccReport({
                variables: {
                  coords: normalArray
                }
              })
              console.log("AFter mathttt ----", res);
              console.log("Document write here!");
              normalArray = []
            } else {
              console.log("this shits empty dawg.")
            }
          }
        }
      })
      // console.log("Zoom zoom: ", accelerometerData)
    } catch {
      console.log("Array hai ye", normalArray);
      if (normalArray != []) {
        let res = await props.AddAccReport({
          variables: {
            coords: normalArray
          }
        })
        console.log("AFter mathttt ----", res);
        console.log("Document write here!");
        normalArray = []
      } else {
        console.log("this shits empty dawg.")
      }
    }
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, [showMessage]);

  const { x, y, z } = data;
  return (
    <View style={styles.container}>
      {
        showMessage ?
          <Text style={styles.text}>Pothole detected!</Text> : null
      }
      <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default compose(
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
  }),
  graphql(AddAccReport, { name: "AddAccReport" })
)(Acee)

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white'
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});