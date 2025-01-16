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
      {/* SVG Content */}
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
              variants={variants} // Pass variants to compute availability
            />
            <br />
          </>
        )}
      </VariantSelector>
      <br />
      <div className="product-form">
        <AddToCartButton
          disabled={!updatedVariant || !updatedVariant.availableForSale}
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
 * @param {{
 *   option: VariantOption;
 *   selectedOptions: Object;
 *   onOptionChange: Function;
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
function ProductOptions({option, selectedOptions, onOptionChange, variants}) {
  // Function to determine if an option value is available based on current selections
  const isOptionAvailable = (optionName, optionValue) => {
    return variants.some((variant) => {
      const matchesCurrentSelection = Object.entries(selectedOptions).every(
        ([name, value]) => {
          if (name === optionName) {
            return value === optionValue;
          }
          return variant.selectedOptions.some(
            (opt) => opt.name === name && opt.value === value,
          );
        },
      );
      return matchesCurrentSelection;
    });
  };

  return (
    <div className="product-options" key={option.name}>
      <h5 className="OptionName">
        {option.name}:{' '}
        <span className="OptionValue">{selectedOptions[option.name]}</span>
      </h5>
      <div className="product-options-grid">
        {option.optionValues.map(({value, variant}) => {
          const isColorOption = option.name.toLowerCase() === 'color';
          const variantImage = isColorOption && variant?.image?.url;

          const available = isOptionAvailable(option.name, value);

          return (
            <button
              key={option.name + value}
              className={`product-options-item ${
                selectedOptions[option.name] === value ? 'active' : ''
              }`}
              disabled={!available}
              onClick={() => onOptionChange(option.name, value)}
              style={{
                border:
                  selectedOptions[option.name] === value
                    ? '1px solid #000'
                    : '1px solid transparent',
                opacity: available ? 1 : 0.3,
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

// Remaining code (e.g., DirectCheckoutButton) remains unchanged

/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
