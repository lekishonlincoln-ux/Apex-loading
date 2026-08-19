import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getMyProfile, setAvailability } from '../../api/profileAPI'

const OPTIONS = ['available', 'busy', 'offline']
const COLORS = { available: 'var(--color-success)', busy: 'var(--color-warning)', offline: 'var(--color-text-muted)' }

export default function AvailabilityToggle() {
  const [current, setCurrent] = useState('offline')

  useEffect(() => {
    getMyProfile().then(({ data }) => setCurrent(data.availability)).catch(() => {})
  }, [])

  const handleChange = async (val) => {
    try {
      await setAvailability(val)
      setCurrent(val)
      toast.success(`Status set to ${val}`)
    } catch {
      toast.error('Failed to update status.')
    }
  }

  return (
    <div className="card" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>Availability:</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => handleChange(opt)}
          style={{
            background: current === opt ? COLORS[opt] : 'var(--color-border)',
            color: current === opt ? '#fff' : 'var(--color-text)',
            padding: '0.3rem 0.9rem',
            borderRadius: '99px',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
