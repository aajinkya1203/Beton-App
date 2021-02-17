import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Container, Footer, FooterTab, Button, Icon } from 'native-base'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReportPage from './layouts/ReportPage'
import Test from './layouts/Test'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import ClusterMap from './Maps/ClusterMap'


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
              } else if (route.name === 'Settings') {
                iconName = focused ? 'ios-add-circle' : 'ios-add-circle';
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
          <Tab.Screen name="Report" component={ReportPage} />
          <Tab.Screen name="Settings" component={ClusterMap} />
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
