// src/root.jsx
import {useNonce, getShopAnalytics, Analytics} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigation,
  LiveReload,
} from '@remix-run/react';
// import favicon from '~/assets/macarabia-favicon-black_32x32.jpg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from '~/components/PageLayout';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import React, {Suspense, useEffect, useState} from 'react';
import ClarityTracker from './components/ClarityTracker';
const MetaPixel = React.lazy(() => import('./components/MetaPixel'));

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return defaultShouldRevalidate;
};

const PIXEL_ID = '321309553208857'; // Replace with your actual Pixel ID

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    // {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  try {
    const deferredData = await loadDeferredData(args);
    const criticalData = await loadCriticalData(args);
    const {storefront, env} = args.context;

    return defer({
      ...deferredData,
      ...criticalData,
      publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
      shop: getShopAnalytics({
        storefront,
        publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      }),
      consent: {
        checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
        storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        withPrivacyBanner: true,
        country: args.context.storefront.i18n.country,
        language: args.context.storefront.i18n.language,
      },
    });
  } catch (error) {
    console.error('Loader error:', error);
    throw new Response('Failed to load data', {status: 500});
  }
}

/**
 * Load data necessary for rendering content above the fold.
 */
const processMenuItems = (items) => {
  return items.map((item) => ({
    ...item,
    imageUrl: item.resource?.image?.src || null, // Extract image URL if available
    altText: item.resource?.image?.altText || item.title, // Use altText or fallback to title
    items: item.items ? processMenuItems(item.items) : [], // Recursively process submenus
  }));
};

async function loadCriticalData({context}) {
  const {storefront} = context;

  try {
    // Fetch header data using the HEADER_QUERY
    const header = await storefront.query(HEADER_QUERY, {
      variables: {headerMenuHandle: 'main-menu-2'},
    });

    // Process nested menus to extract images
    if (header?.menu?.items) {
      header.menu.items = processMenuItems(header.menu.items);
    }

    return {header};
  } catch (error) {
    return {header: null}; // Fallback in case of error
  }
}

/**
 * Load data for rendering content below the fold.
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {footerMenuHandle: 'footer-menu'},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

/**
 * Layout component for the application.
 */
export function Layout({children}) {
  const nonce = useNonce();
  const data = useRouteLoaderData('root');
  const navigation = useNavigation();
  const [nprogress, setNProgress] = useState(null); // Store NProgress instance
  const clarityId = 'pu879q40kz'; // Replace with your Clarity project ID

  useEffect(() => {
    // Load NProgress once and set it in the state
    const loadNProgress = async () => {
      const {default: NProgress} = await import('nprogress');
      await import('nprogress/nprogress.css');
      NProgress.configure({showSpinner: true});
      setNProgress(NProgress); // Set NProgress once it's loaded
    };

    if (!nprogress) {
      loadNProgress(); // Only load NProgress the first time
    }

    // Handle the route loading state
    if (navigation.state === 'loading' && nprogress) {
      nprogress.start(); // Start progress bar
    } else if (nprogress) {
      nprogress.done(); // Finish progress bar
    }

    return () => {
      // Clean up NProgress when component unmounts or state changes
      if (nprogress) {
        nprogress.done();
      }
    };
  }, [navigation.state, nprogress]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />+{' '}
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={tailwindCss}></link>
        {/* <meta
          name="google-site-verification"
          content="tGAcrZ3TpRDtQqmjqfYOuQpdBqsLCTr5YzcG7syVPEk"
        /> */}
        <Meta />
        <Links />
        <meta
          name="facebook-domain-verification"
          content="ca1idnp1x728fhk6zouywowcqgb2xt"
        />
        <script
          nonce={nonce}
          src="https://www.googletagmanager.com/gtag/js?id=G-KW81WPYWZN"
        ></script>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-KW81WPYWZN');
            `,
          }}
        ></script>
        <Suspense fallback={null}>
          <MetaPixel pixelId={PIXEL_ID} />
        </Suspense>
      </head>
      <body>
        <ClarityTracker clarityId={clarityId} />
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Main app component rendering the current route.
 */
export default function App() {
  return <Outlet />;
}

/**
 * Error boundary component for catching route errors.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'An unexpected error occurred.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || 'Route error occurred.';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error) {
    errorMessage = String(error);
  }

  console.error('ErrorBoundary caught an error:', {
    error,
    errorMessage,
    errorStatus,
  });

  // Common error page styling
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '6rem',
    fontWeight: 'bold',
    margin: '0 0 10px',
    color: '#232323',
  };

  const messageStyle = {
    fontSize: '1.5rem',
    marginBottom: '20px',
  };

  const linkStyle = {
    fontSize: '1rem',
    color: '#232323',
    textDecoration: 'none',
    padding: '10px 20px',
    border: '1px solid #232323',
    borderRadius: '30px',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#232323';
    e.target.style.color = '#fff';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#fff';
    e.target.style.color = '#232323';
  };

  // Render the error page with appropriate status and message
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{errorStatus}</h1>
      <p style={messageStyle}>{errorMessage}</p>
      <a
        href="/"
        style={linkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Go to Homepage
      </a>
    </div>
  );
}

/** @typedef {LoaderReturnData} RootLoader */

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@remix-run/react').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
