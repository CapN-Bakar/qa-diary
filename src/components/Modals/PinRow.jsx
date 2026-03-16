import React, { useRef } from 'react'
import './Modal.css'

export default function PinRow({ label, stepNumber, digits, onChange, onComplete, isDone = false, disabled = false, autoFocus = false }) {
  const refs = [useRef(), useRef(), useRef(), useRef()]

  function handleChange(i, val) {
    if (disabled) return
    if (!/^\d?$/.test(val)) return

    const next = [...digits]
    next[i] = val
    onChange(i, val)

    if (val && i < 3) {
      refs[i + 1].current?.focus()
    }

    // Pass the fully updated array directly — avoids stale state
    if (val && i === 3) {
      const completed = [...digits]
      completed[3] = val
      if (completed.every(d => d !== '')) {
        onComplete?.(completed)
      }
    }
  }

  function handleKeyDown(e, i) {
    if (disabled) return
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  return (
    <div
      className={`pin-block${disabled ? ' pin-block-disabled' : ''}`}
      data-pin-row={stepNumber}
    >
      <div className="pin-block-label">
        <span className={`pin-step-badge${isDone ? ' done' : ''}`}>
          {isDone ? '✓' : stepNumber}
        </span>
        {label}
      </div>
      <div className="pin-inputs">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            className={`pin-digit${d ? (isDone ? ' done' : ' filled') : ''}`}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={d}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(e, i)}
          />
        ))}
      </div>
    </div>
  )
}
