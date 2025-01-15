import React from 'react';
import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {BannerSlideshow} from '../components/BannerSlideshow';
import {CategorySlider} from '~/components/CollectionSlider';
import {TopProductSections} from '~/components/TopProductSections';
import BrandSection from '~/components/BrandsSection';
import {getSeoMeta} from '@shopify/hydrogen';
import {
  CollectionCircles,
  accessoriesMenu,
  appleMenu,
  audioMenu,
  camerasMenu,
  fitnessMenu,
  gamingMenu,
  homeAppliancesMenu,
  laptopsMenu,
  mobilesMenu,
  monitorsMenu,
  networkingMenu,
  partsMenu,
  tabletsMenu,
} from '~/components/CollectionCircles';

const cache = new Map();

const MANUAL_MENU_HANDLES = [
  'apple',
  'gaming',
  'laptops',
  'desktops',
  'pc-parts',
  'networking',
  'monitors',
  'mobiles',
  'tablets',
  'audio',
  'accessories',
  'fitness',
  'photography',
  'home-appliances',
];

/**
 * @type {MetaFunction}
 */
export const meta = ({data}) => {
  const truncate = (text, maxLength) =>
    text?.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
  return getSeoMeta({
    title: data?.title || 'Default Title',
    description: truncate(
      data?.description || 'Default description for this page.',
      150,
    ),
    url: data?.url || 'https://macarabia.me',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: data?.title || 'Default Title',
        description: truncate(
          data?.description || 'Default description for this page.',
          150,
        ),
        url: data?.url || 'https://macarabia.me',
      },
      {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        name: 'Macarabia.me',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://macarabia.me/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
        url: 'https://macarabia.me',
      },
    ],
  });
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  const cacheKey = 'homepage-data';
  const cacheTTL = 86400 * 1000; // 24 hours in milliseconds
  const now = Date.now();

  // Check if data is in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData && cachedData.expiry > now) {
    return defer(cachedData.value, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  }

  const banners = [
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/macbook-pro-m4-banner_756f37f6-cf6d-4484-80ed-8b510a64db28.jpg?v=1731332730',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/macbook-pro-m4-mobilebanner.jpg?v=1731333133',
      link: '/collections/apple-macbook',
    },
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/google-pixel-banner.jpg?v=1728123476',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/google-pixel-mobilebanner.jpg?v=1728123476',
      link: '/collections/google-products',
    },
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/remarkable-pro-banner_25c8cc9c-14de-4556-9e8f-5388ebc1eb1d.jpg?v=1729676718',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/remarkable-pro-mobile-banner-1.jpg?v=1729678484',
      link: '/collections/remarkable-tablets',
    },
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/samsung-flip-fold-6.jpg?v=1727957859',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/samsung-flip-fold6.jpg?v=1727957858',
      link: '/collections/samsung-mobile-phones',
    },
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/iphone-16-banner.jpg?v=1726322159',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/iphone-16-Mobile.jpg?v=1726321600',
      link: '/collections/apple-iphone',
    },
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/iphone-16-Pro_655c6ee7-a66c-4ed9-9976-99be3122e7b6.jpg?v=1726321897',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/iphone-16-Pro-mobile.jpg?v=1726321600',
      link: '/collections/apple-iphone',
    },
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Garmin.jpg?v=1726321601',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Garmin-mobile-banner.jpg?v=1726321601',
      link: '/products/garmin-fenix®-8-47-mm-amoled-sapphire-premium-multisport-gps-watch',
    },
    {
      desktopImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/ipad-banner-2_a2c3f993-278f-48c1-82de-ac42ceb6f3fc.jpg?v=1716031887',
      mobileImageUrl:
        'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/ipad_3a178a79-4428-4aac-b5bd-41ad3f04e33a.jpg?v=1716031354',
      link: '/collections/apple-ipad',
    },
  ];

  const criticalData = await loadCriticalData(args);

  // Define all collection handles you want to display using TopProductSections
  const TOP_PRODUCT_HANDLES = [
    'new-arrivals',
    'apple-accessories',
    'apple-macbook',
    'apple-imac',
    'gaming-laptops',
    'gaming-desktops',
    'console-games',
    'hp',
    'lenovo',
    'microsoft-surface-accessories',
    'motherboards',
    'cpus',
    'cpu-coolers',
    'gpu',
    'wifi-routers',
    'wifi-range-extenders',
    'switches',
    'msi-monitors',
    'aoc-monitors',
    'asus-monitors',
    'mobile-accessories',
    'apple-iphone',
    'samsung-mobile-phones',
    'tablet-accessories',
    'digital-text',
    'samsung-tablets',
    'earbuds',
    'headphones',
    'speakers',
    'computer-accessories',
    'electric-screwdrivers',
    'car-accessories',
    'fitness-bands',
    'samsung-watches',
    'amazfit-watches',
    'action-cameras',
    'action-cameras-accessories',
    'cameras',
    'drones',
    'kitchen-appliances',
    'cleaning-devices',
    'lighting',
  ];

  // Fetch all TopProductSections collections based on TOP_PRODUCT_HANDLES
  const fetchedTopProducts = await Promise.all(
    TOP_PRODUCT_HANDLES.map((handle) =>
      fetchCollectionByHandle(args.context, handle),
    ),
  );

  // Organize TopProductSections collections into an object with keys corresponding to their handles
  const topProductsByHandle = {};
  TOP_PRODUCT_HANDLES.forEach((handle, index) => {
    topProductsByHandle[handle] = fetchedTopProducts[index];
  });

  const newData = {
    banners,
    title: criticalData.title,
    description: criticalData.description,
    url: criticalData.url,
    sliderCollections: criticalData.sliderCollections,
    topProducts: topProductsByHandle, // Add fetched TopProductSections collections here
  };

  // Cache the new data
  cache.set(cacheKey, {value: newData, expiry: now + cacheTTL});

  return defer(newData, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}

async function loadCriticalData({context}) {
  const {storefront} = context;

  const menuHandles = MANUAL_MENU_HANDLES;

  const {shop} = await storefront.query(
    `#graphql
      query ShopDetails {
        shop {
          name
          description
        }
      }
    `,
  );

  const [sliderCollections] = await Promise.all([
    fetchCollectionsByHandles(context, menuHandles),
  ]);

  return {
    sliderCollections,
    title: shop.name,
    description: shop.description,
    url: 'https://macarabia.me',
  };
}

// Fetch a single collection by handle
async function fetchCollectionByHandle(context, handle) {
  const {collectionByHandle} = await context.storefront.query(
    GET_COLLECTION_BY_HANDLE_QUERY,
    {variables: {handle}},
  );
  return collectionByHandle || null;
}

// REMOVED: The entire fetchMenuCollections function
// async function fetchMenuCollections(context, menuHandles) {
//   ...
// }

// Fetch collections by handles for sliders
async function fetchCollectionsByHandles(context, handles) {
  const collectionPromises = handles.map(async (handle) => {
    const {collectionByHandle} = await context.storefront.query(
      GET_SIMPLE_COLLECTION_QUERY,
      {variables: {handle}},
    );
    return collectionByHandle || null;
  });

  const collections = await Promise.all(collectionPromises);
  return collections.filter(Boolean);
}

const brandsData = [
  {
    name: 'Apple',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/apple-new.jpg?v=1733388855',
    link: '/collections/apple',
  },
  {
    name: 'HP',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/hp-new.jpg?v=1733388855',
    link: '/collections/hp-products',
  },
  {
    name: 'MSI',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/msi-new.jpg?v=1733388855',
    link: '/collections/msi-products',
  },
  {
    name: 'Marshall',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/marshall-new.jpg?v=1733388855',
    link: '/collections/marshall-collection',
  },
  {
    name: 'JBL',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/jbl-new.jpg?v=1733388856',
    link: '/collections/jbl-collection',
  },
  {
    name: 'Dell',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/dell-new.jpg?v=1733388855',
    link: '/collections/dell-products',
  },
  {
    name: 'Garmin',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/garmin-new.jpg?v=1733393801',
    link: '/collections/garmin-smart-watch',
  },
  {
    name: 'Asus',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/asus-new.jpg?v=1733388855',
    link: '/collections/asus-products',
  },
  {
    name: 'Samsung',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/samsung-new.jpg?v=1733388855',
    link: '/collections/samsung-products',
  },
  {
    name: 'Sony',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/sony-new.jpg?v=1733389303',
    link: '/collections/sony',
  },
  {
    name: 'Benq',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/benq.jpg?v=1733388855',
    link: '/collections/benq-products',
  },
  {
    name: 'Tp-link',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/tp-link.jpg?v=1733388855',
    link: '/collections/tp-link-products',
  },
  {
    name: 'Nothing',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/nothing-new.jpg?v=1733388855',
    link: '/collections/nothing-products',
  },
  {
    name: 'Xiaomi',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/mi-new.jpg?v=1733388855',
    link: '/collections/xiaomi-products',
  },
  {
    name: 'Microsoft',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/microsoft-new.jpg?v=1733388855',
    link: '/collections/microsoft-products',
  },
  {
    name: 'Nintendo',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/nintendo-new.jpg?v=1733388855',
    link: '/collections/nintendo-products',
  },
  {
    name: 'Lenovo',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/lenovo-new.jpg?v=1733388855',
    link: '/collections/lenovo-products',
  },
  {
    name: 'LG',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/lg-new.jpg?v=1733388855',
    link: '/collections/lg-products',
  },
  {
    name: 'Meta',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/meta-new.jpg?v=1733388855',
    link: '/collections/meta-products',
  },
  {
    name: 'Ubiquiti',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/ubiquiti-new.jpg?v=1733388855',
    link: '/collections/ubiquiti-products',
  },
  {
    name: 'Philips',
    image:
      'https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Philips-new.jpg?v=1733388855',
    link: '/collections/philips-products',
  },
];

export default function Homepage() {
  const {banners, sliderCollections, topProducts} =
    useLoaderData();


  return (
    <div className="home">
      <BannerSlideshow banners={banners} />
      <CategorySlider sliderCollections={sliderCollections} />
      {topProducts['new-arrivals'] && (
        <TopProductSections collection={topProducts['new-arrivals']} />
      )}

      <CollectionCircles collections={appleMenu} />
      {topProducts['apple-accessories'] && (
        <TopProductSections collection={topProducts['apple-accessories']} />
      )}
      {topProducts['apple-macbook'] && (
        <TopProductSections collection={topProducts['apple-macbook']} />
      )}
      {topProducts['apple-imac'] && (
        <TopProductSections collection={topProducts['apple-imac']} />
      )}

      <CollectionCircles collections={gamingMenu} />
      {topProducts['gaming-laptops'] && (
        <TopProductSections collection={topProducts['gaming-laptops']} />
      )}
      {topProducts['gaming-desktops'] && (
        <TopProductSections collection={topProducts['gaming-desktops']} />
      )}
      {topProducts['console-games'] && (
        <TopProductSections collection={topProducts['console-games']} />
      )}

      <CollectionCircles collections={laptopsMenu} />
      {topProducts['hp'] && (
        <TopProductSections collection={topProducts['hp']} />
      )}
      {topProducts['lenovo'] && (
        <TopProductSections collection={topProducts['lenovo']} />
      )}
      {topProducts['microsoft-surface-accessories'] && (
        <TopProductSections
          collection={topProducts['microsoft-surface-accessories']}
        />
      )}

      {/* <CollectionCircles collections={partsMenu} />
      {topProducts['motherboards'] && (
        <TopProductSections collection={topProducts['motherboards']} />
      )}
      {topProducts['cpus'] && (
        <TopProductSections collection={topProducts['cpus']} />
      )}
      {topProducts['cpu-coolers'] && (
        <TopProductSections collection={topProducts['cpu-coolers']} />
      )}
      {topProducts['gpu'] && (
        <TopProductSections collection={topProducts['gpu']} />
      )} */}

      {/* <CollectionCircles collections={networkingMenu} />
      {topProducts['wifi-routers'] && (
        <TopProductSections collection={topProducts['wifi-routers']} />
      )}
      {topProducts['wifi-range-extenders'] && (
        <TopProductSections collection={topProducts['wifi-range-extenders']} />
      )}
      {topProducts['switches'] && (
        <TopProductSections collection={topProducts['switches']} />
      )} */}

      <CollectionCircles collections={monitorsMenu} />
      {topProducts['msi-monitors'] && (
        <TopProductSections collection={topProducts['msi-monitors']} />
      )}
      {topProducts['aoc-monitors'] && (
        <TopProductSections collection={topProducts['aoc-monitors']} />
      )}
      {topProducts['asus-monitors'] && (
        <TopProductSections collection={topProducts['asus-monitors']} />
      )}

      <CollectionCircles collections={mobilesMenu} />
      {topProducts['mobile-accessories'] && (
        <TopProductSections collection={topProducts['mobile-accessories']} />
      )}
      {topProducts['apple-iphone'] && (
        <TopProductSections collection={topProducts['apple-iphone']} />
      )}
      {topProducts['samsung-mobile-phones'] && (
        <TopProductSections collection={topProducts['samsung-mobile-phones']} />
      )}

      <CollectionCircles collections={tabletsMenu} />
      {topProducts['tablet-accessories'] && (
        <TopProductSections collection={topProducts['tablet-accessories']} />
      )}
      {topProducts['digital-text'] && (
        <TopProductSections collection={topProducts['digital-text']} />
      )}
      {topProducts['samsung-tablets'] && (
        <TopProductSections collection={topProducts['samsung-tablets']} />
      )}

      <CollectionCircles collections={audioMenu} />
      {topProducts['earbuds'] && (
        <TopProductSections collection={topProducts['earbuds']} />
      )}
      {topProducts['headphones'] && (
        <TopProductSections collection={topProducts['headphones']} />
      )}
      {topProducts['speakers'] && (
        <TopProductSections collection={topProducts['speakers']} />
      )}

      {/* <CollectionCircles collections={accessoriesMenu} />
      {topProducts['computer-accessories'] && (
        <TopProductSections collection={topProducts['computer-accessories']} />
      )}
      {topProducts['electric-screwdrivers'] && (
        <TopProductSections collection={topProducts['electric-screwdrivers']} />
      )}
      {topProducts['car-accessories'] && (
        <TopProductSections collection={topProducts['car-accessories']} />
      )} */}

      <CollectionCircles collections={fitnessMenu} />
      {topProducts['fitness-bands'] && (
        <TopProductSections collection={topProducts['fitness-bands']} />
      )}
      {topProducts['samsung-watches'] && (
        <TopProductSections collection={topProducts['samsung-watches']} />
      )}
      {topProducts['amazfit-watches'] && (
        <TopProductSections collection={topProducts['amazfit-watches']} />
      )}

      <CollectionCircles collections={camerasMenu} />
      {topProducts['action-cameras'] && (
        <TopProductSections collection={topProducts['action-cameras']} />
      )}
      {topProducts['action-cameras-accessories'] && (
        <TopProductSections
          collection={topProducts['action-cameras-accessories']}
        />
      )}
      {topProducts['cameras'] && (
        <TopProductSections collection={topProducts['cameras']} />
      )}
      {topProducts['drones'] && (
        <TopProductSections collection={topProducts['drones']} />
      )}

      <CollectionCircles collections={homeAppliancesMenu} />
      {topProducts['kitchen-appliances'] && (
        <TopProductSections collection={topProducts['kitchen-appliances']} />
      )}
      {topProducts['cleaning-devices'] && (
        <TopProductSections collection={topProducts['cleaning-devices']} />
      )}
      {topProducts['lighting'] && (
        <TopProductSections collection={topProducts['lighting']} />
      )}

      <BrandSection brands={brandsData} />
    </div>
  );
}

const GET_COLLECTION_BY_HANDLE_QUERY = `#graphql
  query GetCollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      image {
        url
        altText
      }
      products(first: 10) {
        nodes {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 4) {
            nodes {
              url
              altText
            }
          }
          variants(first: 5) {
            nodes {
              id
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MENU_QUERY = `#graphql
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        id
        title
        url
      }
    }
  }
`;

const GET_SIMPLE_COLLECTION_QUERY = `#graphql
  query GetSimpleCollection($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      image {
        url
        altText
      }
    }
  }
`;
