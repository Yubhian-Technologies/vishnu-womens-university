import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import './SmoothImage.css';

interface SmoothImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * Drop-in replacement for <img> that stays invisible until its *current*
 * src has actually finished loading, instead of showing the browser's
 * default behavior of keeping the previous bitmap painted while a new src
 * downloads. Necessary because React re-rendering the same <img> element
 * with a new `src` — whether from changed props, changed route params on a
 * component React doesn't remount, or a list re-keyed to reuse a DOM node —
 * never clears what's currently on screen; only the browser's own load
 * event does that, and only if something is listening for it.
 */
export default function SmoothImage({ src, alt, className = '', onLoad, ...rest }: SmoothImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Every time the src we're asked to show changes, go back to invisible
  // until *that* image reports it has loaded.
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <img
      src={src}
      alt={alt}
      className={`smooth-image${loaded ? ' smooth-image--loaded' : ''}${className ? ` ${className}` : ''}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      {...rest}
    />
  );
}
