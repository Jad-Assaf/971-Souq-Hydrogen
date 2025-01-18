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
  const url = new URL(request.url);
  if (url.hostname === 'www.971souq.ae') {
    const redirectUrl = `https://971souq.ae${url.pathname}${url.search}`;
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
      'https://x.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com', // Allow scripts from Shopify CDN
      'https://connect.facebook.net', // Required for Meta Pixel
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
    ],
    connectSrc: [
      "'self'", // Allow scripts from the same origin
      'https://www.clarity.ms', // Allow scripts from clarity.ms
      'https://*.clarity.ms', // Allow scripts from clarity.ms
      'https://x.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com', // Allow scripts from Shopify CDN
      'https://connect.facebook.net', // Required for Meta Pixel
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
    ],
    frameSrc: [
      "'self'", // Allow scripts from the same origin
      'https://www.clarity.ms', // Allow scripts from clarity.ms
      'https://*.clarity.ms', // Allow scripts from clarity.ms
      'https://x.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com', // Allow scripts from Shopify CDN
      'https://connect.facebook.net', // Required for Meta Pixel
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
    ],
    imgSrc: [
      "'self'", // Allow scripts from the same origin
      'https://www.clarity.ms', // Allow scripts from clarity.ms
      'https://*.clarity.ms', // Allow scripts from clarity.ms
      'https://x.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com', // Allow scripts from Shopify CDN
      'https://connect.facebook.net', // Required for Meta Pixel
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
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
