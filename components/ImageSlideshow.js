'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import image1 from '@/public/images/slideshow/image1.jpg';
import image2 from '@/public/images/slideshow/image2.jpg';
import image3 from '@/public/images/slideshow/image3.jpg';
import image4 from '@/public/images/slideshow/image4.jpg';
import styles from './ImageSlideshow.module.css';

const images = [
  { src: image1, alt: 'Image 1' },
  { src: image2, alt: 'Image 2' },
  { src: image3, alt: 'Image 3' },
  { src: image4, alt: 'Image 4' },
];

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src}
          className={index === currentImageIndex ? styles.active : ''}
          alt={image.alt}
          layout="fill"
          objectFit="cover"
        />
      ))}
    </div>
  );
}
