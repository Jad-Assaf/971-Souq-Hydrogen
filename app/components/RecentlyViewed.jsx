import React, {useEffect, useRef, useState} from 'react';
import {Link} from '@remix-run/react';
import {Money, Image} from '@shopify/hydrogen'; // Import Image from hydrogen

export default function RecentlyViewedProducts({currentProductId}) {
  const [products, setProducts] = useState([]);
  const rowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    // Update the viewed products list in localStorage
    if (typeof window !== 'undefined' && currentProductId) {
      let viewedProducts =
        JSON.parse(localStorage.getItem('viewedProducts')) || [];

      // Remove the current product ID if it's already in the array
      viewedProducts = viewedProducts.filter((id) => id !== currentProductId);

      // Add the current product ID to the beginning of the array
      viewedProducts.unshift(currentProductId);

      // Limit the array to the last 20 viewed products
      viewedProducts = viewedProducts.slice(0, 20);

      // Save back to localStorage
      localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    }
  }, [currentProductId]);

  useEffect(() => {
    // Get the viewed products from localStorage
    const viewedProducts =
      JSON.parse(localStorage.getItem('viewedProducts')) || [];

    // Remove the current product ID to avoid showing it in the list
    const productIds = viewedProducts.filter((id) => id !== currentProductId);

    // Fetch product data if there are any viewed products
    if (productIds.length > 0) {
      fetchProducts(productIds).then((fetchedProducts) => {
        setProducts(fetchedProducts);
      });
    } else {
      setProducts([]); // Ensure products state is empty if no product IDs
    }
  }, [currentProductId]);

  // Function to fetch products from the Shopify Storefront API
  async function fetchProducts(productIds) {
    const query = `
      query getProductsByIds($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Product {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;

    const response = await fetch(
      `https://971souq.myshopify.com/api/2023-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token':
            '4a6888a1225616e0ed01bf21e3c10d0a',
        },
        body: JSON.stringify({
          query,
          variables: {ids: productIds},
        }),
      },
    );

    const jsonResponse = await response.json();

    // Handle any errors returned by the API
    if (jsonResponse.errors) {
      console.error('Error fetching products:', jsonResponse.errors);
      return [];
    }

    const products = jsonResponse.data.nodes.filter((node) => node !== null);
    return products;
  }

  // Scroll handling for the product row
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed
    rowRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollRow = (distance) => {
    rowRef.current.scrollBy({left: distance, behavior: 'smooth'});
  };

  // Removed the early return that hides the component when there are no products

  return (
    <div className="collection-section">
      <h2>Recently Viewed Products</h2>
      {products.length === 0 ? (
        <div className="no-recently-viewed">
          <p>No Recently Viewed Products</p>
        </div>
      ) : (
        <div className="product-row-container">
          <button className="home-prev-button" onClick={() => scrollRow(-600)}>
            <LeftArrowIcon />
          </button>
          <div
            className="collection-products-row"
            ref={rowRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {products.map((product, index) => (
              <RecentlyViewedProductItem
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
          <button className="home-next-button" onClick={() => scrollRow(600)}>
            <RightArrowIcon />
          </button>
        </div>
      )}
    </div>
  );
}

function RecentlyViewedProductItem({product, index}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 50); // Delay based on index for staggered effect

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div
      className="product-item"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div
        className="product-card"
        style={{
          filter: isVisible ? 'blur(0px)' : 'blur(10px)',
          transition: 'filter 0.5s ease, opacity 0.5s ease',
        }}
      >
        <Link to={`/products/${encodeURIComponent(product.handle)}`}>
          <Image
            data={product.featuredImage}
            aspectratio="1/1"
            sizes="(min-width: 45em) 20vw, 40vw"
            srcSet={`${product.featuredImage.url}?width=300&quality=30 300w,
                     ${product.featuredImage.url}?width=600&quality=30 600w,
                     ${product.featuredImage.url}?width=1200&quality=30 1200w`}
            alt={product.featuredImage.altText || product.title}
            width="150px"
            height="150px"
          />
          <div className="product-title">{product.title}</div>
          <div className="product-price">
            {product.priceRange.minVariantPrice.currencyCode}
            {product.priceRange.minVariantPrice.amount}{' '}
          </div>
        </Link>
      </div>
    </div>
  );
}

const LeftArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const RightArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
