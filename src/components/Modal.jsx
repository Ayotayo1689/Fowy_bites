import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Closes on Escape and on a backdrop click, locks the page behind it, keeps
 * Tab inside itself, and hands focus back to whatever opened it.
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
  dismissable = true,
  scrollKey,
}) {
  const panel = useRef(null)
  const opener = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    opener.current = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && dismissable) {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel.current) return

      const focusable = panel.current.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    // focus the panel itself so a screen reader reads the title first
    panel.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      if (opener.current instanceof HTMLElement) opener.current.focus()
    }
  }, [open, onClose, dismissable])

  // a new step should start at the top of the panel, not wherever the last
  // one was left scrolled
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 })
  }, [scrollKey])

  if (!open) return null

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (dismissable && event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        ref={panel}
        tabIndex={-1}
      >
        {dismissable && (
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
