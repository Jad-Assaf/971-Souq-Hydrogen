import { Link } from "@remix-run/react";
import React, { useEffect, useState, useRef } from "react";
import "../styles/HomeSlider.css";

export const CategorySliderWithImages = ({ handles, fetchCollectionsByHandles }) => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const fetchedCollections = await fetchCollectionsByHandles(handles);
      setCollections(fetchedCollections);
    };

    fetchCollections();
  }, [handles, fetchCollectionsByHandles]);

  return (
    <div className="slide-con">
      <h3 className="cat-h3">Shop By Categories</h3>
      <div className="category-slider">
        {collections.map((collection) => (
          <CategoryItemWithImage key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
};

function CategoryItemWithImage({ collection }) {
  const ref = useRef(null);

  const handleIntersection = ([entry]) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });
    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className="category-container">
      <Link to={`/collections/${collection.handle}`}>
        <div className="category-image">
          {collection.image ? (
            <img
              src={`${collection.image.url}?width=300&quality=15`}
              alt={collection.image.altText || collection.title}
              className="category-img"
              loading="lazy"
            />
          ) : (
            <div className="category-placeholder">No Image</div>
          )}
        </div>
      </Link>
      <div className="category-title">{collection.title}</div>
    </div>
  );
}
