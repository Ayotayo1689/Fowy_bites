import wings from '../assets/images/wings.webp'
import fries from '../assets/images/fries.webp'
import drink from '../assets/images/drink.webp'

/**
 * PRICES BELOW ARE PLACEHOLDERS — change every one of them to your real prices.
 * Each item needs a unique `id`; the order tray and the payment summary are
 * keyed on it, so don't reuse an id after you've launched.
 */
export const MENU = [
  {
    id: 'wings',
    title: 'Wings',
    note: 'Bone-in, pepper-first, fried to order.',
    plate: [wings],
    items: [
      {
        id: 'w-toss',
        name: 'Pepper Toss Wings',
        desc: 'Fried crisp, then tossed in our pepper blend while still hot.',
        price: 5000,
      },
      {
        id: 'w-char',
        name: 'Pepper Char Wings',
        desc: 'Grilled till the edges catch and char, finished with pepper and spring onion.',
        price: 5500,
      },
    ],
  },
  {
    id: 'combos',
    title: 'Combos',
    note: 'Wings and fries together, one order.',
    plate: [wings, fries],
    items: [
      {
        id: 'c-toss-fries',
        name: 'Toss & Fries',
        desc: 'Six pepper toss wings with a side of classic fries.',
        price: 7500,
      },
      {
        id: 'c-char-loaded',
        name: 'Char & Loaded',
        desc: 'Six pepper char wings with loaded fries.',
        price: 8500,
      },
      {
        id: 'c-fowy-plate',
        name: 'The Fowy Plate',
        desc: 'Wings your way, loaded fries and a cold Fowy Chapman.',
        price: 10000,
      },
    ],
  },
  {
    id: 'fries',
    title: 'Fries',
    note: 'Cut thick, salted straight out of the oil.',
    plate: [fries],
    items: [
      {
        id: 'f-classic',
        name: 'Classic Fries',
        desc: 'Golden, salted, served plain with pepper sauce on the side.',
        price: 3000,
      },
      {
        id: 'f-loaded',
        name: 'Loaded Fries',
        desc: 'Buried under cheese sauce, pepper and spring onion.',
        price: 4500,
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    note: 'Poured over plenty ice.',
    plate: [drink],
    items: [
      {
        id: 'd-chapman',
        name: 'Fowy Chapman',
        desc: 'The house Chapman, with citrus, bitters, cucumber and mint.',
        price: 2500,
      },
      {
        id: 'd-coffee',
        name: 'Coffee',
        desc: 'Hot and black, or with milk if you ask.',
        price: 2000,
      },
      {
        id: 'd-water',
        name: 'Water',
        desc: 'Chilled bottled water.',
        price: 500,
      },
    ],
  },
]

/** Flat lookup of every item by id, for the tray and the payment summary. */
export const ITEMS_BY_ID = MENU.reduce((all, section) => {
  section.items.forEach((item) => {
    all[item.id] = { ...item, section: section.title }
  })
  return all
}, {})
