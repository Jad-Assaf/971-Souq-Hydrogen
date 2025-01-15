import React, {useRef} from 'react';
import {useInView} from 'react-intersection-observer'; // Import useInView
import {Image} from '@shopify/hydrogen'; // Import the Shopify Image component
import '../styles/BrandsSection.css';

export default function BrandSection({brands}) {
  const {ref, inView} = useInView({
    triggerOnce: true, // Trigger the animation only once
    threshold: 0.1, // 10% of the element must be in view
  });

  const gridRef = useRef(null); // Reference for the brand grid container

  const scrollGrid = (distance) => {
    if (gridRef.current) {
      gridRef.current.scrollBy({left: distance, behavior: 'smooth'});
    }
  };

  return (
    <section className="brand-section" ref={ref} style={{position: 'relative'}}>
      <h2>Shop By Brand</h2>

      {/* Previous Button */}
      <button
        className="circle-prev-button"
        onClick={() => scrollGrid(-600)}
        style={{
          position: 'absolute',
          top: '60%',
          left: '0',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <CustomLeftArrow />
      </button>

      <div
        className={`brand-grid ${inView ? 'visible' : 'hidden'}`}
        ref={gridRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          gap: '16px',
        }}
      >
        {brands.map((brand, index) => (
          <a
            key={index}
            href={brand.link}
            className="brand-item"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'scale(1)' : 'scale(0.9)',
              transition: `opacity 0.5s ease ${
                index * 0.1
              }s, transform 0.5s ease ${index * 0.1}s`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              data={{
                altText: brand.name, // Use the brand name as alt text
                url: brand.image, // URL of the brand image
              }}
              width="150px" // Set a reasonable width for brand logos
              height="auto" // Set a reasonable height for brand logos
              sizes="(min-width: 45em) 10vw, 20vw" // Responsive sizes
            />
          </a>
        ))}
      </div>

      {/* Next Button */}
      <button
        className="circle-next-button"
        onClick={() => scrollGrid(600)}
        style={{
          position: 'absolute',
          top: '60%',
          right: '0',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <CustomRightArrow />
      </button>
    </section>
  );
}

// Arrow Icons
const CustomLeftArrow = () => (
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

const CustomRightArrow = () => (
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
