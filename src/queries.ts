import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      price
      gallery
      category {
        name
      }
      inStock
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    category {
      name
    }
    gallery
    inStock
  }
}
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($items: [OrderItemInput!]!) {
    placeOrder(items: $items) {
      id
      product {
        id
        name
      }
      quantity
    }
  }
`;