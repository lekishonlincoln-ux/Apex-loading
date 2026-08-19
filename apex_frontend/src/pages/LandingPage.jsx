import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

export default function LandingPage() {
  const stats = [
    { icon: '👥', number: '25,000+', label: 'Active Professionals' },
    { icon: '💼', number: '1,350+', label: 'Real Opportunities' },
    { icon: '✅', number: '98%', label: 'Successful Jobs' },
    { icon: '🏢', number: '520+', label: 'Verified Vendors' },
    { icon: '💰', number: 'KES 32M+', label: 'Earned by Users' },
  ]

  const professionals = [
    { rank: 1, name: 'Brian M.', role: 'Backend Developer', score: 9152 },
    { rank: 2, name: 'Sharon N.', role: 'UI/UX Designer', score: 8742 },
    { rank: 3, name: 'Ian M.', role: 'Mobile Developer', score: 8215 },
    { rank: 4, name: 'Mercy A.', role: 'Product Designer', score: 7980 },
    { rank: 5, name: 'Collins O.', role: 'DevOps Engineer', score: 7645 },
  ]

  const opportunities = [
    { title: 'Build a React Dashboard', tags: ['React', 'Tailwind', 'API Integration'], reward: 'KES 45,000', level: 'Intermediate' },
    { title: 'Diagnose Car Engine Issue', tags: ['Node', 'Diagnostics', 'Hardware'], reward: 'KES 12,000', level: 'Advanced' },
    { title: 'House Wiring Installation', tags: ['Electrical', 'Wiring', 'Safety'], reward: 'KES 18,000', level: 'Intermediate' },
  ]

  const benefits = [
    { icon: '⭐', title: 'Merit Over Popularity', desc: 'Ranked by performance, not followers or reviews.' },
    { icon: '💎', title: 'Real Opportunities', desc: 'Get matched to jobs and real projects.' },
    { icon: '📈', title: 'Grow Every Day', desc: 'Cohorts, feedback and tools to level up continuously.' },
    { icon: '💸', title: 'Earn & Scale', desc: 'Access funding, tools, and support to grow your career.' },
  ]

  const chartBars = [28, 58, 42, 71, 60, 95, 86, 100, 78, 92, 110, 120]

  return (
    <>
      <Navbar />
      <main style={{ background: 'radial-gradient(circle at top, rgba(123,92,255,0.18), transparent 32%), #040b1b', color: '#edf2ff', minHeight: '100vh' }}>
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#a78bfa', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.76rem', marginBottom: '0.8rem' }}>
                PERFORMANCE-POWERED GROWTH
              </div>
              <h1 style={{ fontSize: 'clamp(3.2rem, 7vw, 7rem)', lineHeight: '0.9', fontWeight: 900, letterSpacing: '-0.08em', marginBottom: '1rem' }}>
                Prove.<br />
                Perform.<br />
                <span style={{ color: '#8b5cf6' }}>Progress.</span>
              </h1>
              <p style={{ maxWidth: '620px', color: '#cbd5e1', fontSize: '1.08rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                Apex is the performance-powered ecosystem that validates your skills, builds your credibility, and connects you to real opportunities.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <Link to="/register"><button style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', borderRadius: '0.85rem', padding: '0.9rem 1.7rem', fontSize: '1rem', fontWeight: 700, boxShadow: '0 12px 28px rgba(124, 58, 237, 0.4)' }}>Join Apex Now →</button></Link>
                <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '0.85rem', padding: '0.9rem 1.7rem', fontSize: '1rem', fontWeight: 700 }}>Watch How It Works</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3].map((item) => (
                    <div key={item} style={{ width: '38px', height: '38px', borderRadius: '50%', marginLeft: item === 1 ? 0 : '-10px', background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)', border: '2px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.76rem' }}>A</div>
                  ))}
                </div>
                <span style={{ color: '#dbeafe', fontSize: '0.96rem' }}><strong>25,000+</strong> professionals already building credibility and earning opportunities.</span>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(167, 139, 250, 0.25)', borderRadius: '1.5rem', padding: '1.2rem', boxShadow: '0 32px 80px rgba(2,6,23,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>KW</div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>Kelvin W.</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Backend Developer</div>
                  </div>
                </div>
                <span style={{ background: 'rgba(34,197,94,0.18)', color: '#86efac', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 700 }}>Active</span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Merit Score</div>
                <div style={{ fontSize: '2.7rem', fontWeight: 900, letterSpacing: '-0.05em' }}>7,842 <span style={{ fontSize: '1rem', color: '#4ade80', marginLeft: '0.3rem' }}>↑ 128</span></div>
              </div>

              <div style={{ display: 'flex', height: '70px', alignItems: 'flex-end', gap: '0.35rem', marginBottom: '1rem' }}>
                {chartBars.map((value, index) => (
                  <div key={index} style={{ flex: 1, height: `${value}%`, borderRadius: '0.35rem 0.35rem 0 0', background: index % 2 === 0 ? 'linear-gradient(180deg, #a78bfa, #7c3aed)' : 'linear-gradient(180deg, #8b5cf6, #5b21b6)' }} />
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
                {[
                  ['Cohorts Done', '32'],
                  ['Top Rank', '12'],
                  ['Jobs Completed', '18'],
                  ['Success Rate', '94%'],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: 'rgba(15,23,42,0.72)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '0.8rem', padding: '0.8rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.3rem' }}>{label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1rem', padding: '1.4rem 1rem', textAlign: 'center', boxShadow: '0 12px 32px rgba(2,6,23,0.12)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#a78bfa', marginBottom: '0.3rem' }}>{stat.number}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1.2rem', padding: '1.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Top Professionals This Month</h2>
              <Link to="/rankings" style={{ color: '#a78bfa', fontWeight: 700 }}>View Leaderboard</Link>
            </div>
            {professionals.map((person) => (
              <div key={person.rank} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: '1rem', alignItems: 'center', padding: '0.9rem 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1.15rem' }}>{person.rank}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{person.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{person.role}</div>
                </div>
                <div style={{ fontWeight: 800 }}>{person.score.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1.2rem', padding: '1.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Recent Opportunities</h2>
              <Link to="/opportunities" style={{ color: '#a78bfa', fontWeight: 700 }}>View All</Link>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {opportunities.map((opp) => (
                <div key={opp.title} style={{ background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '0.9rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.8rem' }}>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 700 }}>{opp.title}</h3>
                    <span style={{ background: 'rgba(167,139,250,0.12)', color: '#ddd6fe', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{opp.level}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.7rem' }}>
                    {opp.tags.map((tag) => (
                      <span key={tag} style={{ background: 'rgba(148,163,184,0.08)', color: '#e2e8f0', borderRadius: '0.5rem', padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ color: '#a78bfa', fontWeight: 800 }}>{opp.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {benefits.map((benefit) => (
              <div key={benefit.title} style={{ background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1rem', padding: '1.3rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.7rem' }}>{benefit.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{benefit.title}</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
