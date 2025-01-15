export const COLLECTION_BY_HANDLE_QUERY = `#graphql
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      products(first: 10) {
        edges {
          node {
            id
            title
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
