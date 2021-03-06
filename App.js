import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from './auth/context'
import Main from './main'
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';


export default function App(props) {

  const client = new ApolloClient({
    uri: 'http://127.0.0.1:1000/graphql',
    onError: ({ response, operation, graphQLErrors, networkError }) => {
      if (operation.operationName === "IgnoreErrorsQuery") {
        response.errors = null;
      }
      if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0].message) {
        console.log("Graphql error: ", graphQLErrors)
      }
      if (networkError) {
        alert("Couldnt connect to our servers! Please check you internet connection")
        console.log("Network error")
      }
      if (response?.errors) {
        console.log("Response error")
      }

    }
  })

  return (
    <ApolloProvider client={client}>
      <Main />
    </ApolloProvider>
  );
}


