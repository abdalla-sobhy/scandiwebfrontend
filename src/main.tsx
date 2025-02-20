import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ProductProvider } from "./components//ProductContext.tsx";
import { CartProvider } from "./components/CartContext.tsx";
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ProductProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </ApolloProvider>
  </StrictMode>,
)
