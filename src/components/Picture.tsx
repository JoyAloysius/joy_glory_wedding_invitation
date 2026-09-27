import { useState } from 'react'
import type { ResponsiveImage } from '@/data/wedding'
import { asset } from '@/utils/asset'

interface PictureProps {
  image: ResponsiveImage
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  /** When true, ignores the image's intrinsic aspect ratio and fills the parent
   * container instead (e.g. a fixed circular avatar). Parent must set its own size. */
  fill?: boolean
}

/** Responsive, lazy-loaded `<picture>` with a WebP source, JPG fallback, and a
 * blurred low-quality placeholder that fades out once the real image has loaded. */
export function Picture({
  image,
  className = '',
  imgClassName = '',
  sizes = '100vw',
  priority = false,
  fill = false,
}: PictureProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center ${className}`}
      style={{
        aspectRatio: fill ? undefined : `${image.width} / ${image.height}`,
        backgroundImage: !loaded && image.blurDataUrl ? `url(${image.blurDataUrl})` : undefined,
      }}
    >
      <picture>
        <source
          type="image/webp"
          srcSet={`${asset(image.webp800)} 800w, ${asset(image.webp1600)} 1600w`}
          sizes={sizes}
        />
        <img
          src={asset(image.jpg1600)}
          srcSet={`${asset(image.jpg800)} 800w, ${asset(image.jpg1600)} 1600w`}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`${fill ? 'absolute inset-0' : ''} h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      </picture>
    </div>
  )
}
