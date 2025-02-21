import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://infinityfreetest.infinityfreeapp.com/api/graphql.php',
  cache: new InMemoryCache(),
});

export default client;
