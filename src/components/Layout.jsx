import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Wash from './Wash'
import Tray from './Tray'
import logo from '../assets/images/logo.webp'
import stars from '../assets/images/stars.webp'
import { BRAND } from '../config'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/payment', label: 'Order' },
]

export default function Layout() {
  const { pathname } = useLocation()
  const masthead = useRef(null)

  // the menu page sticks its course bar directly under this one, so publish
  // the real measured height instead of hard-coding it
  useEffect(() => {
    const el = masthead.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const publish = () =>
      document.documentElement.style.setProperty('--masthead-h', `${el.offsetHeight}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // a new page should start at the top, not wherever the last one was scrolled
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <main className="paper">
      <Wash />

      <nav className="masthead" aria-label="Pages" ref={masthead}>
        <div className="masthead__inner">
          <Link className="masthead__brand" to="/" aria-label={BRAND.name}>
            <img src={logo} alt={BRAND.name} width="741" height="212" />
          </Link>
          <ul>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => (isActive ? 'is-current' : undefined)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sheet">
        <Outlet />

        <footer className="foot">
          <div className="wrap">
            <img className="foot__stars" src={stars} alt="" width="404" height="126" />
            <p className="foot__mark">{BRAND.name}</p>
            <p>Everything is made to order, so tell us what you want and give us a few minutes.</p>
            {(BRAND.whatsapp || BRAND.instagram) && (
              <div className="foot__links">
                {BRAND.whatsapp && (
                  <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                )}
                {BRAND.instagram && (
                  <a
                    href={`https://instagram.com/${BRAND.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </footer>
      </div>

      <Tray />
    </main>
  )
}
