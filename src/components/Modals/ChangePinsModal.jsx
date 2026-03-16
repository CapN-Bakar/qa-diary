import React, { useState } from 'react'
import { useJournal } from '../../context/JournalContext'
import PinRow from './PinRow'
import './Modal.css'

const EMPTY = ['', '', '', '']

export default function ChangePinsModal() {
  const { changePins, setShowChangePinsModal } = useJournal()

  const [curPin1, setCurPin1] = useState([...EMPTY])
  const [curPin2, setCurPin2] = useState([...EMPTY])
  const [newPin1, setNewPin1] = useState([...EMPTY])
  const [newPin2, setNewPin2] = useState([...EMPTY])
  const [step, setStep]       = useState(1)  // 1→4 as each row completes
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  function advanceTo(nextStep) {
    setTimeout(() => {
      setStep(nextStep)
      setTimeout(() => {
        document.querySelector(`[data-pin-row="${nextStep}"] input`)?.focus()
      }, 50)
    }, 120)
  }

  function handleSubmit() {
    const cp1 = curPin1.join(''), cp2 = curPin2.join('')
    const np1 = newPin1.join(''), np2 = newPin2.join('')

    if ([cp1, cp2, np1, np2].some(p => p.length < 4)) {
      setError('Please fill in all four PIN rows.')
      return
    }

    const result = changePins(cp1, cp2, np1, np2)
    if (result.ok) {
      setSuccess(true)
      setTimeout(() => setShowChangePinsModal(false), 1400)
    } else {
      setError(result.error)
      if (result.error.includes('first')) {
        setCurPin1([...EMPTY]); setCurPin2([...EMPTY])
        setNewPin1([...EMPTY]); setNewPin2([...EMPTY])
        setStep(1)
        setTimeout(() => document.querySelector('[data-pin-row="1"] input')?.focus(), 50)
      } else {
        setCurPin2([...EMPTY])
        setNewPin1([...EMPTY]); setNewPin2([...EMPTY])
        setStep(2)
        setTimeout(() => document.querySelector('[data-pin-row="2"] input')?.focus(), 50)
      }
    }
  }

  if (success) {
    return (
      <div className="overlay">
        <div className="modal modal-sm" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div className="modal-title" style={{ borderBottom: 'none', textAlign: 'center' }}>PINs Updated!</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Your new PINs are saved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && setShowChangePinsModal(false)}>
      <div className="modal modal-sm">
        <button className="close-btn" onClick={() => setShowChangePinsModal(false)}>✕</button>
        <div className="modal-title">🔑 Change PINs</div>
        <p className="modal-subtitle">
          Verify your current PINs, then choose two new ones.
        </p>

        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Current PINs
        </div>

        <PinRow
          label="Current first PIN"
          stepNumber={1}
          digits={curPin1}
          onChange={(i, v) => { const d = [...curPin1]; d[i] = v; setCurPin1(d); setError('') }}
          onComplete={() => advanceTo(2)}
          isDone={step > 1}
          autoFocus
        />
        <div className="pin-divider">and</div>
        <PinRow
          label="Current second PIN"
          stepNumber={2}
          digits={curPin2}
          onChange={(i, v) => { const d = [...curPin2]; d[i] = v; setCurPin2(d); setError('') }}
          onComplete={() => advanceTo(3)}
          isDone={step > 2}
          disabled={step < 2}
        />

        <div style={{ height: 1, background: 'var(--border-light)', margin: '20px 0' }} />

        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          New PINs
        </div>

        <PinRow
          label="New first PIN"
          stepNumber={3}
          digits={newPin1}
          onChange={(i, v) => { const d = [...newPin1]; d[i] = v; setNewPin1(d); setError('') }}
          onComplete={() => advanceTo(4)}
          isDone={step > 3}
          disabled={step < 3}
        />
        <div className="pin-divider">and</div>
        <PinRow
          label="New second PIN"
          stepNumber={4}
          digits={newPin2}
          onChange={(i, v) => { const d = [...newPin2]; d[i] = v; setNewPin2(d); setError('') }}
          onComplete={() => setTimeout(handleSubmit, 150)}
          isDone={false}
          disabled={step < 4}
        />

        {error && <div className="pin-error">⚠ {error}</div>}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowChangePinsModal(false)}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={[curPin1, curPin2, newPin1, newPin2].some(d => d.join('').length < 4)}
          >
            Update PINs
          </button>
        </div>
      </div>
    </div>
  )
}
