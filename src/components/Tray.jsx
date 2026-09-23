import { useLocation, useNavigate } from 'react-router-dom'
import { useOrder } from '../context/OrderContext'
import { formatMoney } from '../config'

/** Sits above every page once there is something in the order. */
export default function Tray() {
  const { count, total, clear } = useOrder()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // on the payment page the totals are already on screen — no need to repeat them
  const hidden = count === 0 || pathname === '/payment'

  return (
    <div
      className={`tray${hidden ? '' : ' is-up'}`}
      role="region"
      aria-label="Your order"
      aria-hidden={hidden}
    >
      <span className="tray__count">
        <b>{count}</b> {count === 1 ? 'item' : 'items'} &middot; {formatMoney(total)}
      </span>
      <button type="button" className="btn-quiet" onClick={clear} tabIndex={hidden ? -1 : 0}>
        Clear
      </button>
      <button
        type="button"
        className="btn btn--solid"
        onClick={() => navigate('/payment')}
        tabIndex={hidden ? -1 : 0}
      >
        Review order
      </button>
    </div>
  )
}
