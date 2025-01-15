import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} remixContext
 * @param {AppLoadContext} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  context,
) {
  // Redirect logic for www.macarabia.me to macarabia.me
  const url = new URL(request.url);
  if (url.hostname === 'www.macarabia.me') {
    // Redirect to macarabia.me with the same path and query params
    const redirectUrl = `https://macarabia.me${url.pathname}${url.search}`;
    return new Response(null, {
      status: 301,
      headers: {
        Location: redirectUrl,
      },
    });
  }

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Add your custom script sources here
    scriptSrc: [
      "'self'", // Allow scripts from the same origin
      'https://www.clarity.ms', // Allow scripts from clarity.ms
      'https://*.clarity.ms', // Allow scripts from clarity.ms
      'https://cdn.shopify.com', // Allow scripts from Shopify CDN
      'https://connect.facebook.net', // Required for Meta Pixel
    ],
    connectSrc: [
      "'self'", // Allow connections to the same origin
      'https://x.clarity.ms', // Allow connections to Clarity
      'https://*.clarity.ms', // Allow connections to any subdomain of clarity.ms
      'https://monorail-edge.shopifysvc.com', // Allow Shopify service connections
      'https://connect.facebook.net', // Required for Meta Pixel
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://cdn.shopify.com',
      'https://cdn.shopifycdn.com',
      'https://*.shopifycdn.com',
      'https://macarabia.me',
      'https://www.facebook.com', // if you need the FB Pixel 1x1
      // etc.
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/remix-oxygen').EntryContext} EntryContext */
/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
