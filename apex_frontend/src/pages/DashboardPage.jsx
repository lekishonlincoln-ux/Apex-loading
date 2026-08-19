import Navbar from '../components/common/Navbar'
import MeritScoreWidget from '../components/dashboard/MeritScoreWidget'
import AvailabilityToggle from '../components/dashboard/AvailabilityToggle'
import OpportunityFeed from '../components/dashboard/OpportunityFeed'
import ProgressAnalytics from '../components/dashboard/ProgressAnalytics'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  const statCards = [
    { label: 'Cohorts Done', value: '32' },
    { label: 'Top Rank', value: '12' },
    { label: 'Jobs Completed', value: '18' },
    { label: 'Success Rate', value: '94%' },
  ]

  const metricCards = [
    { title: 'Merit Score', value: '7,842', delta: '+128', color: '#8b5cf6' },
    { title: 'Cohort Completion', value: '86%', delta: '+12%', color: '#22c55e' },
    { title: 'Jobs Won', value: '18', delta: '+4', color: '#f59e0b' },
    { title: 'Vendor Trust', value: '92%', delta: '+7%', color: '#06b6d4' },
  ]

  const bars = [28, 45, 64, 52, 80, 72, 94, 88, 110, 96, 118, 126]

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '1280px', paddingTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 0.9fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1.3rem', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: '#a78bfa', textTransform: 'uppercase', fontWeight: 700 }}>Cohort assessment</div>
                <h2 style={{ marginTop: '0.35rem', fontSize: '2.1rem', fontWeight: 800 }}>Welcome back, {user?.username}</h2>
              </div>
              <div style={{ background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.22)', color: '#ddd6fe', padding: '0.5rem 0.85rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.78rem' }}>Live score</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(15,23,42,0.8))', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>KW</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>Kelvin W.</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Backend Developer</div>
                </div>
              </div>

              <div style={{ marginBottom: '0.7rem', color: '#94a3b8', fontSize: '0.78rem' }}>Merit Score</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.06em', marginBottom: '0.8rem' }}>7,842 <span style={{ fontSize: '1rem', color: '#4ade80', marginLeft: '0.5rem' }}>↑ 128</span></div>

              <div style={{ display: 'flex', alignItems: 'flex-end', height: '72px', gap: '0.35rem', marginBottom: '1rem' }}>
                {bars.map((value, index) => (
                  <div key={index} style={{ flex: 1, height: `${value}%`, borderRadius: '0.35rem 0.35rem 0 0', background: index % 2 === 0 ? 'linear-gradient(180deg, #a78bfa, #7c3aed)' : 'linear-gradient(180deg, #4f46e5, #7c3aed)' }} />
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '0.75rem' }}>
                {statCards.map((item) => (
                  <div key={item.label} style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '0.8rem', padding: '0.8rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.25rem' }}>{item.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1.3rem', padding: '1.2rem' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a78bfa', fontWeight: 700, marginBottom: '0.75rem' }}>Insights</div>
            <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(14,165,233,0.08))', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ fontWeight: 700 }}>Performance trend</div>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>+12.4%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.35rem', height: '120px' }}>
                {[24, 30, 42, 38, 58, 72, 75, 86, 98, 110].map((value, index) => (
                  <div key={index} style={{ flex: 1, height: `${value}%`, borderRadius: '0.42rem 0.42rem 0 0', background: index % 2 === 0 ? 'linear-gradient(180deg, #c4b5fd, #8b5cf6)' : 'linear-gradient(180deg, #7c3aed, #4f46e5)' }} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: '1rem', color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.9rem' }}>Your credibility is trending upward and your cohort completion rate is improving each week.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div>
            <MeritScoreWidget />
            <div style={{ marginTop: '1rem' }}>
              <AvailabilityToggle />
            </div>
          </div>
          <OpportunityFeed />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {metricCards.map((card) => (
              <div key={card.title} style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1rem', padding: '1.2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{card.title}</div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800 }}>{card.value}</div>
                </div>
                <div style={{ background: 'rgba(8, 145, 178, 0.12)', color: card.color, borderRadius: '999px', padding: '0.35rem 0.6rem', fontWeight: 700, fontSize: '0.75rem' }}>{card.delta}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <ProgressAnalytics />
        </div>
      </div>
    </>
  )
}
