import React from 'react';
import { render } from 'react-dom';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { persistCache } from 'apollo-cache-persist';
import App from './App';
const APOLLO_CACHE_PERSIST = 'apollo-cache-persist';

const cache = new InMemoryCache();
persistCache({
  cache,
  storage: localStorage
  // storage: indexedDB,
});

if (localStorage[APOLLO_CACHE_PERSIST]) {
  try {
    cache.restore(JSON.parse(localStorage[APOLLO_CACHE_PERSIST]));
  } catch (error) {}
}

const client = new ApolloClient({
  cache,
  uri: 'http://localhost:3000/graphql',
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        Authorization: localStorage.getItem('token')
      }
    }));
  }
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
