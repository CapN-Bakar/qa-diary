import React, { useState } from 'react'
import { useJournal } from '../../context/JournalContext'
import PinRow from './PinRow'
import './Modal.css'

export default function LoginModal() {
  const { unlock, setShowLoginModal } = useJournal()

  const [pin1, setPin1]       = useState(['', '', '', ''])
  const [pin2, setPin2]       = useState(['', '', '', ''])
  const [step, setStep]       = useState(1)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function handlePin1Change(i, val) {
    const next = [...pin1]; next[i] = val; setPin1(next); setError('')
  }

  function handlePin2Change(i, val) {
    const next = [...pin2]; next[i] = val; setPin2(next); setError('')
  }

  // completedDigits is passed directly from PinRow — avoids stale state
  function handlePin1Complete(completedDigits) {
    const value = completedDigits.join('')
    if (value.length === 4) {
      setPin1(completedDigits)
      setStep(2)
      setTimeout(() => {
        document.querySelector('[data-pin-row="2"] input')?.focus()
      }, 60)
    }
  }

  function handlePin2Complete(completedDigits) {
    const value = completedDigits.join('')
    if (value.length === 4) {
      setPin2(completedDigits)
      setTimeout(() => handleSubmit(pin1.join(''), value), 60)
    }
  }

  async function handleSubmit(p1Override, p2Override) {
    const p1 = p1Override ?? pin1.join('')
    const p2 = p2Override ?? pin2.join('')

    if (p1.length < 4) { setError('Please complete the first PIN.'); setStep(1); return }
    if (p2.length < 4) { setError('Please complete the second PIN.'); return }

    setLoading(true)
    const result = await unlock(p1, p2)
    setLoading(false)

    if (result.ok) {
      setShowLoginModal(false)
    } else {
      setError(result.error)
      if (result.error.includes('First')) {
        setPin1(['', '', '', '']); setPin2(['', '', '', '']); setStep(1)
        setTimeout(() => document.querySelector('[data-pin-row="1"] input')?.focus(), 50)
      } else {
        setPin2(['', '', '', ''])
        setTimeout(() => document.querySelector('[data-pin-row="2"] input')?.focus(), 50)
      }
    }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && setShowLoginModal(false)}>
      <div className="modal modal-sm">
        <button className="close-btn" onClick={() => setShowLoginModal(false)}>✕</button>

        <div className="modal-title">🔐 Owner Login</div>
        <p className="modal-subtitle">Enter both PINs in sequence to unlock owner mode.</p>

        <PinRow
          label="First PIN"
          stepNumber={1}
          digits={pin1}
          onChange={handlePin1Change}
          onComplete={handlePin1Complete}
          isDone={step === 2}
          autoFocus
        />

        <div className="pin-divider">then</div>

        <PinRow
          label="Second PIN"
          stepNumber={2}
          digits={pin2}
          onChange={handlePin2Change}
          onComplete={handlePin2Complete}
          isDone={false}
          disabled={step < 2}
        />

        {error && <div className="pin-error">⚠ {error}</div>}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => handleSubmit()}
            disabled={loading || pin1.join('').length < 4 || pin2.join('').length < 4}
          >
            {loading ? 'Verifying…' : 'Unlock'}
          </button>
        </div>
      </div>
    </div>
  )
}
