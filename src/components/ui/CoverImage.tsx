import { useEffect, useRef, useState } from 'react';

/**
 * Project cover that fades itself in once decoded. The covers are large webp
 * files loaded lazily, so without this they pop in mid-reveal: decoding on the
 * main thread hitches the card's entrance animation (choppy) and the abrupt
 * appearance reads as a flicker. `decoding="async"` keeps the decode off the
 * animation frame; the `loaded` class drives an opacity fade (styled by the
 * parent's `.frame img` / `.frame img.loaded` rules) instead of a hard pop.
 */
interface CoverImageProps {
  src: string;
  alt: string;
  /** Skip lazy-loading (for covers that are above the fold). */
  eager?: boolean;
}

const CoverImage = ({ src, alt, eager = false }: CoverImageProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // A cached image can already be complete before React wires up onLoad.
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={loaded ? 'loaded' : ''}
      onLoad={() => setLoaded(true)}
    />
  );
};

export default CoverImage;
