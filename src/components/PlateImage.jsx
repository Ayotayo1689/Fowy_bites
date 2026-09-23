/**
 * A food photo cropped to the flier's scalloped "flower plate" shape.
 * Swap `src` for any new photo — square works best — and it is cut to
 * the same silhouette automatically, no image editing required.
 */
export default function PlateImage({ src, alt = '', className = '', ...rest }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className ? `flower-frame ${className}` : 'flower-frame'}
      loading="lazy"
      {...rest}
    />
  )
}
