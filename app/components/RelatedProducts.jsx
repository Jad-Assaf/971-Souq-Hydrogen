import React, {useRef, useState, useEffect} from 'react';
import {Link} from '@remix-run/react';
import {Money, Image} from '@shopify/hydrogen'; // Import Image from hydrogen

export default function RelatedProductsRow({products}) {
  const rowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    const walk = (x - startX) * 2;
    rowRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollRow = (distance) => {
    rowRef.current.scrollBy({left: distance, behavior: 'smooth'});
  };

  return (
    <div className="collection-section">
      <h2>Related Products</h2>
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
            <RelatedProductItem
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
    </div>
  );
}

function RelatedProductItem({product, index}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 50); // Staggered delay based on index

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
          opacity: isVisible ? 1 : 0,
          transition: 'filter 0.5s ease, opacity 0.5s ease',
        }}
      >
        <Link to={`/products/${encodeURIComponent(product.handle)}`}>
          <Image
            data={product.images.edges[0]?.node}
            aspectratio="1/1"
            sizes="(min-width: 45em) 20vw, 40vw"
            srcSet={`${product.images.edges[0]?.node.url}?width=300&quality=10 300w,
                                 ${product.images.edges[0]?.node.url}?width=600&quality=10 600w,
                                 ${product.images.edges[0]?.node.url}?width=1200&quality=10 1200w`}
            alt={product.images.edges[0]?.node.altText || product.title}
            width="150px"
            height="150px"
          />
          <div className="product-title">{product.title}</div>
          <div className="product-price">
            {product.priceRange.minVariantPrice.currencyCode}&nbsp;
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
