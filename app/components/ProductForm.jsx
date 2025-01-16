import {Link, useLocation} from '@remix-run/react';
import {CartForm, VariantSelector} from '@shopify/hydrogen';
import React, {useEffect, useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
export function ProductForm({
  product,
  selectedVariant: initialSelectedVariant,
  variants,
  quantity = 1,
}) {
  const {open} = useAside();
  const location = useLocation();

  // Track selected options state
  const [selectedOptions, setSelectedOptions] = useState(() => {
    // Initialize selected options from initialSelectedVariant or product
    if (initialSelectedVariant) {
      return initialSelectedVariant.selectedOptions.reduce(
        (acc, {name, value}) => {
          acc[name] = value;
          return acc;
        },
        {},
      );
    }
    return product.options.reduce((acc, option) => {
      acc[option.name] = option.optionValues[0]?.value || '';
      return acc;
    }, {});
  });

  useEffect(() => {
    if (initialSelectedVariant) {
      setSelectedOptions(
        initialSelectedVariant.selectedOptions.reduce((acc, {name, value}) => {
          acc[name] = value;
          return acc;
        }, {}),
      );
    } else {
      setSelectedOptions(
        product.options.reduce((acc, option) => {
          acc[option.name] = option.optionValues[0]?.value || '';
          return acc;
        }, {}),
      );
    }
  }, [product, initialSelectedVariant]);

  // Update selected options on change
  const handleOptionChange = (name, value) => {
    setSelectedOptions((prev) => {
      const newOptions = {...prev, [name]: value};

      // Update the URL with selected options
      const queryParams = new URLSearchParams(newOptions).toString();
      const newUrl = `${location.pathname}?${queryParams}`;
      window.history.replaceState(null, '', newUrl);

      return newOptions;
    });
  };

  // Determine the updated selected variant
  const updatedVariant = variants.find((variant) =>
    Object.entries(selectedOptions).every(([name, value]) =>
      variant.selectedOptions.some(
        (opt) => opt.name === name && opt.value === value,
      ),
    ),
  );

  // Ensure fallback quantity is safe
  const safeQuantity =
    typeof quantity === 'number' && quantity > 0 ? quantity : 1;

  // Check if we're on the product page
  const isProductPage = location.pathname.includes('/products/');

  // WhatsApp SVG as a component
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
          <stop offset="0" stop-color="#57d163" />
          <stop offset="1" stop-color="#23b33a" />
        </linearGradient>
        <filter
          id="a"
          width="1.115"
          height="1.114"
          x="-.057"
          y="-.057"
          color-interpolation-filters="sRGB"
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
        fill="url(#linearGradient1780)"
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
      />
      <path
        fill="url(#b)"
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
      />
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
      />
    </svg>
  );

  // Construct WhatsApp share URL
  const whatsappShareUrl = `https://api.whatsapp.com/send?phone=9613020030&text=Hi, I would like to buy ${product.title} https://971souq.ae${location.pathname}`;

  return (
    <>
      <VariantSelector
        handle={product.handle}
        options={product.options.filter(
          (option) => option.optionValues.length > 1,
        )}
        variants={variants}
      >
        {({option}) => (
          <>
            <ProductOptions
              key={option.name}
              option={option}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />
            <br></br>
          </>
        )}
      </VariantSelector>
      <br></br>
      <div className="product-form">
        <AddToCartButton
          // disabled={!updatedVariant || !updatedVariant.availableForSale}
          onClick={() => open('cart')}
          lines={
            updatedVariant
              ? [{merchandiseId: updatedVariant.id, quantity: safeQuantity}]
              : []
          }
        >
          {updatedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
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

/**
 * @param {{option: VariantOption, selectedOptions: Object, onOptionChange: Function}}
 */
function ProductOptions({option, selectedOptions, onOptionChange}) {
  return (
    <div className="product-options" key={option.name}>
      <h5 className="OptionName">
        {option.name}:{' '}
        <span className="OptionValue">{selectedOptions[option.name]}</span>
      </h5>
      <div className="product-options-grid">
        {option.optionValues.map(({value, isAvailable, variant}) => {
          const isColorOption = option.name.toLowerCase() === 'color';
          const variantImage = isColorOption && variant?.image?.url;

          return (
            <button
              key={option.name + value}
              className={`product-options-item ${
                selectedOptions[option.name] === value ? 'active' : ''
              }`}
              disabled={!isAvailable}
              onClick={() => onOptionChange(option.name, value)}
              style={{
                border:
                  selectedOptions[option.name] === value
                    ? '1px solid #000'
                    : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
                borderRadius: '20px',
                transition: 'all 0.3s ease-in-out',
                backgroundColor:
                  selectedOptions[option.name] === value
                    ? '#e6f2ff'
                    : '#f0f0f0',
                boxShadow:
                  selectedOptions[option.name] === value
                    ? '0 2px 4px rgba(0,0,0,0.1)'
                    : 'none',
                transform:
                  selectedOptions[option.name] === value
                    ? 'scale(0.98)'
                    : 'scale(1)',
              }}
            >
              {variantImage ? (
                <img
                  src={variantImage}
                  alt={value}
                  style={{width: '50px', height: '50px', objectFit: 'cover'}}
                />
              ) : (
                value
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// export function DirectCheckoutButton({selectedVariant, quantity}) {
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [shouldRedirect, setShouldRedirect] = useState(false); // Track whether redirect is needed

//   const handleAnimation = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setIsAnimating(false);
//       setShouldRedirect(true); // Allow redirection after animation
//     }, 300); // Complete animation before redirecting
//   };

//   useEffect(() => {
//     return () => {
//       setShouldRedirect(false); // Reset redirection when leaving the component
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
//             animate={isAnimating ? {scale: 1.05} : {scale: 1}}
//             transition={{duration: 0.3}}
//           >
//             Buy Now
//           </motion.button>
//         );
//       }}
//     </CartForm>
//   );
// }

/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */