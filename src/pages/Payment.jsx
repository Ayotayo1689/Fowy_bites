import { useState } from 'react'
import { Link } from 'react-router-dom'
import Flourish from '../components/Flourish'
import PaymentModal from '../components/PaymentModal'
import useSEO from '../hooks/useSEO'
import { useOrder } from '../context/OrderContext'
import { formatMoney, DELIVERY_FEE } from '../config'

export default function Payment() {
  // a cart/checkout page has no content worth ranking, and its contents are
  // specific to whoever is looking at it — keep it out of search results
  useSEO({ title: 'Your Order — Fowy Bites', noindex: true })

  const { lines, count, subtotal, delivery, total, add, remove, clear } = useOrder()
  const [payingOpen, setPayingOpen] = useState(false)

  if (count === 0) {
    return (
      <section className="checkout">
        <div className="checkout__head">
          <h1 className="page-title">Your order</h1>
          <Flourish />
        </div>
        <div className="empty">
          <p>Nothing here yet.</p>
          <Link className="btn" to="/menu">
            Go to the menu
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout">
      <div className="checkout__head">
        <h1 className="page-title">Your order</h1>
        <Flourish />
        <p>Check it over, then transfer the total and send us the receipt.</p>
      </div>

      <ul className="summary">
        {lines.map((line) => (
          <li key={line.id}>
            <div>
              <span className="summary__name">{line.name}</span>
              <span className="summary__unit">{formatMoney(line.price)} each</span>
            </div>
            <div className="summary__right">
              <span className="stepper">
                <button
                  type="button"
                  onClick={() => remove(line.id)}
                  aria-label={`Remove one ${line.name}`}
                >
                  &minus;
                </button>
                <span className="stepper__n">{line.qty}</span>
                <button
                  type="button"
                  onClick={() => add(line.id)}
                  aria-label={`Add one ${line.name}`}
                >
                  +
                </button>
              </span>
              <span className="summary__total">{formatMoney(line.total)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="totals">
        <div>
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        {DELIVERY_FEE > 0 && (
          <div>
            <span>Delivery</span>
            <span>{formatMoney(delivery)}</span>
          </div>
        )}
        <div className="totals__grand">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      <div className="checkout__actions">
        <button
          type="button"
          className="btn btn--solid btn--wide"
          onClick={() => setPayingOpen(true)}
        >
          Pay {formatMoney(total)}
        </button>
        <Link className="btn-quiet" to="/menu">
          Add something else
        </Link>
        <button type="button" className="btn-quiet" onClick={clear}>
          Clear my order
        </button>
      </div>

      <PaymentModal open={payingOpen} onClose={() => setPayingOpen(false)} />
    </section>
  )
}
