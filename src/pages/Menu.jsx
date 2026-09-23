import { useEffect, useState } from 'react'
import Flourish from '../components/Flourish'
import ItemRow from '../components/ItemRow'
import PlateImage from '../components/PlateImage'
import useSEO from '../hooks/useSEO'
import { MENU } from '../data/menu'

export default function Menu() {
  useSEO({
    title: 'Menu — Fowy Bites | Wings, Combos, Fries & Drinks',
    description:
      'Pepper toss and char wings, loaded fries, combo plates and a house Chapman — see prices and order the full Fowy Bites menu online.',
  })

  const [current, setCurrent] = useState(MENU[0].id)

  // underline whichever course is in the middle of the screen
  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    MENU.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) spy.observe(el)
    })

    return () => spy.disconnect()
  }, [])

  return (
    <>
      <h1 className="sr-only">Fowy Bites Menu</h1>

      <nav className="masthead coursebar" aria-label="Courses">
        <div className="masthead__inner">
          <ul>
            {MENU.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={current === section.id ? 'is-current' : undefined}
                  aria-current={current === section.id}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {MENU.map((section) => (
        <section className="course" id={section.id} key={section.id} aria-labelledby={`${section.id}-h`}>
          <div className="course__head">
            <h2 id={`${section.id}-h`}>{section.title}</h2>
            <Flourish />
            <p>{section.note}</p>
          </div>

          <div className="course__body">
            <div className={`plate${section.plate.length > 1 ? ' plate--pair' : ''}`}>
              {section.plate.map((src, index) => (
                <PlateImage key={src + index} src={src} alt="" width="360" height="360" />
              ))}
            </div>

            <ul className="items">
              {section.items.map((item) => (
                <ItemRow item={item} key={item.id} />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  )
}
