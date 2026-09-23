/** The small hand-drawn swash the flier puts under each course name. */
export default function Flourish() {
  return (
    <svg
      className="flourish"
      viewBox="0 0 120 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      <path d="M4 11c14 0 20-6 30-6s14 8 26 8 16-8 26-8 20 6 30 6" />
      <circle cx="60" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}
