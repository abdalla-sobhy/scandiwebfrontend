import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://scandiwebtest.mooo.com/api/graphql.php',
  cache: new InMemoryCache(),
});

export default client;
