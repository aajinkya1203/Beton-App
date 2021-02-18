import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Container, Footer, FooterTab, Button, Icon } from 'native-base'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReportPage from './layouts/ReportPage'
import Test from './layouts/Test'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import ClusterMap from './Maps/ClusterMap'
import HomePage from './layouts/HomePage'
import Profile from './layouts/Profile'


export default function App(props) {

  const Tab = createBottomTabNavigator();

  const client = new ApolloClient({
    uri: 'http://192.168.10.29:1000/graphql',
    onError: ({ response, operation, graphQLErrors, networkError }) => {
      if (operation.operationName === "IgnoreErrorsQuery") {
        response.errors = null;
      }
      if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0].message) {
        console.log("Kuch toh error 1")
      }
      if (networkError) {
        console.log("Kuch toh error 2")
      }
      if (response?.errors) {
        console.log("Kuch toh error 3")
      }

    }
  })

  return (
    <ApolloProvider client={client}>
      <NavigationContainer theme={DarkTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Report') {
                iconName = focused
                  ? 'warning'
                  : 'warning-outline';
              } else if (route.name === 'Map') {
                iconName = focused ? 'map-outline' : 'map-outline';
              } else if (route.name === 'Home') {
                iconName = focused ? 'home-outline' : 'home-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person-outline' : 'person-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Report" component={ReportPage} />
          <Tab.Screen name="Map" component={ClusterMap} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
