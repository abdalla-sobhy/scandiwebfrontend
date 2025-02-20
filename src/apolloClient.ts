import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:80/api/graphql.php',
  cache: new InMemoryCache(),
});

export default client;
