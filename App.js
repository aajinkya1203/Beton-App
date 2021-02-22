import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from './auth/context'
import Main from './main'
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';


export default function App(props) {

  const client = new ApolloClient({
    uri: 'http://localhost:1000/graphql',
    onError: ({ response, operation, graphQLErrors, networkError }) => {
      if (operation.operationName === "IgnoreErrorsQuery") {
        response.errors = null;
      }
      if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0].message) {
        console.log("Kuch toh error 1: ", graphQLErrors)
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
      <Main />
    </ApolloProvider>
  );
}


