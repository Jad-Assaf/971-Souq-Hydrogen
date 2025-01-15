import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/AnimatedImage.css';

export function AnimatedImage({ src, alt, placeholder, ...props }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="image-wrapper">
            {/* Placeholder until image loads */}
            {!isLoaded && <div className="image-placeholder"></div>}

            <LazyLoadImage
                src={src}
                alt={alt}
                effect="blur" // Smooth blur effect
                afterLoad={() => setIsLoaded(true)}
                className="lazy-image"
                {...props}
            />
        </div>
    );
}
