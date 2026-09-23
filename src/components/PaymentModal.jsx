import { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { useToast } from './Toast'
import { useOrder } from '../context/OrderContext'
import { BANK, BRAND, formatMoney } from '../config'
import { orderMessage, submitOrder } from '../services/submitOrder'

const MAX_RECEIPT_BYTES = 8 * 1024 * 1024 // 8MB — plenty for a screenshot

/**
 * Three steps in one dialog:
 *   transfer  — who to pay and how much
 *   receipt   — name, phone, and a picture of the transfer
 *   done      — reference number, and a way to send it on WhatsApp
 */
export default function PaymentModal({ open, onClose }) {
  const { lines, total, clear } = useOrder()
  const toast = useToast()

  const [step, setStep] = useState('transfer')
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [receipt, setReceipt] = useState(null) // { file, url }
  const [dragging, setDragging] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const fileInput = useRef(null)

  // start clean every time the dialog is opened
  useEffect(() => {
    if (open) {
      setStep('transfer')
      setError('')
      setSending(false)
    }
  }, [open])

  // object URLs have to be handed back or the tab leaks memory
  useEffect(() => () => receipt && URL.revokeObjectURL(receipt.url), [receipt])

  function chooseFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image. A screenshot or a photo works best.')
      return
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setError('That image is over 8MB. Please send a smaller one.')
      return
    }
    setError('')
    setReceipt((current) => {
      if (current) URL.revokeObjectURL(current.url)
      return { file, url: URL.createObjectURL(file) }
    })
  }

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(BANK.accountNumber)
      toast('Account number copied.')
    } catch {
      toast('Could not copy — please type the number in.')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!receipt) {
      setError('Please attach a picture of your receipt.')
      return
    }
    if (!customer.name.trim() || !customer.phone.trim()) {
      setError('We need your name and phone number to match the payment.')
      return
    }

    setSending(true)
    setError('')
    try {
      const result = await submitOrder({
        customer,
        lines,
        total,
        receiptFile: receipt.file,
      })
      setReference(result.reference)
      setStep('done')
    } catch (err) {
      setError(err.message || 'That did not send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function finish() {
    clear()
    onClose()
  }

  const whatsappHref = BRAND.whatsapp
    ? `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
        orderMessage({ reference, customer, lines, total, formatMoney }),
      )}`
    : null

  return (
    <Modal
      open={open}
      onClose={step === 'done' ? finish : onClose}
      labelledBy="pay-title"
      dismissable={!sending}
      scrollKey={step}
    >
      {step === 'transfer' && (
        <>
          <h2 className="modal__title" id="pay-title">
            Make the transfer
          </h2>
          <p className="modal__note">
            Send the exact total to the account below, then come back and tap the button.
          </p>

          <div className="bank">
            <div className="bank__row">
              <span className="bank__label">Bank</span>
              <span className="bank__value">{BANK.bankName}</span>
            </div>
            <div className="bank__row">
              <span className="bank__label">Account number</span>
              <span className="bank__account">
                <span className="bank__number">{BANK.accountNumber}</span>
                <button type="button" className="btn-quiet" onClick={copyAccountNumber}>
                  Copy
                </button>
              </span>
            </div>
            <div className="bank__row">
              <span className="bank__label">Account name</span>
              <span className="bank__value">{BANK.accountName}</span>
            </div>
            <div className="bank__amount">
              <span className="bank__label">Amount to send</span>
              <strong>{formatMoney(total)}</strong>
            </div>
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--solid btn--wide"
              onClick={() => setStep('receipt')}
            >
              I have made the payment
            </button>
            <button type="button" className="btn-quiet" onClick={onClose}>
              Not yet, go back
            </button>
          </div>
        </>
      )}

      {step === 'receipt' && (
        <form onSubmit={handleSubmit}>
          <h2 className="modal__title" id="pay-title">
            Send your receipt
          </h2>
          <p className="modal__note">
            A screenshot of the transfer is all we need to confirm your order.
          </p>

          <label
            className={`dropzone${dragging ? ' is-dragging' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              chooseFile(event.dataTransfer.files?.[0])
            }}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              onChange={(event) => chooseFile(event.target.files?.[0])}
            />
            <span className="dropzone__title">
              {receipt ? 'Choose a different picture' : 'Add a picture of your receipt'}
            </span>
            <p className="dropzone__hint">Tap to pick one, or drag it in. Images up to 8MB.</p>
          </label>

          {receipt && (
            <div className="receipt">
              <img src={receipt.url} alt="Your payment receipt" />
              <div className="receipt__bar">
                <span className="receipt__name">{receipt.file.name}</span>
                <button
                  type="button"
                  className="btn-quiet"
                  onClick={() => {
                    URL.revokeObjectURL(receipt.url)
                    setReceipt(null)
                    if (fileInput.current) fileInput.current.value = ''
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="field">
            <label htmlFor="pay-name">Your name</label>
            <input
              id="pay-name"
              name="name"
              autoComplete="name"
              value={customer.name}
              onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="pay-phone">Phone number</label>
            <input
              id="pay-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={customer.phone}
              onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="pay-address">Where should we send it? (leave empty for pickup)</label>
            <textarea
              id="pay-address"
              name="address"
              value={customer.address}
              onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal__actions">
            <button type="submit" className="btn btn--solid btn--wide" disabled={sending}>
              {sending ? 'Sending…' : 'Submit my receipt'}
            </button>
            <button
              type="button"
              className="btn-quiet"
              onClick={() => setStep('transfer')}
              disabled={sending}
            >
              Back to the account details
            </button>
          </div>
        </form>
      )}

      {step === 'done' && (
        <div className="done">
          <div className="done__seal" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
          </div>
          <h2 className="modal__title" id="pay-title">
            Thank you
          </h2>
          <p className="modal__note">
            We have your receipt and we will confirm your order shortly. Keep this reference.
          </p>
          <p className="done__ref">{reference}</p>

          <div className="modal__actions">
            {whatsappHref && (
              <a
                className="btn btn--solid btn--wide"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                Send it on WhatsApp too
              </a>
            )}
            <button type="button" className="btn-quiet" onClick={finish}>
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
