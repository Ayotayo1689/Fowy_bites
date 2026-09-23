/** A row of gold stars, used on the rating chip and testimonial cards. */
export default function Stars({ count = 5 }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20">
          <path d="M10 1.5l2.47 5.6 6.03.56-4.58 4 1.36 5.94L10 14.9l-5.28 2.7 1.36-5.94-4.58-4 6.03-.56z" />
        </svg>
      ))}
    </span>
  )
}
