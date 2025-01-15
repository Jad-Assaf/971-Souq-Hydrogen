import {CartForm} from '@shopify/hydrogen';
import React, {useState} from 'react';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimation = (e) => {
    setIsAnimating(true);
    if (onClick) onClick(e);
    setTimeout(() => setIsAnimating(false), 300); // Reset animation after 300ms
  };

  const buttonStyles = {
    transition: 'transform 0.3s ease', // Smooth transition for scaling
    transform: isAnimating ? 'scale(1.1)' : 'scale(1)', // Scale up when animating
  };

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={handleAnimation}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`add-to-cart-button ${disabled ? 'disabled' : ''} ${
              fetcher.state !== 'idle' ? 'loading' : ''
            }`}
            style={buttonStyles} // Apply inline styles for animation
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
