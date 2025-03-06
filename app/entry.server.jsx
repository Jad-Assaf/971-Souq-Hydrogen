// entry.server.jsx
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
    scriptSrc: [
      "'self'", // Allow scripts from the same origin
      'https://www.clarity.ms', // Allow scripts from clarity.ms
      'https://*.clarity.ms', // Allow scripts from clarity.ms
      'https://x.clarity.ms',
      'https://c.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com', // Allow scripts from Shopify CDN
      'https://www.facebook.com',
      'https://connect.facebook.net', // Required for Meta Pixel
      'https://www.youtube.com',
      'https://youtube.com',
      'https://img.icons8.com',
      'https://google.com',
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://stats.g.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
    ],
    connectSrc: [
      "'self'", // Allow scripts from the same origin
      'https://www.clarity.ms', // Allow scripts from clarity.ms
      'https://*.clarity.ms', // Allow scripts from clarity.ms
      'https://x.clarity.ms',
      'https://c.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com', // Allow scripts from Shopify CDN
      'https://www.facebook.com',
      'https://connect.facebook.net', // Required for Meta Pixel
      'https://www.youtube.com',
      'https://youtube.com',
      'https://img.icons8.com',
      'https://google.com',
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://stats.g.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
    ],
    frameSrc: [
      "'self'", // Allow frames from the same origin
      'https://www.clarity.ms',
      'https://*.clarity.ms',
      'https://x.clarity.ms',
      'https://c.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com',
      'https://www.facebook.com',
      'https://connect.facebook.net',
      'https://www.youtube.com',
      'https://youtube.com',
      'https://www.youtube-nocookie.com', // Allow YouTube no-cookie domain
      'https://img.icons8.com',
      'https://player.vimeo.com', // If you use Vimeo as well
      'https://google.com',
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://stats.g.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
    ],
    imgSrc: [
      "'self'", // Allow images from the same origin
      'https://www.clarity.ms',
      'https://*.clarity.ms',
      'https://x.clarity.ms',
      'https://c.clarity.ms',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://cdn.shopify.com',
      'https://www.facebook.com',
      'https://connect.facebook.net',
      'https://www.youtube.com',
      'https://youtube.com',
      'https://img.youtube.com', // Allow YouTube thumbnails
      'https://i.ytimg.com', // Alternate YouTube thumbnail domains
      'https://img.icons8.com',
      'https://google.com',
      'https://www.google.com',
      'https://www.googletagmanager.com',
      'https://www.googletagmanager.com/',
      'https://www.google.com.lb',
      'https://analytics.google.com/',
      'https://td.doubleclick.net/',
      'https://stats.g.doubleclick.net/',
      'https://googleads.g.doubleclick.net',
    ],
    mediaSrc: [
      "'self'",
      'https://cdn.shopify.com', // Shopify CDN for direct videos
      'https://www.971souq.ae',
      'https://971souq.ae',
      'https://971souq.myshopify.com',
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://img.icons8.com',
      'https://youtube.com',
      'https://youtu.be',
      // Add other media sources as needed
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
