import { Link } from 'react-router-dom'
import Flourish from '../components/Flourish'
import PlateImage from '../components/PlateImage'
import Stars from '../components/Stars'
import logo from '../assets/images/logo.webp'
import sprig from '../assets/images/sprig.webp'
import wings from '../assets/images/wings.webp'
import fries from '../assets/images/fries.webp'
import drink from '../assets/images/drink.webp'
import { BRAND, RATING, VISIT } from '../config'
import { TESTIMONIALS } from '../data/testimonials'

const PLATES = [
  { src: wings, label: 'Wings' },
  { src: fries, label: 'Fries' },
  { src: drink, label: 'Drinks' },
]

const STEPS = [
  {
    title: 'Pick what you want',
    body: 'Tap through the menu and build your order. It stays saved if you close the page.',
  },
  {
    title: 'Transfer the total',
    body: 'We show you the account details and the exact amount at checkout.',
  },
  {
    title: 'Send your receipt',
    body: 'Attach a picture of the transfer and we start cooking.',
  },
]

const BADGES = [
  {
    label: 'Made fresh to order',
    icon: (
      <path d="M10 2a1 1 0 0 1 1 1v1.06A6.01 6.01 0 0 1 16 10a1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM4 10a6 6 0 0 0 12 0h1.5a1 1 0 1 1 0 2H17a7 7 0 0 1-14 0H1.5a1 1 0 0 1 0-2H3a6.02 6.02 0 0 1 1-3.32 1 1 0 1 1 1.66 1.12A4 4 0 0 0 4 10z" />
    ),
  },
  {
    label: 'Verified receipt orders',
    icon: (
      <path d="M5 2a1 1 0 0 0-1 1v14a1 1 0 0 0 1.45.9L10 15.8l4.55 2.1A1 1 0 0 0 16 17V3a1 1 0 0 0-1-1H5zm2.7 8.3 1.6 1.6 3-3.4-1.2-1L9 9.7l-.9-.9-1.4 1.5z" />
    ),
  },
  {
    label: 'No shortcuts on flavour',
    icon: (
      <path d="M10 1.5c.5 2.6-.6 3.9-1.7 5.1C7.1 7.9 6 9.2 6 11.5A4 4 0 0 0 10 15.5a4 4 0 0 0 4-4c0-1.5-.7-2.5-1.4-3.4-.2.9-.7 1.6-1.4 1.6-.7 0-1.1-.6-1-1.3.3-1.6-.2-3.1-2.2-4.4-.4 1-.3 1.9 1 2.5-.4-1.6.2-3 1-3z" />
    ),
  },
]

export default function Home() {
  return (
    <>
      <header className="hero">
        <h1 className="hero__logo reveal">
          <img src={logo} alt={BRAND.name} width="741" height="212" />
        </h1>
        <p className="spaced hero__spaced reveal d1">FOOD MENU</p>
        <p className="lede hero__lede reveal d2">{BRAND.tagline}</p>

        {RATING?.value && (
          <div className="reveal d2" style={{ marginTop: '14px' }}>
            <span className="rating-chip">
              <Stars />
              <b>{RATING.value}</b>
              {RATING.count && <span>{RATING.count}</span>}
            </span>
          </div>
        )}

        <img className="hero__sprig reveal d3" src={sprig} alt="" width="265" height="89" />
        <div className="reveal d4">
          <Link className="btn hero__cta" to="/menu">
            Build your order
          </Link>
        </div>

        <ul className="badges reveal d4" style={{ marginTop: '22px' }}>
          {BADGES.map((badge) => (
            <li key={badge.label}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                {badge.icon}
              </svg>
              {badge.label}
            </li>
          ))}
        </ul>
      </header>

      <section className="tasting" aria-label="What we make">
        {PLATES.map((plate) => (
          <figure key={plate.label}>
            <PlateImage src={plate.src} alt={plate.label} width="360" height="360" />
            <figcaption>{plate.label}</figcaption>
          </figure>
        ))}
      </section>

      <section className="how">
        <h2 className="page-title">How it works</h2>
        <Flourish />
        <ol>
          {STEPS.map((step) => (
            <li key={step.title}>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="testimonials" aria-label="What people say">
        <h2 className="page-title">Loved locally</h2>
        <Flourish />
        <div className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial" key={t.name}>
              <Stars />
              <blockquote>“{t.quote}”</blockquote>
              <cite>— {t.name}</cite>
            </div>
          ))}
        </div>
      </section>

      {VISIT?.address && (
        <section className="visit" aria-label="Visit us">
          <h2 className="page-title">Visit us</h2>
          <Flourish />
          <div className="visit__grid">
            <div className="visit__block">
              <h3>Where</h3>
              <p>{VISIT.address}</p>
              {BRAND.phone && (
                <p>
                  <a href={`tel:+${BRAND.phone}`}>{BRAND.phone}</a>
                </p>
              )}
            </div>
            {VISIT.hours?.length > 0 && (
              <div className="visit__block">
                <h3>Hours</h3>
                {VISIT.hours.map((row) => (
                  <p className="visit__row" key={row.days}>
                    <span>{row.days}</span>
                    <span>{row.time}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
