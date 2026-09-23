/**
 * This is the one place the app talks to the outside world.
 *
 * Right now it only creates a reference and resolves, because the app has no
 * server yet — the customer still sends you the receipt on WhatsApp from the
 * confirmation screen. When you are ready to receive orders automatically,
 * replace the body of `submitOrder` with a real upload. The shape of what
 * comes in and what goes out should not need to change.
 *
 * A minimal real version, posting to your own endpoint:
 *
 *   const body = new FormData()
 *   body.append('reference', reference)
 *   body.append('customer', JSON.stringify(customer))
 *   body.append('lines', JSON.stringify(lines))
 *   body.append('total', String(total))
 *   body.append('receipt', receiptFile)
 *   const res = await fetch('https://your-api.example.com/orders', { method: 'POST', body })
 *   if (!res.ok) throw new Error('Could not send your order. Please try again.')
 *   return { reference }
 */

/** FOWY-7K2QX — short, readable over the phone, unique enough in practice. */
export function makeReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let tail = ''
  for (let i = 0; i < 5; i += 1) {
    tail += chars[Math.floor(Math.random() * chars.length)]
  }
  return `FOWY-${tail}`
}

export async function submitOrder({ customer, lines, total, receiptFile }) {
  if (!receiptFile) throw new Error('Please attach a picture of your receipt.')

  const reference = makeReference()

  // Stand-in for the network call. Remove this when you add a real endpoint.
  await new Promise((resolve) => setTimeout(resolve, 900))

  // Useful while you're testing: the full order lands in the browser console.
  console.info('[Fowy Bites] order submitted', {
    reference,
    customer,
    lines,
    total,
    receipt: { name: receiptFile.name, size: receiptFile.size, type: receiptFile.type },
  })

  return { reference }
}

/** The message a customer sends you on WhatsApp alongside the receipt. */
export function orderMessage({ reference, customer, lines, total, formatMoney }) {
  const rows = lines.map((line) => `${line.qty} x ${line.name}`)
  return [
    `Hello Fowy Bites, I have made a payment.`,
    `Reference: ${reference}`,
    customer?.name ? `Name: ${customer.name}` : null,
    customer?.phone ? `Phone: ${customer.phone}` : null,
    customer?.address ? `Deliver to: ${customer.address}` : null,
    '',
    ...rows,
    `Total: ${formatMoney(total)}`,
  ]
    .filter(Boolean)
    .join('\n')
}
