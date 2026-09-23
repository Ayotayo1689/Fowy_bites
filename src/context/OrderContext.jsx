import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ITEMS_BY_ID, MENU } from '../data/menu'
import { DELIVERY_FEE } from '../config'

const STORAGE_KEY = 'fowy-order-v1'

const OrderContext = createContext(null)

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (!parsed || typeof parsed !== 'object') return {}
    // drop anything that is no longer on the menu, so an old saved order
    // can never put a removed item into a total
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, qty]) => ITEMS_BY_ID[id] && Number.isFinite(qty) && qty > 0,
      ),
    )
  } catch {
    return {}
  }
}

export function OrderProvider({ children }) {
  const [quantities, setQuantities] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities))
    } catch {
      // storage can be unavailable (private mode, blocked cookies) — the order
      // still works for this session, it just won't survive a refresh
    }
  }, [quantities])

  const value = useMemo(() => {
    // keep the order in menu order, not in the order things were tapped
    const lines = []
    MENU.forEach((section) =>
      section.items.forEach((item) => {
        const qty = quantities[item.id]
        if (qty > 0) lines.push({ ...item, section: section.title, qty, total: item.price * qty })
      }),
    )

    const count = lines.reduce((sum, line) => sum + line.qty, 0)
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0)
    const delivery = count > 0 ? DELIVERY_FEE : 0

    return {
      quantities,
      lines,
      count,
      subtotal,
      delivery,
      total: subtotal + delivery,
      qtyOf: (id) => quantities[id] || 0,
      add: (id) => step(id, 1),
      remove: (id) => step(id, -1),
      step,
      clear: () => setQuantities({}),
    }

    function step(id, by) {
      setQuantities((current) => {
        const next = { ...current }
        const value = (next[id] || 0) + by
        if (value > 0) next[id] = Math.min(value, 99)
        else delete next[id]
        return next
      })
    }
  }, [quantities])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used inside an OrderProvider')
  return ctx
}
