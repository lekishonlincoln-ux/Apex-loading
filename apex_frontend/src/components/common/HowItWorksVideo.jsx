import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const WATCH_KEY = 'apex_intro_watched'

const tabs = [
  {
    label: 'The question',
    title: 'What if your growth could speak for itself?',
    body: 'You can learn online, earn certificates, build a profile, and apply for jobs. But one problem remains: how do you continuously prove that you are improving and turn that improvement into real opportunity?',
    visual: 'potential',
    color: '#a78bfa',
  },
  {
    label: 'The problem',
    title: 'Your proof should not live in separate places.',
    body: 'A certificate from one platform. A profile on another. Experience somewhere else. Apex connects learning, demonstrated capability, improvement, and opportunity into one continuous system.',
    visual: 'scattered',
    color: '#38bdf8',
  },
  {
    label: 'The Apex loop',
    title: 'Assess. Improve. Build capability. Earn reputation. Access opportunity.',
    body: 'Apex is a professional capability ecosystem. Each step builds on the last, so your progress becomes more useful and more visible over time.',
    visual: 'loop',
    color: '#34d399',
  },
  {
    label: 'PSP challenges',
    title: 'Do not just claim the skill. Demonstrate it.',
    body: 'Professional Skill Participation challenges test how you think, solve problems, and improve through scenarios, reasoning, practical problems, and video situations.',
    visual: 'challenge',
    color: '#fbbf24',
  },
  {
    label: 'Mentorship',
    title: 'A score is a starting point, never a full stop.',
    body: 'When Apex identifies a gap, you get a development path: mentorship, live classes, tutorials, and professional guidance that turns a gap into a plan.',
    visual: 'mentorship',
    color: '#fb7185',
  },
  {
    label: 'Your profile',
    title: 'Your profile becomes a history of real progress.',
    body: 'It shows your participation, development, demonstrated capability, certifications, and progress. The longer you genuinely improve, the stronger your capability history becomes.',
    visual: 'profile',
    color: '#c084fc',
  },
  {
    label: 'Opportunity',
    title: 'When capability meets a real need, doors open.',
    body: 'Businesses may need a specialist, a team, or a specific capability. Apex helps identify suitable participants and capability providers based on demonstrated development and fit.',
    visual: 'opportunity',
    color: '#2dd4bf',
  },
  {
    label: 'Why Apex',
    title: 'Stop starting from zero every time you move.',
    body: 'Apex is not just a course platform, job board, or profile. It connects participation, capability development, and demonstrated improvement into one growing professional ecosystem.',
    visual: 'future',
    color: '#f97316',
  },
]

function TabVisual({ type, color }) {
  if (type === 'loop') return <div style={{ display: 'grid', gap: '0.45rem' }}>{['ASSESS', 'IMPROVE', 'BUILD CAPABILITY', 'EARN REPUTATION', 'ACCESS OPPORTUNITY'].map((step, index) => <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}><span style={{ width: '24px', height: '24px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: color, color: '#07111f', fontSize: '0.68rem', fontWeight: 900 }}>{index + 1}</span><strong style={{ color: index === 4 ? '#fff' : '#cbd5e1', fontSize: '0.76rem', letterSpacing: '0.08em' }}>{step}</strong></div>)}</div>
  if (type === 'scattered') return <div style={{ position: 'relative', height: '170px' }}>{[['COURSE', '8%', '3%', '#38bdf8'], ['CERTIFICATE', '48%', '30%', '#fbbf24'], ['PROFILE', '14%', '68%', '#a78bfa'], ['NO RESPONSE', '76%', '10%', '#fb7185']].map(([text, top, left, itemColor]) => <div key={text} style={{ position: 'absolute', top, left, border: `1px solid ${itemColor}`, color: itemColor, padding: '0.65rem 0.75rem', borderRadius: '0.6rem', fontSize: '0.68rem', fontWeight: 900, transform: text === 'CERTIFICATE' ? 'rotate(-5deg)' : 'none' }}>{text}</div>)}</div>
  if (type === 'challenge') return <div style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.7rem', padding: '0.85rem', textAlign: 'left' }}><div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.67rem' }}><span>PSP / SCENARIO 03</span><span style={{ color }}>02:14</span></div><p style={{ color: '#fff', fontSize: '0.82rem', margin: '0.7rem 0' }}>A client reports a failed deployment. What do you investigate first?</p>{['Check logs and reproduce', 'Restart everything', 'Wait for more data'].map((option, index) => <div key={option} style={{ marginTop: '0.3rem', padding: '0.4rem', borderRadius: '0.35rem', background: index === 0 ? 'rgba(52,211,153,0.2)' : 'rgba(148,163,184,0.1)', color: index === 0 ? '#86efac' : '#cbd5e1', fontSize: '0.68rem' }}>{index === 0 ? '✓ ' : '○ '}{option}</div>)}</div>
  if (type === 'mentorship') return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}><div style={{ width: '62px', height: '62px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#fb7185', color: '#07111f', fontWeight: 900 }}>AO</div><span style={{ color, fontSize: '1.8rem' }}>→</span><div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.6rem', color: '#dbeafe', fontSize: '0.68rem', fontWeight: 800 }}>LIVE CLASS<br /><span style={{ color: '#34d399' }}>GAP → PLAN</span></div></div>
  if (type === 'profile') return <div style={{ display: 'grid', gap: '0.6rem' }}>{['Capability 82%', 'Participation 64%', 'Improvement +28%', 'Certification 3 paths'].map((item, index) => <div key={item} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.72rem', fontWeight: 800 }}><span>{item}</span><span style={{ width: `${82 - index * 13}px`, height: '6px', borderRadius: '99px', background: color }} /></div>)}</div>
  if (type === 'opportunity') return <div style={{ display: 'grid', gap: '0.45rem' }}>{[['BUSINESS NEED', 'React systems specialist', '#fbbf24'], ['MATCH FOUND', 'David M. · 94% fit', '#34d399'], ['TRUST SIGNAL', '18 challenges · +128', '#38bdf8']].map(([label, value, itemColor]) => <div key={label} style={{ borderLeft: `3px solid ${itemColor}`, padding: '0.55rem 0.7rem', background: 'rgba(255,255,255,0.07)', textAlign: 'left' }}><div style={{ color: itemColor, fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.1em' }}>{label}</div><strong style={{ color: '#f8fafc', fontSize: '0.76rem' }}>{value}</strong></div>)}</div>
  if (type === 'future') return <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem' }}>{[['AO', '#fb7185'], ['DM', '#38bdf8'], ['WN', '#34d399']].map(([initials, avatarColor]) => <div key={initials} style={{ width: '58px', height: '58px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: avatarColor, color: '#07111f', fontWeight: 900, border: '3px solid #111d31' }}>{initials}</div>)}</div>
  return <div style={{ border: `1px solid ${color}66`, borderRadius: '0.7rem', padding: '0.9rem', textAlign: 'left' }}><div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.67rem' }}><span>APEX PROFILE</span><span style={{ color }}>LIVE</span></div><div style={{ marginTop: '0.8rem', color: '#fff', fontWeight: 900 }}>Amina Otieno</div><div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Robotics technician · 7,842 merit</div></div>
+}
+
+export default function HowItWorksVideo({ nextPath = '/register', required = false, onClose }) {
+  const navigate = useNavigate()
+  const [activeTab, setActiveTab] = useState(0)
+  const completed = activeTab === tabs.length - 1
+
+  const moveTab = (direction) => setActiveTab((current) => Math.max(0, Math.min(tabs.length - 1, current + direction)))
+  const finish = () => {
+    if (!completed) return
+    localStorage.setItem(WATCH_KEY, 'true')
+    navigate('/')
+  }
+
+  return <div role="dialog" aria-modal="true" aria-labelledby="how-it-works-title" style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(2,6,23,0.68)', display: 'grid', placeItems: 'center', padding: '1rem', backdropFilter: 'blur(5px)' }}>
+    <div style={{ width: '100%', maxWidth: '760px', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', background: '#0b1628', border: '1px solid rgba(167,139,250,0.35)', borderRadius: '1rem', boxShadow: '0 30px 90px rgba(0,0,0,0.5)', padding: '0.8rem' }} onTouchStart={(event) => { event.currentTarget.dataset.touchX = event.touches[0].clientX }} onTouchEnd={(event) => { const start = Number(event.currentTarget.dataset.touchX); const distance = event.changedTouches[0].clientX - start; if (Math.abs(distance) > 45) moveTab(distance < 0 ? 1 : -1) }}>
+      {!required && <button onClick={onClose} aria-label="Close how it works" style={{ float: 'right', background: 'rgba(148,163,184,0.14)', color: '#e2e8f0', padding: '0.4rem 0.65rem' }}>Close</button>}
+      <div style={{ padding: '0.8rem 1rem' }}><div style={{ color: tabs[activeTab].color, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 900 }}>APEX / HOW IT WORKS · {activeTab + 1} OF {tabs.length}</div><h2 id="how-it-works-title" style={{ marginTop: '0.35rem', fontSize: 'clamp(1.4rem, 4vw, 2.25rem)', lineHeight: 1.02, letterSpacing: '-0.05em' }}>Read the Apex story before you step inside.</h2><p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.86rem' }}>Swipe or use the arrows to explore each step. The final tab unlocks your route into Apex.</p></div>
+      <div style={{ position: 'relative', minHeight: '330px', overflow: 'hidden', borderRadius: '0.75rem', padding: '1.25rem', background: `radial-gradient(circle at 78% 18%, ${tabs[activeTab].color}35, transparent 28%), linear-gradient(135deg, #101d33, #09111f)` }}><div style={{ color: tabs[activeTab].color, fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.12em' }}>{tabs[activeTab].label}</div><div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(210px, 0.8fr)', gap: '1.4rem', alignItems: 'center', minHeight: '270px' }}><div><h3 style={{ color: '#fff', fontSize: 'clamp(1.55rem, 4vw, 2.55rem)', lineHeight: 0.98, letterSpacing: '-0.06em' }}>{tabs[activeTab].title}</h3><p style={{ color: '#cbd5e1', lineHeight: 1.65, fontSize: '0.9rem', marginTop: '0.85rem' }}>{tabs[activeTab].body}</p></div><TabVisual type={tabs[activeTab].visual} color={tabs[activeTab].color} /></div></div>
+      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.35rem', padding: '0.85rem 0.25rem 0.5rem' }}>{tabs.map((tab, index) => <button key={tab.label} onClick={() => setActiveTab(index)} aria-label={`Open tab ${index + 1}: ${tab.label}`} style={{ padding: '0.35rem 0.15rem', background: index === activeTab ? tab.color : 'rgba(148,163,184,0.14)', color: index === activeTab ? '#07111f' : '#94a3b8', fontSize: '0.62rem', fontWeight: 900 }}>{index + 1}</button>)}</div>
+      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', padding: '0.35rem 0.25rem 0.15rem' }}><button onClick={() => moveTab(-1)} disabled={activeTab === 0} aria-label="Previous tab" style={{ background: 'rgba(148,163,184,0.14)', color: '#e2e8f0', opacity: activeTab === 0 ? 0.4 : 1 }}>← Back</button><span style={{ color: '#64748b', fontSize: '0.73rem' }}>Swipe to continue</span>{completed ? <button onClick={finish} className="btn-primary">Return to Apex home</button> : <button onClick={() => moveTab(1)} className="btn-primary" style={{ background: tabs[activeTab].color, color: '#07111f' }}>Next tab →</button>}</div>
+    </div>
+  </div>
+}
