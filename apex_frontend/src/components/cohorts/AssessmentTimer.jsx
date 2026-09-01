import { useState, useEffect } from 'react'

export default function AssessmentTimer({ limitMinutes, startedAt, onExpire }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.ceil((new Date(startedAt).getTime() + limitMinutes * 60000 - Date.now()) / 1000)))

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { clearInterval(id); onExpire?.(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')
  const warning = remaining < 300

  return (
    <div style={{
      fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700,
      color: warning ? 'var(--color-error)' : 'var(--color-text)',
      padding: '0.5rem 1rem', background: 'var(--color-surface)',
      borderRadius: 'var(--radius)', border: `2px solid ${warning ? 'var(--color-error)' : 'var(--color-border)'}`,
    }}>
      {mins}:{secs}
    </div>
  )
}
