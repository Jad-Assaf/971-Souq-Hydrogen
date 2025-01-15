import React from 'react';
// import { Image } from '@shopify/hydrogen';
import '../styles/ResponsiveImageGrid.css';
import { AnimatedImage } from './AnimatedImage';

/**
 * ResponsiveImageGrid Component
 * @param {{ images: Array<{ url: string, altText?: string }> }} props
 */
export function ResponsiveImageGrid({ images }) {
    if (!images || images.length === 0) {
        console.warn('No images to display'); // Add a warning to debug
        return <p>No images available.</p>; // Render a fallback if no images are passed
    }

    return (
        <div className="responsive-image-grid">
            {images.map((image, index) => (
                <div key={index} className="image-wrapper">
                    <AnimatedImage
                        src={image.url}
                        alt={image.altText || `Image ${index + 1}`}
                        width="100%"
                        height="100%"
                    />
                </div>
            ))}
        </div>
    );
}

