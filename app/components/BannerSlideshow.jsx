import React, {useState, useEffect, useMemo} from 'react';
import {Image} from '@shopify/hydrogen';

export function BannerSlideshow({banners, interval = 10000}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animationStyle, setAnimationStyle] = useState({});
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
      );
    }, interval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 100 / (interval / 100)));
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [banners.length, interval]);

  useEffect(() => {
    setProgress(0);

    setAnimationStyle({
      opacity: 1,
      transform: 'translateX(0)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    });

    setTimeout(() => {
      setAnimationStyle({});
    }, 500);
  }, [currentIndex]);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const touchDiff = e.touches[0].clientX - startX;
    setAnimationStyle({
      transform: `translateX(${touchDiff}px)`,
      transition: 'none',
    });
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const touchDiff = endX - startX;

    if (touchDiff > 100) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? banners.length - 1 : prevIndex - 1,
      );
    } else if (touchDiff < -100) {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
      );
    } else {
      setAnimationStyle({
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease',
      });
    }
  };

  const renderedDesktopBanners = useMemo(() => {
    return banners.map((banner, index) => (
      <div
        key={index}
        className={`banner-slide ${
          index === currentIndex ? 'active' : 'inactive'
        }`}
        style={{
          ...styles.bannerSlide,
          ...animationStyle,
          opacity: index === currentIndex ? 1 : 0,
          transform:
            index === currentIndex
              ? 'translateX(0)'
              : index > currentIndex
              ? 'translateX(50px)'
              : 'translateX(-50px)',
        }}
      >
        <a
          // href={banner.link}
          target="_self"
          rel="noopener noreferrer"
          style={styles.link}
        >
          <img
            src={banner.desktopImageUrl}
            srcSet={`${banner.desktopImageUrl}?width=300&quality=50 300w,
                   ${banner.desktopImageUrl}?width=600&quality=50 600w,
                   ${banner.desktopImageUrl}?width=1200&quality=50 1200w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={`Banner ${index + 1}`}
            style={styles.bannerImage}
            loading="eager"
            decoding="sync"
          />
        </a>
      </div>
    ));
  }, [banners, currentIndex, animationStyle]);

  const renderedMobileBanners = useMemo(() => {
    return banners.map((banner, index) => (
      <div
        key={index}
        className={`banner-slide ${
          index === currentIndex ? 'active' : 'inactive'
        }`}
        style={{
          ...styles.bannerSlide,
          ...animationStyle,
          opacity: index === currentIndex ? 1 : 0,
          transform:
            index === currentIndex
              ? 'translateX(0)'
              : index > currentIndex
              ? 'translateX(50px)'
              : 'translateX(-50px)',
        }}
      >
        <a
          href={banner.link}
          target="_self"
          rel="noopener noreferrer"
          style={styles.link}
        >
          <img
            src={banner.mobileImageUrl}
            srcSet={`${banner.mobileImageUrl}?width=300&quality=50 300w,
                   ${banner.mobileImageUrl}?width=600&quality=50 600w,
                   ${banner.mobileImageUrl}?width=1200&quality=50 1200w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={`Banner ${index + 1}`}
            style={styles.bannerImage}
            loading="eager"
            decoding="sync"
          />
        </a>
      </div>
    ));
  }, [banners, currentIndex, animationStyle]);

  return (
    <div
      className="banner-slideshow"
      style={styles.bannerSlideshow}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Desktop Banners */}
      <div className="desktop-banners">
        {renderedDesktopBanners[currentIndex]}
      </div>

      {/* Mobile Banners */}
      <div className="mobile-banners">
        {renderedMobileBanners[currentIndex]}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar" style={styles.progressBar}>
        <div
          className="progress"
          style={{
            ...styles.progress,
            width: `${progress}%`,
          }}
        ></div>
      </div>

      {/* Indicator Dots */}
      <div className="indicator-dots" style={styles.indicatorDots}>
        {banners.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            style={{
              ...styles.dot,
              backgroundColor: index === currentIndex ? '#fff' : '#484848',
            }}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  bannerSlideshow: {
    position: 'relative',
    width: '100vw',
    overflow: 'hidden',
  },
  bannerSlide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  },
  bannerImage: {
    width: '100vw',
    height: '100%',
    objectFit: 'contain',
    maxWidth: '1500px',
    margin: 'auto',
    borderRadius: '20px',
  },
  link: {
    width: '100vw',
    height: '100%',
    display: 'block',
  },
  progressBar: {
    position: 'absolute',
    bottom: '12px',
    left: '45%',
    width: '10%',
    height: '3px',
    backgroundColor: '#484848',
    borderRadius: '40px',
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
    transition: 'width 0.1s linear',
    borderRadius: '30px',
  },
  indicatorDots: {
    position: 'absolute',
    width: '100%',
    bottom: '2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
};
