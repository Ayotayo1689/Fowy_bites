import { useEffect } from 'react'

function setMeta(name, content, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Sets the document title and meta description for the current route.
 * index.html carries the tags crawlers see before the app runs; this keeps
 * the browser tab, bookmarks and JS-rendering crawlers (Google) accurate
 * per page on top of that. Pass `noindex` for pages with no content worth
 * indexing (a user's own cart, for instance).
 */
export default function useSEO({ title, description, noindex = false }) {
  useEffect(() => {
    const previousTitle = document.title
    if (title) document.title = title
    if (description) setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    return () => {
      document.title = previousTitle
    }
  }, [title, description, noindex])
}
