// src/components/MetaPixelManual.jsx
import {useEffect} from 'react';
import {useLocation} from 'react-router-dom'; // Adjust based on your routing library

const MetaPixel = ({pixelId}) => {
  const location = useLocation(); // Adjust based on your routing library

  useEffect(() => {
    if (!pixelId) return;

    // Insert the Meta Pixel script
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
    );

    // Initialize the Pixel
    fbq('init', pixelId);
    fbq('track', 'PageView');

    // Track page views on route changes
  }, [pixelId]);

  useEffect(() => {
    if (typeof fbq === 'function') {
      fbq('track', 'PageView');
    }
  }, [location]);

  return (
    <>
      {/* Meta Pixel Noscript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{display: 'none'}}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  );
};

export default MetaPixel;
