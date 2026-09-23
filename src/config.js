/**
 * Everything you are likely to change lives in this one file.
 * Menu items and prices are in src/data/menu.js.
 */

export const BRAND = {
  name: 'Fowy Bites',
  tagline: 'Pepper wings off the fire, hot fries, and a Chapman poured cold.',
  // Shown on the confirmation screen and used for the "send on WhatsApp" link.
  // Use the international format with no + and no spaces, e.g. 2348012345678
  whatsapp: '',
  instagram: '', // e.g. 'fowybites' — leave empty to hide the link
  phone: '', // e.g. '2348012345678' — shown on the Visit section, leave empty to hide
}

/** Shown as the rating chip on the homepage. Set `count` to '' to hide it. */
export const RATING = {
  value: '4.9',
  count: 'from regulars who keep coming back',
}

/** Shown in the "Visit us" section. Leave `address` empty to hide the whole block. */
export const VISIT = {
  address: '',
  hours: [
    { days: 'Mon – Fri', time: '11:00 – 21:00' },
    { days: 'Sat – Sun', time: '12:00 – 22:00' },
  ],
}

/** The account customers transfer to. Replace all three before going live. */
export const BANK = {
  bankName: 'Your bank name',
  accountNumber: '0000000000',
  accountName: 'Fowy Bites',
}

export const CURRENCY = '₦'

/** Set to 0 for pickup-only, or any flat amount you charge for delivery. */
export const DELIVERY_FEE = 0

export const formatMoney = (amount) =>
  CURRENCY + Number(amount || 0).toLocaleString('en-NG')
