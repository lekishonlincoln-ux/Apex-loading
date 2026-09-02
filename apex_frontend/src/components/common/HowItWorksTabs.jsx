import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const WATCH_KEY = 'apex_intro_watched'
export const introWatched = () => localStorage.getItem(WATCH_KEY) === 'true'

const tabs = [
  ['Start here', 'Your Apex journey starts on the dashboard.', 'After you join, the dashboard gives you up to six recommended cohorts each day. It shows your activity, merit score, opportunities, notifications, and the next action that moves your profile forward.', 'DASHBOARD · DAILY COHORTS · NEXT ACTION', '#a78bfa', 'See the journey'],
  ['I have skills', 'Your profile turns activity into proof.', 'Your profile records your profession, participation, assessment results, trust signals, skills, and progress. Every completed activity gives vendors a clearer picture of what you can actually do.', 'PARTICIPATE · DEMONSTRATE · BUILD YOUR PROFILE', '#38bdf8', 'Build your capability'],
  ['I keep learning', 'The cohort makes learning measurable.', 'Choose a recommended cohort, pay the selected participation tier, enroll after payment verification, watch the lesson, and complete the five-question assessment. Your results feed your capability record.', 'PAY · ENROLL · WATCH · DEMONSTRATE', '#34d399', 'Test your capability'],
  ['I found a weakness', 'What happens next?', 'A lower result is a direction signal, not a dead end. Apex can connect development needs to mentorship, scheduled learning sessions, tutorials, professional guidance, and a clearer improvement path.', 'IDENTIFY THE GAP · IMPROVE THE GAP · MOVE FORWARD', '#fbbf24', 'Start improving'],
  ['I want progress', 'Participation builds a history that compounds.', 'Each verified cohort, assessment, improvement result, and completed opportunity strengthens your profile. You do not restart your credibility every time; your capability history grows with you.', 'PARTICIPATION · IMPROVEMENT · CAPABILITY HISTORY · CREDIBILITY', '#fb7185', 'Build your history'],
  ['I need direction', 'Your merit score shows where you stand.', 'Your merit score combines participation, cohort performance, authenticity, and verified outcomes. It is connected to the leaderboard and helps Apex understand which opportunities match your current capability.', 'WHERE YOU ARE · WHAT TO IMPROVE · WHAT COMES NEXT', '#c084fc', 'Find your direction'],
  ['I want more', 'Why the KES 1,000 tier matters.', 'The KES 1,000 participation tier supports deeper cohort activity and a stronger evidence trail. Higher verified participation can support more account-based marketing, richer vendor discovery, and access to better-matched opportunities. Earnings are based on approved participation and selected coaching or opportunity work, never guaranteed.', 'INVEST · BUILD EVIDENCE · INCREASE DISCOVERY', '#2dd4bf', 'Understand the value'],
  ['I want opportunity', 'Opportunity follows demonstrated capability.', 'Vendors can use verified merit, skills, consistency, and completed work to find relevant professionals and teams. Apex improves the signal around you through participation, account-based marketing, and stronger performance evidence.', 'IMPROVE · BUILD CREDIBILITY · REACH BETTER OPPORTUNITIES', '#f97316', 'Prepare for opportunity'],
  ['Why Apex?', 'Build proof, then let it travel.', 'Join, use your dashboard, complete your profile, participate in daily cohorts, improve through feedback and mentorship, grow your merit score, and become easier for the right vendors to identify. Apex creates the pathway; your verified performance creates the eligibility.', 'DASHBOARD · PROFILE · PARTICIPATION · MERIT · OPPORTUNITY', '#f97316', 'Join Apex'],
]

function TabVisual({ index, color }) {
  if (index === 2) return <div style={{ display: 'grid', gap: '0.4rem' }}>{['ASSESS', 'IMPROVE', 'BUILD CAPABILITY', 'EARN REPUTATION', 'ACCESS OPPORTUNITY'].map((step, number) => <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}><b style={{ width: '22px', height: '22px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: color, color: '#07111f', fontSize: '0.65rem' }}>{number + 1}</b><span style={{ color: number === 4 ? '#fff' : '#cbd5e1', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.08em' }}>{step}</span></div>)}</div>
  if (index === 3) return <div style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.7rem', padding: '0.8rem' }}><small style={{ color }}>PSP / SCENARIO 03</small><p style={{ color: '#fff', fontSize: '0.8rem', margin: '0.6rem 0' }}>A client reports a failed deployment. What do you investigate first?</p>{['Check logs and reproduce', 'Restart everything', 'Wait for more data'].map((answer, answerIndex) => <div key={answer} style={{ marginTop: '0.3rem', padding: '0.4rem', background: answerIndex === 0 ? 'rgba(52,211,153,0.2)' : 'rgba(148,163,184,0.1)', color: answerIndex === 0 ? '#86efac' : '#cbd5e1', fontSize: '0.67rem' }}>{answerIndex === 0 ? '✓ ' : '○ '}{answer}</div>)}</div>
  if (index === 4) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}><div style={{ width: '60px', height: '60px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#fb7185', color: '#07111f', fontWeight: 900 }}>AO</div><strong style={{ color, fontSize: '1.8rem' }}>→</strong><div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '0.7rem', borderRadius: '0.6rem', color: '#dbeafe', fontSize: '0.68rem', fontWeight: 800 }}>LIVE CLASS<br /><span style={{ color: '#34d399' }}>GAP → PLAN</span></div></div>
  if (index === 5) return <div style={{ display: 'grid', gap: '0.6rem' }}>{['Capability 82%', 'Participation 64%', 'Improvement +28%', 'Certification 3 paths'].map((item, barIndex) => <div key={item} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', color: '#e2e8f0', fontSize: '0.7rem', fontWeight: 800 }}><span>{item}</span><i style={{ width: `${82 - barIndex * 13}px`, height: '6px', borderRadius: '99px', background: color }} /></div>)}</div>
  if (index === 6) return <div style={{ display: 'grid', gap: '0.4rem' }}>{[['BUSINESS NEED', 'React systems specialist', '#fbbf24'], ['MATCH FOUND', 'David M. · 94% fit', '#34d399'], ['TRUST SIGNAL', '18 challenges · +128', '#38bdf8']].map(([label, value, itemColor]) => <div key={label} style={{ borderLeft: `3px solid ${itemColor}`, padding: '0.5rem 0.7rem', background: 'rgba(255,255,255,0.07)' }}><small style={{ color: itemColor, fontWeight: 900 }}>{label}</small><div style={{ color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}>{value}</div></div>)}</div>
  if (index === 7) return <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem' }}>{[['AO', '#fb7185'], ['DM', '#38bdf8'], ['WN', '#34d399']].map(([initials, avatarColor]) => <div key={initials} style={{ width: '58px', height: '58px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: avatarColor, color: '#07111f', fontWeight: 900, border: '3px solid #111d31' }}>{initials}</div>)}</div>
  return <div style={{ position: 'relative', height: '170px' }}>{[['COURSE', '8%', '3%', '#38bdf8'], ['CERTIFICATE', '48%', '30%', '#fbbf24'], ['PROFILE', '14%', '68%', '#a78bfa'], ['NO RESPONSE', '76%', '10%', '#fb7185']].map(([label, top, left, itemColor]) => <div key={label} style={{ position: 'absolute', top, left, border: `1px solid ${itemColor}`, color: itemColor, padding: '0.6rem 0.7rem', borderRadius: '0.6rem', fontSize: '0.65rem', fontWeight: 900 }}>{label}</div>)}</div>
}

export default function HowItWorksTabs({ nextPath = '/register', required = false, onClose }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const complete = activeTab === tabs.length - 1
  const move = (direction) => setActiveTab((current) => Math.max(0, Math.min(tabs.length - 1, current + direction)))
  const finish = () => { if (complete) { localStorage.setItem(WATCH_KEY, 'true'); navigate(nextPath) } }
  const tab = tabs[activeTab]
  useEffect(() => () => window.speechSynthesis?.cancel(), [])
  useEffect(() => {
    window.speechSynthesis?.cancel()
    setAudioPlaying(false)
  }, [activeTab])
  const toggleAudio = () => {
    if (!window.speechSynthesis) return
    if (audioPlaying) {
      window.speechSynthesis.cancel()
      setAudioPlaying(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(`${tab[0]}. ${tab[1]}. ${tab[2]}`)
    utterance.rate = 0.95
    utterance.onend = () => setAudioPlaying(false)
    utterance.onerror = () => setAudioPlaying(false)
    window.speechSynthesis.speak(utterance)
    setAudioPlaying(true)
  }
  return <div role="dialog" aria-modal="true" aria-labelledby="how-it-works-title" style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(2,6,23,0.68)', display: 'grid', placeItems: 'center', padding: '1rem', backdropFilter: 'blur(5px)' }}><div style={{ width: '100%', maxWidth: '760px', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', background: '#0b1628', border: '1px solid rgba(167,139,250,0.35)', borderRadius: '1rem', boxShadow: '0 30px 90px rgba(0,0,0,0.5)', padding: '0.8rem' }} onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={(event) => { if (touchStart === null) return; const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1); setTouchStart(null) }}>
    {!required && <button onClick={onClose} aria-label="Close how it works" style={{ float: 'right', background: 'rgba(148,163,184,0.14)', color: '#e2e8f0', padding: '0.4rem 0.65rem' }}>Close</button>}
    <div style={{ padding: '0.8rem 1rem' }}><div style={{ color: tab[4], fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 900 }}>APEX / YEAR 1 · {activeTab + 1} OF {tabs.length}</div><h2 id="how-it-works-title" style={{ marginTop: '0.35rem', fontSize: 'clamp(1.4rem, 4vw, 2.25rem)', lineHeight: 1.02, letterSpacing: '-0.05em' }}>Understand the Apex system before you join.</h2><div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginTop: '0.7rem', flexWrap: 'wrap' }}><button onClick={toggleAudio} aria-pressed={audioPlaying} style={{ background: tab[4], color: '#07111f', fontWeight: 800 }}>{audioPlaying ? 'Stop audio' : 'Listen to this tab'}</button><span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Audio explanation · no video</span></div><p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.86rem' }}>Switch tabs or swipe through the journey. Finish the last tab to join Apex.</p></div>
    <div style={{ minHeight: '330px', overflow: 'hidden', borderRadius: '0.75rem', padding: '1.25rem', background: `radial-gradient(circle at 78% 18%, ${tab[4]}35, transparent 28%), linear-gradient(135deg, #101d33, #09111f)` }}><div style={{ color: tab[4], fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.12em' }}>{tab[0]}</div><div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(210px, 0.8fr)', gap: '1.4rem', alignItems: 'center', minHeight: '270px' }}><div><h3 style={{ color: '#fff', fontSize: 'clamp(1.55rem, 4vw, 2.55rem)', lineHeight: 0.98, letterSpacing: '-0.06em' }}>{tab[1]}</h3><p style={{ color: '#cbd5e1', lineHeight: 1.65, fontSize: '0.9rem', marginTop: '0.85rem' }}>{tab[2]}</p><strong style={{ display: 'block', color: tab[4], fontSize: '0.68rem', letterSpacing: '0.1em', marginTop: '1rem' }}>{tab[3]}</strong></div><TabVisual index={activeTab} color={tab[4]} /></div></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, minmax(0, 1fr))', gap: '0.35rem', padding: '0.85rem 0.25rem 0.5rem' }}>{tabs.map((item, index) => <button key={item[0]} onClick={() => setActiveTab(index)} aria-label={`Open tab ${index + 1}: ${item[0]}`} style={{ padding: '0.35rem 0.15rem', background: index === activeTab ? item[4] : 'rgba(148,163,184,0.14)', color: index === activeTab ? '#07111f' : '#94a3b8', fontSize: '0.62rem', fontWeight: 900 }}>{index + 1}</button>)}</div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', padding: '0.35rem 0.25rem 0.15rem' }}><button onClick={() => move(-1)} disabled={activeTab === 0} aria-label="Previous tab" style={{ background: 'rgba(148,163,184,0.14)', color: '#e2e8f0', opacity: activeTab === 0 ? 0.4 : 1 }}>← Back</button><span style={{ color: '#64748b', fontSize: '0.73rem' }}>Swipe to continue</span>{complete ? <button onClick={finish} className="btn-primary">{tab[5]}</button> : <button onClick={() => move(1)} className="btn-primary" style={{ background: tab[4], color: '#07111f' }}>{tab[5]} →</button>}</div>
  </div></div>
}
