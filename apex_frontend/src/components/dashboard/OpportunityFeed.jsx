import { useState, useEffect } from 'react'
import { getProfessionalOpportunities } from '../../api/vendorAPI'
import { formatDate, formatCurrency } from '../../utils/formatters'
import LoadingSpinner from '../common/LoadingSpinner'

export default function OpportunityFeed({ filters = {} }) {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfessionalOpportunities(filters).then(({ data }) => setOpportunities(data.results || data)).catch(() => {}).finally(() => setLoading(false))
  }, [filters.profession, filters.skill, filters.min_merit])

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h3>Opportunities</h3>
      {opportunities.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No active opportunities. Make sure you're available.</p>}
      {opportunities.map((opp) => (
        <div key={opp.id} className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div style={{ fontWeight: 700 }}>{opp.job?.title}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            {opp.job?.profession_required} · Budget: {formatCurrency(opp.job?.budget_max, opp.job?.currency)}
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Expires: {formatDate(opp.expires_at)}</div>
        </div>
      ))}
    </div>
  )
}
