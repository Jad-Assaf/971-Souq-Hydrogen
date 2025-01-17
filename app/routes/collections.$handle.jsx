import {defer, redirect} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  useSearchParams,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {DrawerFilter} from '~/modules/drawer-filter';
import {FILTER_URL_PREFIX} from '~/lib/const';
import React, {useEffect, useRef, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {FiltersDrawer} from '../modules/drawer-filter';
import {getAppliedFilterLink} from '../lib/filter';
import {AddToCartButton} from '../components/AddToCartButton';
import {useAside} from '~/components/Aside';
import '../styles/HomeSlider.css';

/**
 * Utility function to truncate text to a specified number of words
 */
function truncateText(text, maxWords) {
  if (!text || typeof text !== 'string') {
    return ''; // Return an empty string if text is undefined or not a string
  }
  const words = text.split(' ');
  return words.length > maxWords
    ? words.slice(0, maxWords).join(' ') + '...'
    : text;
}

/**
 * Meta Function for SEO
 */
export const meta = ({data}) => {
  const collection = data?.collection;

  return getSeoMeta({
    title: `${collection?.title || 'Collection'} | 971Souq`,
    description: truncateText(
      collection?.description || 'Explore our latest collection at 971Souq.',
      20,
    ),
    url: `https://971souq.ae/collections/${collection?.handle || ''}`,
    image:
      collection?.image?.url ||
      'https://971souq.ae/default-collection-image.jpg',
    jsonLd: [
      // CollectionPage Schema
      {
        '@context': 'http://schema.org/',
        '@type': 'CollectionPage',
        name: collection?.title || 'Collection',
        url: `https://971souq.ae/collections/${collection?.handle || ''}`,
        description: truncateText(collection?.description || '', 20),
        image: {
          '@type': 'ImageObject',
          url:
            collection?.image?.url ||
            'https://971souq.ae/default-collection-image.jpg',
        },
        hasPart: collection?.products?.nodes?.slice(0, 20).map((product) => ({
          '@type': 'Product',
          name: truncateText(product?.title || 'Product', 10),
          url: `https://971souq.ae/products/${encodeURIComponent(
            product?.handle,
          )}`,
          sku: product?.variants?.[0]?.sku || product?.variants?.[0]?.id || '',
          gtin12:
            product?.variants?.[0]?.barcode?.length === 12
              ? product?.variants?.[0]?.barcode
              : undefined,
          gtin13:
            product?.variants?.[0]?.barcode?.length === 13
              ? product?.variants?.[0]?.barcode
              : undefined,
          gtin14:
            product?.variants?.[0]?.barcode?.length === 14
              ? product?.variants?.[0]?.barcode
              : undefined,
          productID: product?.id,
          brand: {
            '@type': 'Brand',
            name: product?.vendor || '971Souq',
          },
          description: truncateText(product?.description || '', 20),
          image: `https://971souq.ae/products/${product?.featuredImage?.url}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: product?.variants?.[0]?.price?.currencyCode || 'USD',
            price: product?.variants?.[0]?.price?.amount || '0.00',
            itemCondition: 'http://schema.org/NewCondition',
            availability: product?.availableForSale
              ? 'http://schema.org/InStock'
              : 'http://schema.org/OutOfStock',
            url: `https://971souq.ae/products/${encodeURIComponent(
              product?.handle,
            )}`,
            priceValidUntil: '2025-12-31',
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '5.00',
                currency: 'USD',
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'LB',
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 3,
                  unitCode: 'DAY',
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 1,
                  maxValue: 5,
                  unitCode: 'DAY',
                },
              },
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'LB',
              returnPolicyCategory:
                'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 5,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn',
            },
          },
        })),
      },
      // BreadcrumbList Schema
      {
        '@context': 'http://schema.org/',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://971souq.ae',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: collection?.title || 'Collection',
            item: `https://971souq.ae/collections/${collection?.handle || ''}`,
          },
        ],
      },
      // ItemList Schema
      {
        '@context': 'http://schema.org/',
        '@type': 'ItemList',
        name: collection?.title || 'Collection',
        description: truncateText(collection?.description || '', 20),
        url: `https://971souq.ae/collections/${collection?.handle || ''}`,
        itemListElement: collection?.products?.nodes
          ?.slice(0, 20)
          .map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://971souq.ae/products/${encodeURIComponent(
              product?.handle,
            )}`,
            name: truncateText(product?.title || 'Product', 10),
            image: {
              '@type': 'ImageObject',
              url:
                product?.featuredImage?.url ||
                'https://971souq.ae/default-product-image.jpg',
            },
          })),
      },
    ],
  });
};

/**
 * Loader Function to Fetch Critical Data
 */
export async function loader({context, params, request}) {
  const {storefront} = context;
  const {handle} = params;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Extract 'after' and 'before' cursors
  const after = searchParams.get('after') || null;
  const before = searchParams.get('before') || null;

  // Handle sorting
  const sort = searchParams.get('sort') || 'newest';
  let sortKey;
  let reverse = false;

  switch (sort) {
    case 'price-low-high':
      sortKey = 'PRICE';
      break;
    case 'price-high-low':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'best-selling':
      sortKey = 'BEST_SELLING';
      break;
    case 'newest':
      sortKey = 'CREATED';
      reverse = true;
      break;
    case 'featured':
    default:
      sortKey = 'CREATED';
      break;
  }

  // Extract filters from URL
  const filters = [];
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith(FILTER_URL_PREFIX)) {
      const filterKey = key.replace(FILTER_URL_PREFIX, '');
      try {
        const parsedValue = JSON.parse(value);
        filters.push({[filterKey]: parsedValue});
      } catch (err) {
        console.error(`Invalid filter value for key ${filterKey}:`, value);
      }
    }
  }

  if (!handle) {
    throw redirect('/collections');
  }

  try {
    // Fetch the collection with products based on pagination, sorting, and filters
    const {collection} = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        first: after || (!before ? 20 : null),
        last: before ? 20 : null,
        after: after,
        before: before,
        filters: filters.length ? filters : undefined,
        sortKey,
        reverse,
      },
    });

    if (!collection) {
      throw new Response(`Collection ${handle} not found`, {status: 404});
    }

    let menu = null;
    let sliderCollections = [];

    try {
      const menuResult = await storefront.query(MENU_QUERY, {
        variables: {handle},
      });
      menu = menuResult.menu;
    } catch (error) {
      console.error('Error fetching menu:', error);
    }

    if (menu && menu.items && menu.items.length > 0) {
      try {
        sliderCollections = await Promise.all(
          menu.items.map(async (item) => {
            try {
              const sanitizedHandle = sanitizeHandle(item.title);
              const {collection} = await storefront.query(
                COLLECTION_BY_HANDLE_QUERY,
                {
                  variables: {handle: sanitizedHandle},
                },
              );
              return collection;
            } catch (error) {
              console.error(
                `Error fetching collection for ${item.title}:`,
                error,
              );
              return null;
            }
          }),
        );
        sliderCollections = sliderCollections.filter(
          (collection) => collection !== null,
        );
      } catch (error) {
        console.error('Error fetching slider collections:', error);
      }
    }

    // Process applied filters
    const appliedFilters = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.replace(FILTER_URL_PREFIX, '');
        try {
          const filterValue = JSON.parse(value);
          appliedFilters.push({
            label: `${filterValue}`,
            filter: {[filterKey]: filterValue},
          });
        } catch (err) {
          console.error(`Invalid filter value for key ${filterKey}:`, value);
        }
      }
    });

    // Extend return object with SEO and image data
    return {
      collection,
      appliedFilters,
      sliderCollections,
      seo: {
        title: collection?.seo?.title || `${collection.title} Collection`,
        description:
          collection?.seo?.description || collection.description || '',
        image: collection?.image?.url || null,
      },
      // Pagination Info
      pageInfo: collection.products.pageInfo,
      cursors: {
        after: collection.products.pageInfo.endCursor,
        before: collection.products.pageInfo.startCursor,
      },
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw new Response('Error fetching collection', {status: 500});
  }
}

/**
 * Utility function to sanitize handles
 */
function sanitizeHandle(handle) {
  return handle
    .toLowerCase()
    .replace(/"/g, '') // Remove all quotes
    .replace(/&/g, '') // Remove all ampersands
    .replace(/\./g, '-') // Replace periods with hyphens
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * GraphQL Queries
 */
const MENU_QUERY = `#graphql
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `#graphql
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      image {
        url
        altText
      }
    }
  }
`;

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    description
    featuredImage {
      id
      altText
      url
      width
      height
    }
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 25) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      image {
        url
        altText
      }
      products(
        first: $first,
        last: $last,
        after: $after,
        before: $before,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductItem
          availableForSale
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/**
 * React Component for Collection Page with Cursor-Based Pagination
 */
export default function Collection() {
  const {
    collection,
    appliedFilters,
    sliderCollections,
    pageInfo,
    cursors,
    seo,
  } = useLoaderData();
  const [userSelectedNumberInRow, setUserSelectedNumberInRow] = useState(null); // Tracks user selection

  const calculateNumberInRow = (width, userSelection) => {
    if (userSelection !== null) return userSelection; // User override
    return 1; // Default to 1
  };

  const [screenWidth, setScreenWidth] = useState(0);
  const [numberInRow, setNumberInRow] = useState(1);

  const isDesktop = useMediaQuery({minWidth: 1024});
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setNumberInRow(calculateNumberInRow(width, userSelectedNumberInRow));
    };

    // Initial layout setup
    updateLayout();

    // Debounce function for resize
    const debounce = (fn, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    };

    const debouncedUpdateLayout = debounce(updateLayout, 100);

    window.addEventListener('resize', debouncedUpdateLayout);

    return () => {
      window.removeEventListener('resize', debouncedUpdateLayout);
    };
  }, [userSelectedNumberInRow]); // Depend on user selection for updates

  const handleLayoutChange = (number) => {
    setUserSelectedNumberInRow(number); // Save user preference
    setNumberInRow(number); // Immediately update the layout
  };

  const handleFilterRemove = (filter) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.delete('after');
    updatedParams.delete('before');

    const newUrl = getAppliedFilterLink(filter, updatedParams, location);
    navigate(newUrl);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams;

    // Remove unwanted query parameters
    query.delete('direction');
    query.delete('cursor');

    const cleanUrl = `${url.origin}${url.pathname}?${query.toString()}`;
    window.history.replaceState({}, '', cleanUrl);
  }, []);

  const sortedProducts = React.useMemo(() => {
    if (!collection?.products?.nodes) return [];
    const products = [...collection.products.nodes];
    return products.sort((a, b) => {
      const aInStock = a.variants.nodes.some(
        (variant) => variant.availableForSale,
      );
      const bInStock = b.variants.nodes.some(
        (variant) => variant.availableForSale,
      );

      if (aInStock && !bInStock) return -1;
      if (!aInStock && bInStock) return 1;
      return 0;
    });
  }, [collection?.products?.nodes]);

  /**
   * Handler for "Next" button
   */
  const goNext = () => {
    if (!pageInfo.hasNextPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('after', pageInfo.endCursor);
    params.delete('before');
    navigate(`?${params.toString()}`);
  };

  /**
   * Handler for "Previous" button
   */
  const goPrev = () => {
    if (!pageInfo.hasPreviousPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('before', pageInfo.startCursor);
    params.delete('after');
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="collection">
      <h1>{collection.title}</h1>

      {sliderCollections && sliderCollections.length > 0 && (
        <div className="slide-con">
          <div className="category-slider">
            {sliderCollections.map(
              (sliderCollection) =>
                sliderCollection && (
                  <Link
                    key={sliderCollection.id}
                    to={`/collections/${sliderCollection.handle}`}
                    className="category-container"
                  >
                    {sliderCollection.image && (
                      <Image
                        sizes="(min-width: 45em) 20vw, 40vw"
                        src={`${sliderCollection.image.url}?width=600&quality=7`}
                        srcSet={`${sliderCollection.image.url}?width=300&quality=7 300w,
                                 ${sliderCollection.image.url}?width=600&quality=7 600w,
                                 ${sliderCollection.image.url}?width=1200&quality=7 1200w`}
                        alt={
                          sliderCollection.image.altText ||
                          sliderCollection.title
                        }
                        className="category-image"
                        width={150}
                        height={150}
                        loading="eager"
                      />
                    )}
                    <div className="category-title">
                      {sliderCollection.title}
                    </div>
                  </Link>
                ),
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row w-[100%]">
        {isDesktop && (
          <div className="w-[220px]">
            <FiltersDrawer
              filters={collection.products.filters}
              appliedFilters={appliedFilters}
              collections={[
                {handle: 'apple', title: 'Apple'},
                {handle: 'gaming', title: 'Gaming'},
                {handle: 'laptops', title: 'Laptops'},
                {handle: 'desktops', title: 'Desktops'},
                {handle: 'pc-parts', title: 'PC Parts'},
                {handle: 'networking', title: 'Networking'},
                {handle: 'monitors', title: 'Monitors'},
                {handle: 'mobiles', title: 'Mobile Phones'},
                {handle: 'tablets', title: 'Tablets'},
                {handle: 'audio', title: 'Audio'},
                {handle: 'accessories', title: 'Accessories'},
                {handle: 'fitness', title: 'Fitness'},
                {handle: 'photography', title: 'Photography'},
                {handle: 'home-appliances', title: 'Home Appliances'},
              ]}
              onRemoveFilter={handleFilterRemove}
            />
          </div>
        )}

        <div className="flex-1 mt-[94px]">
          <hr className="col-hr"></hr>

          <div className="view-container">
            <div className="layout-controls">
              <span className="number-sort">View As:</span>
              {screenWidth >= 300 && (
                <button
                  className={`layout-buttons first-btn ${
                    numberInRow === 1 ? 'active' : ''
                  }`}
                  onClick={() => handleLayoutChange(1)}
                >
                  {/* SVG Icon */}
                  {/* ... Your SVG code ... */}1
                </button>
              )}
              {screenWidth >= 300 && (
                <button
                  className={`layout-buttons ${
                    numberInRow === 2 ? 'active' : ''
                  }`}
                  onClick={() => handleLayoutChange(2)}
                >
                  {/* SVG Icon */}
                  {/* ... Your SVG code ... */}2
                </button>
              )}
              {screenWidth >= 550 && (
                <button
                  className={`layout-buttons ${
                    numberInRow === 3 ? 'active' : ''
                  }`}
                  onClick={() => handleLayoutChange(3)}
                >
                  {/* SVG Icon */}
                  {/* ... Your SVG code ... */}3
                </button>
              )}
              {screenWidth >= 1200 && (
                <button
                  className={`layout-buttons ${
                    numberInRow === 4 ? 'active' : ''
                  }`}
                  onClick={() => handleLayoutChange(4)}
                >
                  {/* SVG Icon */}
                  {/* ... Your SVG code ... */}4
                </button>
              )}
              {screenWidth >= 1500 && (
                <button
                  className={`layout-buttons ${
                    numberInRow === 5 ? 'active' : ''
                  }`}
                  onClick={() => handleLayoutChange(5)}
                >
                  {/* SVG Icon */}
                  {/* ... Your SVG code ... */}5
                </button>
              )}
            </div>
            <DrawerFilter
              filters={collection.products.filters}
              appliedFilters={appliedFilters}
              numberInRow={numberInRow}
              onLayoutChange={handleLayoutChange}
              productNumber={collection.products.nodes.length}
              isDesktop={isDesktop}
            />
          </div>

          {/* Product Grid */}
          <div className={`products-grid grid-cols-${numberInRow}`}>
            {sortedProducts.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                index={index}
                numberInRow={numberInRow}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={goPrev}
              disabled={!pageInfo.hasPreviousPage}
              className="pagination-button"
            >
              ← Previous Page
            </button>

            <button
              onClick={goNext}
              disabled={!pageInfo.hasNextPage}
              className="pagination-button"
            >
              Next Page →
            </button>
          </div>
        </div>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/**
 * ProductItem Component
 */
const ProductItem = React.memo(({product, index, numberInRow}) => {
  const ref = useRef(null);
  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    // Check if the product is sold out (no variants are available for sale)
    const soldOut = !product.variants.nodes.some(
      (variant) => variant.availableForSale,
    );
    setIsSoldOut(soldOut); // Update the state
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState(() => {
    return product.variants.nodes[0];
  });

  const variantUrl = useVariantUrl(
    product.handle,
    selectedVariant.selectedOptions,
  );

  const hasDiscount =
    product.compareAtPriceRange &&
    product.compareAtPriceRange.minVariantPrice.amount >
      product.priceRange.minVariantPrice.amount;

  return (
    <div className="product-item-collection product-card" ref={ref}>
      <div>
        <div className="mobile-container">
          <Link
            key={product.id}
            prefetch="intent"
            to={variantUrl}
            className="collection-product-link"
          >
            {product.featuredImage && (
              <div className="collection-product-image">
                {/* Sold-out banner */}
                {isSoldOut && (
                  <div className="sold-out-ban">
                    <p>Sold Out</p>
                  </div>
                )}
                <Image
                  src={`${product.featuredImage.url}?width=300&quality=15`}
                  srcSet={`${product.featuredImage.url}?width=300&quality=15 300w,
                           ${product.featuredImage.url}?width=600&quality=15 600w,
                           ${product.featuredImage.url}?width=1200&quality=15 1200w`}
                  alt={product.featuredImage.altText || product.title}
                  loading="lazy"
                  width="180px"
                  height="180px"
                />
              </div>
            )}
          </Link>
          <div className="product-info-container">
            <Link key={product.id} prefetch="intent" to={variantUrl}>
              <h4>{truncateText(product.title, 30)}</h4>
              <p className="product-description">
                {truncateText(product.description, 90)}
              </p>
              <div className="price-container">
                <small
                  className={`product-price ${hasDiscount ? 'discounted' : ''}`}
                >
                  <Money data={selectedVariant.price} />
                </small>
                {/* Optional: Uncomment if you want to show compare at price
                {hasDiscount && selectedVariant.compareAtPrice && (
                  <small className="discountedPrice">
                    <Money data={selectedVariant.compareAtPrice} />
                  </small>
                )} */}
              </div>
            </Link>
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * ProductForm Component
 */
function ProductForm({product, selectedVariant, setSelectedVariant}) {
  const {open} = useAside();
  const hasVariants = product.variants.nodes.length > 1;

  return (
    <div className="product-form">
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          if (hasVariants) {
            // Navigate to product page
            window.location.href = `/products/${encodeURIComponent(
              product.handle,
            )}`;
          } else {
            open('cart');
          }
        }}
        lines={
          selectedVariant && !hasVariants
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  attributes: [],
                  product: {
                    ...product,
                    selectedVariant,
                    handle: product.handle,
                  },
                },
              ]
            : []
        }
      >
        {!selectedVariant?.availableForSale
          ? 'Sold out'
          : hasVariants
          ? 'Select Options'
          : 'Add to cart'}
      </AddToCartButton>
    </div>
  );
}

/**
 * GraphQL Queries Fragments and Queries
 */
const MENU_QUERY = `#graphql
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `#graphql
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      image {
        url
        altText
      }
    }
  }
`;

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    description
    featuredImage {
      id
      altText
      url
      width
      height
    }
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 25) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      image {
        url
        altText
      }
      products(
        first: $first,
        last: $last,
        after: $after,
        before: $before,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductItem
          availableForSale
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/**
 * Helper Functions and Fragments
 */

// You can keep or adjust these as per your project structure

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

/**
 * Additional CSS for Pagination (Add to your CSS file)
 *
 * .pagination-controls {
 *   display: flex;
 *   justify-content: center;
 *   align-items: center;
 *   margin: 20px 0;
 *   gap: 10px;
 * }
 *
 * .pagination-button {
 *   padding: 8px 16px;
 *   border: none;
 *   background-color: #808080;
 *   color: #fff;
 *   cursor: pointer;
 *   border-radius: 4px;
 *   transition: background-color 0.3s;
 * }
 *
 * .pagination-button:disabled {
 *   background-color: #ccc;
 *   cursor: not-allowed;
 * }
 *
 * .pagination-button:hover:not(:disabled) {
 *   background-color: #606060;
 * }
 */
