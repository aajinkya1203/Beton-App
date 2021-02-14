import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Container, Footer, FooterTab, Button, Icon } from 'native-base'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReportPage from './layouts/ReportPage'
import Test from './layouts/Test'
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function App() {

  const Tab = createBottomTabNavigator();

  return (
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
        <Tab.Screen name="Settings" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
