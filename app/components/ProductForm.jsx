// ProductForm.jsx
import React, {useEffect, useState} from 'react';
import {Link, useLocation} from '@remix-run/react';
import {CartForm, VariantSelector} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

/**
 * Helper function to determine if an option value is available
 * based on current selections and available variants.
 */
function isValueAvailable(allVariants, selectedOptions, optionName, val) {
  const updated = {...selectedOptions, [optionName]: val};

  // Check if any variant matches the updated options and is available for sale
  return allVariants.some((variant) => {
    if (!variant.availableForSale) return false;
    return variant.selectedOptions.every((so) => updated[so.name] === so.value);
  });
}

/**
 * Helper function to pick or snap to a variant based on selected options.
 */
function pickOrSnapVariant(allVariants, newOptions, optionName, chosenVal) {
  // 1) Attempt a perfect match
  let found = allVariants.find(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.every((so) => newOptions[so.name] === so.value),
  );

  // 2) If no perfect match, fallback to a variant that includes the chosen value
  if (!found) {
    found = allVariants.find((v) => {
      if (!v.availableForSale) return false;
      const picked = v.selectedOptions.find((so) => so.name === optionName);
      return picked && picked.value === chosenVal;
    });
  }

  return found || null;
}

/**
 * ProductOptions Component
 * Renders individual option buttons and handles their availability.
 */
function ProductOptions({option, selectedOptions, onOptionChange, variants}) {
  const {name, values} = option;
  const currentValue = selectedOptions[name];

  return (
    <div className="product-options" key={name}>
      <h5 className="OptionName">
        {name}: <span className="OptionValue">{currentValue}</span>
      </h5>
      <div className="product-options-grid">
        {values.map(({value, variant}) => {
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
              onClick={() => onOptionChange(name, value)}
              className={`product-options-item ${isActive ? 'active' : ''}`}
              disabled={!canPick}
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
}

/**
 * ProductForm Component
 * Handles the rendering of variant options and the Add to Cart button.
 */
export function ProductForm({
  product,
  selectedVariant,
  onVariantChange,
  variants = [],
  quantity = 1,
}) {
  const location = useLocation();
  const {open} = useAside();

  // Initialize selected options from the selectedVariant or default to the first option values
  const [selectedOptions, setSelectedOptions] = useState(() => {
    if (selectedVariant?.selectedOptions) {
      return selectedVariant.selectedOptions.reduce((acc, {name, value}) => {
        acc[name] = value;
        return acc;
      }, {});
    }
    return product.options.reduce((acc, option) => {
      acc[option.name] = option.values[0]?.value || '';
      return acc;
    }, {});
  });

  // Sync local selectedOptions when selectedVariant changes
  useEffect(() => {
    if (selectedVariant?.selectedOptions) {
      setSelectedOptions(
        selectedVariant.selectedOptions.reduce((acc, {name, value}) => {
          acc[name] = value;
          return acc;
        }, {}),
      );
    }
  }, [selectedVariant, product]);

  // Handle option changes
  const handleOptionChange = (optionName, chosenVal) => {
    setSelectedOptions((prev) => {
      const newOptions = {...prev, [optionName]: chosenVal};

      // Attempt to find or snap to a variant based on the new selection
      const foundVariant = pickOrSnapVariant(
        variants,
        newOptions,
        optionName,
        chosenVal,
      );

      if (foundVariant) {
        // Update all selected options to match the found variant
        const updatedOptions = foundVariant.selectedOptions.reduce(
          (acc, {name, value}) => {
            acc[name] = value;
            return acc;
          },
          {},
        );
        setSelectedOptions(updatedOptions);
        onVariantChange(foundVariant);
      } else {
        // If no variant is found, revert the change
        return prev;
      }

      // Update the URL with the new selected options
      const params = new URLSearchParams(newOptions).toString();
      window.history.replaceState(null, '', `${location.pathname}?${params}`);

      return newOptions;
    });
  };

  // Ensure quantity is a positive integer
  const safeQuantity = Math.max(Number(quantity) || 1, 1);

  // Determine if we're on the product page for WhatsApp sharing
  const isProductPage = location.pathname.includes('/products/');

  // WhatsApp SVG Icon Component
  const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.216 175.552">
      {/* SVG Content */}
      <path
        fill="#b3b3b3"
        d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
        filter="url(#a)"
      />
      {/* Additional SVG paths */}
    </svg>
  );

  // Construct WhatsApp share URL
  const whatsappShareUrl = `https://api.whatsapp.com/send?phone=9613020030&text=${encodeURIComponent(
    `Hi, I'd like to buy ${product.title} https://971souq.ae${location.pathname}`,
  )}`;

  // Find the currently selected variant based on selectedOptions
  const updatedVariant = variants.find((variant) =>
    variant.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value,
    ),
  );

  return (
    <>
      {/* Render variant options (e.g., size, color) */}
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((o) => o.values.length > 1)}
        variants={variants}
      >
        {({option}) => (
          <ProductOptions
            key={option.name}
            option={option}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
            variants={variants}
          />
        )}
      </VariantSelector>
      <br />
      <div className="product-form">
        {/* Add to Cart Button */}
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

        {/* WhatsApp Share Button */}
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

// Remaining code (e.g., DirectCheckoutButton) remains unchanged

/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
