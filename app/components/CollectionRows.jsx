import React, {useRef, useEffect, useState} from 'react';
import {Link} from '@remix-run/react';
import {ProductRow} from './CollectionDisplay';
import {Image} from '@shopify/hydrogen-react';

const CollectionRows = ({menuCollections}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen width is less than 768px
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    // Set the initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get the collections to display
  const displayedCollections = isMobile
    ? menuCollections.slice(0, 14)
    : menuCollections;

  return (
    <>
      {displayedCollections.map((menuCollection, index) => (
        <React.Fragment key={menuCollection.id}>
          {/* Render the menu slider */}
          <div className="menu-slider-container">
            {menuCollection.map((collection, collectionIndex) => (
              <div className="animated-menu-item" key={collection.id}>
                <CollectionItem
                  collection={collection}
                  index={collectionIndex}
                />
              </div>
            ))}
          </div>

          {menuCollection.slice(0, 4).map((collection) => (
            <div key={collection.id} className="collection-section">
              <div className="collection-header">
                <h3>{collection.title}</h3>
                <Link
                  to={`/collections/${collection.handle}`}
                  className="view-all-link"
                >
                  View All
                </Link>
              </div>
              <div className="product-row-container">
                <ProductRow products={collection.products.nodes} />
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export const CollectionItem = ({collection, index}) => {
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="menu-item-container"
    >
      <div className="menu-item-image-wrapper">
        {collection.image && (
          <img
            src={`${collection.image.url}?width=300&quality=15`} // Added src
            srcSet={`${collection.image.url}?width=300&quality=15 300w,
                     ${collection.image.url}?width=600&quality=15 600w,
                     ${collection.image.url}?width=1200&quality=15 1200w`}
            alt={collection.image.altText || collection.title}
            className={`menu-item-image
            }`}
            width={150}
            height={150}
            loading="lazy"
            onLoad={handleImageLoad}
          />
        )}
      </div>
      <div className="category-title">{collection.title}</div>
    </Link>
  );
};

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

export default CollectionRows;
