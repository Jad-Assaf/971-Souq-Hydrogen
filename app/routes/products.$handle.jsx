import React, {Suspense, useEffect, useState} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData, useLocation} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  Money,
  getSeoMeta,
  CartForm,
  VariantSelector,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImages} from '~/components/ProductImage';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import '../styles/ProductPage.css';
import {CSSTransition} from 'react-transition-group';
import {RELATED_PRODUCTS_QUERY} from '~/lib/fragments';
import RelatedProductsRow from '~/components/RelatedProducts';
import {ProductMetafields} from '~/components/Metafields';
import RecentlyViewedProducts from '../components/RecentlyViewed';

export const meta = ({data}) => {
  const product = data?.product;
  const variants = product?.variants?.nodes || [];
  const currentVariant = variants[0] || {};

  // Helper to truncate title
  const truncate = (text, maxLength) =>
    text?.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;

  const image =
    product.images?.edges?.[0]?.node?.url ||
    'https://cdn.shopify.com/s/files/1/0858/6821/6639/files/971Souqlogo01_303ae373-185d-40f3-8271-df151d977a10.png?v=1706447237';

  return getSeoMeta({
    title: truncate(
      product?.seoTitle || product?.title || '971Souq Product',
      140,
    ),
    description: truncate(
      product?.seoDescription ||
        product?.description ||
        'Discover this product.',
      150,
    ),
    url: `https://971souq.ae/products/${encodeURIComponent(product?.handle)}`,
    'og:image': image,
    'twitter:image': image,
    jsonLd: [
      {
        '@context': 'http://schema.org/',
        '@type': 'Product',
        name: truncate(product?.title, 140),
        url: `https://971souq.ae/products/${encodeURIComponent(
          product?.handle,
        )}`,
        sku: currentVariant?.sku || product?.id,
        productID: product?.id,
        brand: {
          '@type': 'Brand',
          name: product?.vendor || '971Souq',
        },
        description: truncate(product?.description || '', 150),
        image:
          product?.firstImage ||
          'https://cdn.shopify.com/s/files/1/0858/6821/6639/files/971Souqlogo01_303ae373-185d-40f3-8271-df151d977a10.png?v=1706447237',
        offers: variants.map((variant) => ({
          '@type': 'Offer',
          priceCurrency:
            product?.priceRange?.minVariantPrice?.currencyCode || 'USD',
          price: variant?.price?.amount || '0.00',
          itemCondition: 'http://schema.org/NewCondition',
          availability: variant?.availableForSale
            ? 'http://schema.org/InStock'
            : 'http://schema.org/OutOfStock',
          url: `https://971souq.ae/products/${encodeURIComponent(
            product?.handle,
          )}?variant=${variant?.id}`,
          image: variant?.image?.url || product?.firstImage || '',
          name: truncate(`${product?.title} - ${variant?.title || ''}`, 140),
          sku: variant?.sku || variant?.id,
          gtin12:
            variant?.barcode?.length === 12 ? variant?.barcode : undefined,
          gtin13:
            variant?.barcode?.length === 13 ? variant?.barcode : undefined,
          gtin14:
            variant?.barcode?.length === 14 ? variant?.barcode : undefined,
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
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
        })),
        aggregateRating: product?.metafields?.spr?.reviews
          ? {
              '@type': 'AggregateRating',
              ratingValue: parseFloat(
                product.metafields.spr.reviews
                  .split('"ratingValue": "')[1]
                  ?.split('"')[0] || 0,
              ),
              ratingCount: parseInt(
                product.metafields.spr.reviews
                  .split('"reviewCount": "')[1]
                  ?.split('"')[0] || 0,
                10,
              ),
            }
          : undefined,
      },
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
            name: truncate(product?.title || 'Product', 140),
            item: `https://971souq.ae/products/${encodeURIComponent(
              product?.handle,
            )}`,
          },
        ],
      },
    ],
  });
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Fetch product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request) || [],
    },
  });

  if (!product) {
    throw new Response('Product not found', {status: 404});
  }

  // Select the first variant as the default if applicable
  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  // If there's no valid selectedVariant, just assign the firstVariant.
  if (!product.selectedVariant) {
    product.selectedVariant = firstVariant;
  }

  // Extract the first image
  const firstImage = product.images?.edges?.[0]?.node?.url || null;

  // Fetch related products
  const productType = product.productType || 'General';
  const {products} = await storefront.query(RELATED_PRODUCTS_QUERY, {
    variables: {productType},
  });

  const relatedProducts = products?.edges.map((edge) => edge.node) || [];

  // Return necessary product data including SEO, first image, and variant price
  return {
    product: {
      ...product,
      firstImage, // Add the first image URL
      seoTitle: product.seo?.title || product.title, // Use SEO title or fallback
      seoDescription: product.seo?.description || product.description, // Use SEO description or fallback
      variantPrice: firstVariant?.price || product.priceRange?.minVariantPrice, // Variant price
    },
    relatedProducts,
  };
}

function loadDeferredData({context, params}) {
  const {storefront} = context;

  const variants = storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {variants};
}

function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: `/products/${encodeURIComponent(product.handle)}`,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {status: 302},
  );
}

// -------------- ProductForm --------------

function isValueAvailable(allVariants, selectedOptions, optionName, val) {
  const updated = {...selectedOptions, [optionName]: val};

  // Find any in-stock variant that fully matches updated
  return Boolean(
    allVariants.find((variant) => {
      if (!variant.availableForSale) return false;
      return variant.selectedOptions.every(
        (so) => updated[so.name] === so.value,
      );
    }),
  );
}

/**
 * We attempt a perfect match for newOptions.
 * If that fails, we fallback to any in-stock variant
 * that has (optionName === chosenVal),
 * then override newOptions with that variant’s entire selection.
 */
function pickOrSnapVariant(allVariants, newOptions, optionName, chosenVal) {
  // 1) Perfect match
  let found = allVariants.find(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.every((so) => newOptions[so.name] === so.value),
  );

  // 2) If no perfect match, fallback
  if (!found) {
    found = allVariants.find((v) => {
      if (!v.availableForSale) return false;
      const picked = v.selectedOptions.find((so) => so.name === optionName);
      return picked && picked.value === chosenVal;
    });
  }

  return found || null;
}

export function ProductForm({
  product,
  selectedVariant,
  onVariantChange,
  variants = [],
  quantity = 1,
}) {
  const location = useLocation();
  const {open} = useAside();

  // ------------------------------
  // Initialize local selectedOptions
  // ------------------------------
  const [selectedOptions, setSelectedOptions] = useState(() => {
    if (selectedVariant?.selectedOptions) {
      return selectedVariant.selectedOptions.reduce((acc, {name, value}) => {
        acc[name] = value;
        return acc;
      }, {});
    }
    // If no initial variant, fallback to the first option value
    return product.options.reduce((acc, option) => {
      acc[option.name] = option.values[0]?.value || '';
      return acc;
    }, {});
  });

  // Sync local state when the parent’s selectedVariant changes
  useEffect(() => {
    if (!selectedVariant?.selectedOptions) return;
    setSelectedOptions(
      selectedVariant.selectedOptions.reduce((acc, {name, value}) => {
        acc[name] = value;
        return acc;
      }, {}),
    );
  }, [selectedVariant, product]);

  // ------------------------------
  // Handle user picking a new value
  // ------------------------------
  function handleOptionChange(optionName, chosenVal) {
    setSelectedOptions((prev) => {
      const newOptions = {...prev, [optionName]: chosenVal};

      // Attempt to find or “snap” to a variant
      const found = pickOrSnapVariant(
        variants,
        newOptions,
        optionName,
        chosenVal,
      );

      if (found) {
        // Overwrite newOptions with found's entire set
        found.selectedOptions.forEach(({name, value}) => {
          newOptions[name] = value;
        });
        onVariantChange(found);
      } else {
        // Revert
        newOptions[optionName] = prev[optionName];
      }

      // Update the URL with final newOptions
      const params = new URLSearchParams(newOptions).toString();
      window.history.replaceState(null, '', `${location.pathname}?${params}`);

      return newOptions;
    });
  }

  // Ensure quantity is safe
  const safeQuantity = Math.max(Number(quantity) || 1, 1);

  // Subcomponent to render each option row
  const ProductOptions = ({option}) => {
    const {name, values} = option;
    const currentValue = selectedOptions[name];

    return (
      <div className="product-options" key={name}>
        <h5 className="OptionName">
          {name}: <span className="OptionValue">{currentValue}</span>
        </h5>
        <div className="product-options-grid">
          {values.map(({value, variant}) => {
            // Check if picking this new val is possible
            const canPick = isValueAvailable(
              variants,
              selectedOptions,
              name,
              value,
            );
            const isActive = currentValue === value;

            // For color swatches, optionally show an image
            const isColorOption = name.toLowerCase() === 'color';
            const variantImage = isColorOption && variant?.image?.url;

            return (
              <button
                key={name + value}
                onClick={() => handleOptionChange(name, value)}
                className={`product-options-item ${isActive ? 'active' : ''}`}
                style={{
                  opacity: canPick ? 1 : 0.3,
                  border: isActive ? '1px solid #000' : '1px solid transparent',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease-in-out',
                  backgroundColor: isActive ? '#e6f2ff' : '#f0f0f0',
                  boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transform: isActive ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                {variantImage ? (
                  <img
                    src={variantImage}
                    alt={value}
                    width="50"
                    height="50"
                    style={{objectFit: 'cover'}}
                  />
                ) : (
                  value
                )}
              </button>
            );
          })}
        </div>
        <br />
      </div>
    );
  };

  // Possibly build a WhatsApp link
  const isProductPage = location.pathname.includes('/products/');
  const whatsappShareUrl = `https://api.whatsapp.com/send?phone=9613020030&text=${encodeURIComponent(
    `Hi, I'd like to buy ${product.title} https://971souq.ae${location.pathname}`,
  )}`;

  // WhatsApp SVG icon (if you still want the share button)
  const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.216 175.552">
      <defs>
        <linearGradient
          id="b"
          x1="85.915"
          x2="86.535"
          y1="32.567"
          y2="137.092"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#57d163" />
          <stop offset="1" stopColor="#23b33a" />
        </linearGradient>
        <filter
          id="a"
          width="1.115"
          height="1.114"
          x="-.057"
          y="-.057"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="3.531" />
        </filter>
      </defs>
      <path
        fill="#b3b3b3"
        d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
        filter="url(#a)"
      />
      <path
        fill="#fff"
        d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
      />
      <path
        fill="url(#b)"
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
      />
    </svg>
  );

  return (
    <>
      {/* Renders the variant options (size, color, etc.) */}
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((o) => o.values.length > 1)}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>

      <div className="product-form">
        {/* An Add-to-Cart button with the found (or parent’s) selectedVariant */}
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => open('cart')}
          lines={
            selectedVariant
              ? [{merchandiseId: selectedVariant.id, quantity: safeQuantity}]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>

        {/* Optional WhatsApp share link */}
        {isProductPage && (
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-share-button"
            aria-label="Share on WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        )}
      </div>
    </>
  );
}

// function DirectCheckoutButton({selectedVariant, quantity}) {
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [shouldRedirect, setShouldRedirect] = useState(false);

//   const handleAnimation = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setIsAnimating(false);
//       setShouldRedirect(true);
//     }, 300);
//   };

//   useEffect(() => {
//     return () => {
//       setShouldRedirect(false);
//     };
//   }, []);

//   const isUnavailable = !selectedVariant?.availableForSale;

//   return (
//     <CartForm
//       route="/cart"
//       action={CartForm.ACTIONS.LinesAdd}
//       inputs={{
//         lines: [
//           {
//             merchandiseId: selectedVariant?.id,
//             quantity: quantity,
//             selectedOptions: selectedVariant?.selectedOptions,
//           },
//         ],
//       }}
//     >
//       {(fetcher) => {
//         if (shouldRedirect && fetcher.data?.cart?.checkoutUrl) {
//           window.location.href = fetcher.data.cart.checkoutUrl;
//         }

//         return (
//           <motion.button
//             type="submit"
//             disabled={isUnavailable || fetcher.state !== 'idle'}
//             className={`buy-now-button ${isUnavailable ? 'disabled' : ''}`}
//             onClick={handleAnimation}
//             animate={isAnimating ? { scale: 1.05 } : { scale: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             Buy Now
//           </motion.button>
//         );
//       }}
//     </CartForm>
//   );
// }
// ─────────────────────────────────────────────────────────────────────────────

export default function Product() {
  const {product, variants, relatedProducts} = useLoaderData();
  const [selectedVariant, setSelectedVariant] = useState(
    product.selectedVariant,
  );

  useEffect(() => {
    setSelectedVariant(product.selectedVariant);
    setQuantity(1); // If you want to reset quantity to 1 for new product
  }, [product]);

  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState(0);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (selectedVariant && selectedVariant.price) {
      const price = parseFloat(selectedVariant.price.amount);
      setSubtotal(price * quantity);
    }
  }, [quantity, selectedVariant]);

  const {title, descriptionHtml, images} = product;

  const hasDiscount =
    selectedVariant?.compareAtPrice &&
    selectedVariant.price.amount !== selectedVariant.compareAtPrice.amount;

  return (
    <div className="product">
      <div className="ProductPageTop">
        <ProductImages
          images={product.images.edges}
          selectedVariantImage={selectedVariant?.image}
        />
        <div className="product-main">
          <h1>{title}</h1>
          <div className="price-container">
            <small
              className={`product-price ${hasDiscount ? 'discounted' : ''}`}
            >
              <Money data={selectedVariant?.price} />
            </small>
            {/* {hasDiscount && selectedVariant.compareAtPrice && (
              <small className="discountedPrice">
                <Money data={selectedVariant?.compareAtPrice} />
              </small>
            )} */}
          </div>
          <div className="quantity-selector">
            <p>Quantity</p>
            <button onClick={decrementQuantity} className="quantity-btn">
              -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button onClick={incrementQuantity} className="quantity-btn">
              +
            </button>
          </div>
          <div className="subtotal">
            <strong>Subtotal: </strong>
            {subtotal.toLocaleString('en-US', {
              style: 'currency',
              currency: selectedVariant?.price?.currencyCode || 'USD',
            })}
          </div>

          <Suspense fallback={<div>Loading options...</div>}>
            <Await resolve={variants}>
              {({product: variantProduct}) => (
                <ProductForm
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                  variants={variantProduct.variants.nodes}
                  quantity={Number(quantity)}
                />
              )}
            </Await>
          </Suspense>

          <hr className="productPage-hr" />
          <div className="product-details">
            <ul>
              <li>
                <strong>Vendor:</strong> {product.vendor || 'N/A'}
              </li>
              <li>
                <strong>SKU:</strong> {selectedVariant?.sku || 'N/A'}
              </li>
              <li>
                <strong>Availability:</strong>{' '}
                {selectedVariant?.availableForSale
                  ? 'In Stock'
                  : 'Out of Stock'}
              </li>
              <li>
                <strong>Product Type:</strong> {product.productType || 'N/A'}
              </li>
            </ul>
          </div>
          <hr className="productPage-hr"></hr>
          <ProductMetafields
            metafieldCondition={product.metafieldCondition}
            metafieldWarranty={product.metafieldWarranty}
            metafieldShipping={product.metafieldShipping}
            metafieldVat={product.metafieldVat}
          />
        </div>
      </div>
      <div className="ProductPageBottom">
        <div className="tabs">
          <button
            className={`tab-button ${
              activeTab === 'description' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Exchange
          </button>
          <button
            className={`tab-button ${activeTab === 'warranty' ? 'active' : ''}`}
            onClick={() => setActiveTab('warranty')}
          >
            Warranty
          </button>
        </div>

        <CSSTransition
          in={activeTab === 'description'}
          timeout={200}
          classNames="fade"
          unmountOnExit
        >
          <div className="product-section">
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeTab === 'shipping'}
          timeout={200}
          classNames="fade"
          unmountOnExit
        >
          <div className="product-section">
            <h3>Shipping Policy</h3>
            <p>
              We offer shipping across all Lebanon, facilitated by our dedicated
              delivery team servicing the Beirut district and through our
              partnership with Wakilni for orders beyond Beirut.
            </p>
            <p>
              Upon placing an order, we provide estimated shipping and delivery
              dates tailored to your item's availability and selected product
              options. For precise shipping details, kindly reach out to us
              through the contact information listed in our Contact Us section.
            </p>
            <p>
              Please be aware that shipping rates may vary depending on the
              destination.
            </p>
            <h3>Exchange Policy</h3>
            <p>
              We operate a 3-day exchange policy, granting you 3 days from
              receipt of your item to initiate an exchange.
            </p>
            <p>
              To qualify for an exchange, your item must remain in its original
              condition, unworn or unused, with tags intact, and in its original
              sealed packaging. Additionally, you will need to provide a receipt
              or proof of purchase.
            </p>
            <p>
              To initiate an exchange, please contact us at admin@971souq.ae.
              Upon approval of your exchange request, we will furnish you with
              an exchange shipping label along with comprehensive instructions
              for package return. Please note that exchanges initiated without
              prior authorization will not be accepted.
            </p>
            <p>
              Should you encounter any damages or issues upon receiving your
              order, please inspect the item immediately and notify us promptly.
              We will swiftly address any defects, damages, or incorrect
              shipments to ensure your satisfaction.
            </p>
            <h5>Exceptions / Non-exchangeable Items</h5>
            <p>
              Certain items are exempt from our exchange policy, including
              perishable goods (such as headsets, earphones, and network card
              wifi routers), custom-made products (such as special orders or
              personalized items), and pre-ordered goods. For queries regarding
              specific items, please reach out to us.
            </p>
            <p>
              Unfortunately, we are unable to accommodate exchanges for sale
              items or gift cards.
            </p>
            <h5>Exchanges</h5>
            <p>
              The most efficient method to secure the item you desire is to
              exchange the original item, and upon acceptance of your exchange,
              proceed with a separate purchase for the desired replacement.
            </p>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeTab === 'warranty'}
          timeout={200}
          classNames="fade"
          unmountOnExit
        >
          <div className="product-section">
            <h3>Operational Warranty Terms and Conditions</h3>
            <h3>Warranty Coverage</h3>
            <p>
              This warranty applies to All Products, purchased from 971Souq. The
              warranty covers defects in materials and workmanship under normal
              use for the period specified at the time of purchase. Warranty
              periods vary based on the product category.
            </p>
            <h3>What is Covered</h3>
            <p>
              During the warranty period, 971Souq will repair or replace, at no
              charge, any parts that are found to be defective due to faulty
              materials or poor workmanship. This warranty is valid only for the
              original purchaser and is non-transferable.
            </p>
            <h3>What is Not Covered</h3>
            <p>This warranty does not cover:</p>
            <ul>
              <li>
                Any Physical Damage, damage due to misuse, abuse, accidents,
                modifications, or unauthorized repairs.
              </li>
              <li>
                Wear and tear from regular usage, including cosmetic damage like
                scratches or dents.
              </li>
              <li>
                Damage caused by power surges, lightning strikes, or electrical
                malfunctions.
              </li>
              <li>Products with altered or removed serial numbers.</li>
              <li>Software-related issues</li>
            </ul>
            <h3>Warranty Claim Process</h3>
            <p>To make a claim under this warranty:</p>
            <ol>
              <li>
                Contact admin@971souq.ae with proof of purchase and a detailed
                description of the issue.
              </li>
              <li>
                971Souq will assess the product and, if deemed defective, repair
                or replace the item at no cost.
              </li>
            </ol>
            <h3>Limitations and Exclusions</h3>
            <p>
              This warranty is limited to repair or replacement. 971Souq will
              not be liable for any indirect, consequential, or incidental
              damages, including loss of data or loss of profits.
            </p>
          </div>
        </CSSTransition>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
      <div className="related-products-row">
        <div className="related-products">
          <h2>Related Products</h2>
          <RelatedProductsRow products={relatedProducts || []} />
        </div>
      </div>
      <div className="recently-viewed-container">
        <h2>Recently Viewed Products</h2>
        <RecentlyViewedProducts currentProductId={product.id} />
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
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
    product {
      title
      handle
      images(first: 30) {
        edges {
          node {
            __typename
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    productType
    images(first: 30) {
      edges {
        node {
          __typename
          id
          url
          altText
          width
          height
        }
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
    metafieldCondition: metafield(namespace: "custom", key: "condition") {
      value
    }
    metafieldWarranty: metafield(namespace: "custom", key: "warranty") {
      value
    }
    metafieldShipping: metafield(namespace: "custom", key: "shipping") {
      value
    }
    metafieldVat: metafield(namespace: "custom", key: "vat") {
      value
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;
