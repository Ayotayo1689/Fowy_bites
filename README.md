# Fowy Bites

A three-page ordering site — home, menu, payment — built with React and Vite.
The logo, the ornaments, the scalloped food plates and every colour in it were
taken from the original Fowy Bites flier, so the site and the printed menu match.

## Running it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the built version locally
```

## Change these before you go live

**`src/config.js`**

| What | Why |
| --- | --- |
| `BANK.bankName`, `BANK.accountNumber`, `BANK.accountName` | Shown in the payment modal. Right now they're placeholders. |
| `BRAND.whatsapp` | International format, digits only: `2348012345678`. Leave empty and the WhatsApp links simply don't appear. |
| `BRAND.instagram` | Handle without the `@`. Leave empty to hide it. |
| `BRAND.phone` | Shown on the "Visit us" section. Leave empty to hide it. |
| `RATING` | The star rating chip on the homepage. Set `count` to `''` to hide the "from regulars…" line, or drop `value` entirely to hide the whole chip. |
| `VISIT.address` | The homepage "Visit us" section only appears once this is set. |
| `VISIT.hours` | List of `{ days, time }` rows shown under Hours. |
| `DELIVERY_FEE` | Flat amount added to every order. `0` hides the line entirely. |

**`src/data/menu.js`** — every price in here is a placeholder. Change them all.
Items, descriptions and whole categories live here too; add or remove freely,
just keep each `id` unique and don't reuse one after launch, because saved
orders are keyed on it.

**`src/data/testimonials.js`** — sample reviews. Replace the quotes and names
with real customer feedback before you go live.

## How ordering works

1. **Menu** — tapping a row adds one; a stepper appears once there's at least
   one. The order is held in `OrderContext` and saved to `localStorage`, so it
   survives a refresh or a closed tab.
2. **Payment** — the summary, with steppers to adjust quantities, and the total.
3. **Pay** opens a modal with the bank details and the exact amount, with a copy
   button on the account number.
4. **I have made the payment** moves to the receipt step: an image of the
   transfer, plus name, phone, and an optional address.
5. **Submit my receipt** returns a reference like `FOWY-7K2QX` and offers to send
   the same details to you on WhatsApp.

## Receiving orders for real

The app has no server. `src/services/submitOrder.js` is the only place that
would talk to one — it currently makes a reference, waits, and logs the order to
the browser console. Replace the body of `submitOrder` with a real upload and
nothing else in the app needs to change; the comment at the top of that file has
a working example using `FormData`.

Until you do, the customer's receipt never leaves their phone, so the WhatsApp
button on the confirmation screen is how the order actually reaches you. Set
`BRAND.whatsapp` and it will be there.

## Folder map

```
src/
  assets/
    fonts/      Great Vibes + EB Garamond, bundled so nothing loads from Google
    images/     logo, ornaments and the scalloped plates, lifted from the flier
  components/
    Layout.jsx        paper column, nav, footer, tray
    Wash.jsx          the watercolour band pattern (one continuous SVG layer)
    ItemRow.jsx       a menu row: dotted leader, price, stepper
    Tray.jsx          the floating order bar
    Modal.jsx         generic dialog — escape, backdrop, focus trap, scroll lock
    PaymentModal.jsx  the three payment steps
    Flourish.jsx      the swash under each course name
    Toast.jsx         small confirmations ("Account number copied")
    PlateImage.jsx    crops any photo to the scalloped "flower plate" shape
    Stars.jsx         the gold star row on the rating chip and reviews
  context/OrderContext.jsx   quantities, totals, persistence
  data/menu.js               categories, items, prices
  data/testimonials.js       sample reviews shown on the homepage
  pages/                     Home, Menu, Payment
  services/submitOrder.js    the one outward-facing call
  styles/                    tokens and layout in global.css, pages in pages.css
config.js                    bank details, WhatsApp, currency, delivery fee
```

## Notes

- Colours are CSS custom properties on `:root` in `src/styles/global.css`. The
  brand palette is `--ink #2C1604`, `--gold #A9712F`, `--cream #FAF0E7`,
  `--blush #F8DDD6`, `--sand #EAD5C4`.
- The background pattern is `Wash.jsx`: layered wave paths stretched over the
  whole page and blurred in CSS, so the bands never break at a section edge.
- In dark mode the menu card stays cream and only the surround goes deep cocoa,
  like the flier lying on a table.
- Reduced motion is respected, focus is visible throughout, and the dialog is
  keyboard-navigable.
- Any food photo can be dropped into `menu.js` (or the homepage's `PLATES`
  list) as a plain rectangular image — `PlateImage` / the `.flower-frame`
  class in `global.css` crops it to the same scalloped shape as the original
  flier art automatically, via a CSS `clip-path`. No manual image cutting.
