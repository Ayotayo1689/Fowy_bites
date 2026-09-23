import { useOrder } from '../context/OrderContext'
import { formatMoney } from '../config'

/**
 * The flier's dotted leader line, made tappable. Tapping anywhere on the row
 * adds one; once there is at least one, the row grows a stepper.
 */
export default function ItemRow({ item }) {
  const { qtyOf, add, remove } = useOrder()
  const qty = qtyOf(item.id)

  return (
    <li>
      <button
        type="button"
        className={`item__row${qty > 0 ? ' is-in' : ''}`}
        onClick={() => add(item.id)}
        aria-label={`Add ${item.name} to your order`}
      >
        <span className="item__name">{item.name}</span>
        <span className="item__leader" />
        <span className="item__price">{formatMoney(item.price)}</span>

        {qty > 0 ? (
          <span
            className="stepper"
            // the stepper lives inside the row button, so stop its clicks
            // from also firing the row's "add one"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Remove one ${item.name}`}
            >
              &minus;
            </button>
            <span className="stepper__n">{qty}</span>
            <button type="button" onClick={() => add(item.id)} aria-label={`Add one ${item.name}`}>
              +
            </button>
          </span>
        ) : (
          <span className="plus" aria-hidden="true">
            +
          </span>
        )}
      </button>
      <p className="item__desc">{item.desc}</p>
    </li>
  )
}
