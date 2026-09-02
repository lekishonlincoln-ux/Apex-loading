import { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import { getCohorts, allocateCohortRewards, listWhatsAppInvites, requestWhatsAppInvite, runMentorshipFollowUp, requestCoachPayout, updateCoachPayoutDetails } from '../api/cohortAPI'
import toast from 'react-hot-toast'
import { createActivityNotification } from '../api/notificationAPI'

const coaches = [
  { name: 'Skills Coach', color: '#a78bfa', focus: 'Technical expertise, industry knowledge, AI & robotics, problem solving, certifications.', outcome: 'Better technical capability.' },
  { name: 'Consistency Coach', color: '#22c55e', focus: 'Reliability, communication, time management, milestone completion, professional discipline.', outcome: 'Higher trust and deployment readiness.' },
  { name: 'Improvement Coach', color: '#f97316', focus: 'Deployment history, weaknesses, a personalized roadmap, and long-term progress.', outcome: 'Continuous capability growth.' },
]

export default function MentorshipPage() {
  const { user } = useAuth()
  const [selected, setSelected] = useState('Skills Coach')
  const [cohorts, setCohorts] = useState([])
  const [selectedCohort, setSelectedCohort] = useState('')
  const [allocating, setAllocating] = useState(false)
  const [followingUp, setFollowingUp] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamCoach, setTeamCoach] = useState('Skills Coach')
  const [teams, setTeams] = useState([])
  const [whatsappInvites, setWhatsappInvites] = useState([])
  const [payouts, setPayouts] = useState([])
  const [payoutDetails, setPayoutDetails] = useState({})
  const [checkingPayout, setCheckingPayout] = useState(false)
  const active = coaches.find((coach) => coach.name === selected)

  useEffect(() => {
    if (user?.is_admin || user?.role === 'admin') getCohorts().then(({ data }) => setCohorts(data.results || data)).catch(() => {})
    listWhatsAppInvites().then(({ data }) => setWhatsappInvites(data)).catch(() => {})
  }, [user])

  const handlePayout = async () => {
    if (!selectedCohort) return
    setAllocating(true)
    try {
      const { data } = await allocateCohortRewards(selectedCohort)
      toast.success(`${data.message} Apex wallet: KES ${data.apex_wallet}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Payout is not ready yet.')
    } finally {
      setAllocating(false)
    }
  }

  const handleFollowUp = async () => {
    if (!selectedCohort) return
    setFollowingUp(true)
    try {
      const { data } = await runMentorshipFollowUp(selectedCohort)
      toast.success(`${data.winning_group} group is eligible for deployment.`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Follow-up review is not ready yet.')
    } finally {
      setFollowingUp(false)
    }
  }

  const createMentorshipTeam = () => {
    if (!teamName.trim()) return
    setTeams((current) => [...current, { name: teamName.trim(), coach: teamCoach, members: 0 }])
    setTeamName('')
    toast.success(`${teamCoach} mentorship team created.`)
  }

  const requestWhatsApp = async () => {
    try {
      const { data } = await requestWhatsAppInvite({ coach_type: teamCoach })
      setWhatsappInvites((current) => [data, ...current.filter((item) => item.id !== data.id)])
      toast.success(data.status === 'pending' ? 'Invite request sent to the mentorship admin.' : 'Invite request already exists.')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not request a WhatsApp invite.')
    }
  }
  const handlePayoutRequest = async () => {
    setCheckingPayout(true)
    try {
      const { data } = await requestCoachPayout()
      setPayouts(data)
      toast.success('You qualify. Submit your payment details below.')
    } catch (error) {
      toast.error(error.response?.data?.error || 'You are not qualified for a coach payout yet.')
    } finally { setCheckingPayout(false) }
  }
  const handlePayoutDetails = async (assignment) => {
    try {
      const { data } = await updateCoachPayoutDetails(assignment.id, payoutDetails[assignment.id] || {})
      setPayouts((current) => current.map((item) => item.id === data.id ? data : item))
      toast.success('Payment details submitted for admin payout processing.')
    } catch (error) { toast.error(error.response?.data?.error || 'Payment details could not be submitted.') }
  }
  return (
    <>
      <Navbar />
      <main className="page-container" style={{ maxWidth: '1180px' }}>
        <section style={{ padding: '2.5rem 0 2rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ color: '#a78bfa', fontSize: '0.75rem', letterSpacing: '0.16em', fontWeight: 800 }}>CONTINUOUS CAPABILITY</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', maxWidth: '820px', margin: '0.5rem 0 0.8rem' }}>Mentorship built from real deployment performance.</h1>
          <p style={{ maxWidth: '700px', color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>Business Nodes become higher-capability professionals through coaching that responds to evidence, not generic teaching.</p>
        </section>
        <section style={{ padding: '2rem 0', display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(280px, 0.8fr)', gap: '1rem' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
              {coaches.map((coach) => <button key={coach.name} onClick={() => setSelected(coach.name)} style={{ textAlign: 'left', minHeight: '92px', borderTop: `3px solid ${coach.color}`, background: selected === coach.name ? 'var(--color-surface)' : 'transparent', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', borderLeft: '1px solid var(--color-border)', color: 'var(--color-text)', padding: '0.8rem' }}>{coach.name}</button>)}
            </div>
            <article className="card" style={{ borderLeft: `4px solid ${active.color}`, minHeight: '170px' }}><div style={{ color: active.color, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Selected coaching track</div><h2 style={{ margin: '0.45rem 0' }}>{active.name}</h2><p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{active.focus}</p><strong>Outcome: {active.outcome}</strong></article>
          </div>
          <aside className="card" style={{ background: 'linear-gradient(145deg, rgba(167,139,250,0.12), rgba(34,197,94,0.08))' }}><div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Today</div><h3 style={{ margin: '0.5rem 0 1rem' }}>Mentorship dashboard</h3><div style={{ display: 'grid', gap: '0.7rem' }}><div><strong>2</strong><span style={{ color: 'var(--color-text-muted)' }}> sessions today</span></div><div><strong>+8%</strong><span style={{ color: 'var(--color-text-muted)' }}> weekly capability improvement</span></div><div><strong>Safety certification</strong><span style={{ color: 'var(--color-text-muted)' }}> next recommendation</span></div><div><strong>Friday</strong><span style={{ color: 'var(--color-text-muted)' }}> simulation / probation</span></div></div></aside>
        </section>
        <section className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Coach payout</div>
          <h3 style={{ margin: '0.45rem 0' }}>Release payouts after successful cohort participation</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Coach roles and scores are selected from the completed cohort leaderboard. Payouts remain locked until the cohort threshold and eligible performance results are confirmed.</p>
          {user?.is_admin || user?.role === 'admin' ? (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <select aria-label="Cohort for payout" value={selectedCohort} onChange={(event) => setSelectedCohort(event.target.value)}>
                <option value="">Select completed cohort</option>
                {cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.title} · {cohort.payment_tier} · {cohort.participant_count}/{cohort.max_participants}</option>)}
              </select>
              <button className="btn-primary" disabled={!selectedCohort || allocating} onClick={handlePayout}>{allocating ? 'Allocating...' : 'Allocate Coach Payouts'}</button>
              <button className="btn-outline" disabled={!selectedCohort || followingUp} onClick={handleFollowUp}>{followingUp ? 'Reviewing...' : 'Run mentorship follow-up'}</button>
            </div>
          ) : (
            <div>
              <button className="btn-primary" onClick={handlePayoutRequest} disabled={checkingPayout}>{checkingPayout ? 'Checking qualification...' : 'Check coach payout qualification'}</button>
              {payouts.length > 0 && <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
                {payouts.map((assignment) => {
                  const details = payoutDetails[assignment.id] || { payment_method: assignment.payment_method || '', payment_recipient: assignment.payment_recipient || '', payment_note: assignment.payment_note || '' }
                  return <div key={assignment.id} style={{ border: '1px solid var(--color-border)', padding: '0.8rem' }}>
                    <strong>{assignment.role_label} · KES {assignment.payout_amount}</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                      <select aria-label={`Payment method for ${assignment.role_label}`} value={details.payment_method} onChange={(event) => setPayoutDetails((current) => ({ ...current, [assignment.id]: { ...details, payment_method: event.target.value } }))}>
                        <option value="">Payment method</option><option value="mpesa">M-Pesa</option><option value="bank_transfer">Bank transfer</option><option value="paypal">PayPal</option><option value="other">Other</option>
                      </select>
                      <input aria-label={`Payment recipient for ${assignment.role_label}`} placeholder="Number or account" value={details.payment_recipient} onChange={(event) => setPayoutDetails((current) => ({ ...current, [assignment.id]: { ...details, payment_recipient: event.target.value } }))} />
                      <input aria-label={`Payment note for ${assignment.role_label}`} placeholder="Payment note (optional)" value={details.payment_note} onChange={(event) => setPayoutDetails((current) => ({ ...current, [assignment.id]: { ...details, payment_note: event.target.value } }))} />
                      <button className="btn-outline" onClick={() => handlePayoutDetails(assignment)} disabled={assignment.payout_status === 'paid'}>{assignment.payout_status === 'details_submitted' ? 'Update details' : 'Submit payment details'}</button>
                    </div>
                  </div>
                })}
              </div>}
            </div>
          )}
        </section>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <article className="card" style={{ borderTop: '3px solid #38bdf8' }}>
            <div style={{ color: '#38bdf8', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800 }}>Next live session</div>
            <h3 style={{ margin: '0.45rem 0' }}>Skills Coach · Zoom review</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: '0.35rem 0' }}>Thursday, 7:00 PM EAT · 45 minutes</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Assessment feedback, technical capability gaps, and the next certification recommendation.</p>
            <button className="btn-outline" onClick={() => { createActivityNotification({ title: 'Zoom reminder scheduled', message: 'Your Skills Coach Zoom review is scheduled for Thursday at 7:00 PM EAT.', action_url: '/mentors', metadata: { event: 'zoom_reminder' } }).catch(() => {}); toast.success('Zoom reminder scheduled for Thursday at 7:00 PM EAT.') }}>Schedule Zoom reminder</button>
          </article>
          <article className="card" style={{ borderTop: '3px solid #25d366' }}>
            <div style={{ color: '#25d366', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800 }}>Mentorship community</div>
            <h3 style={{ margin: '0.45rem 0' }}>APEX WhatsApp group</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Join the admin-managed group for session reminders, coach feedback, and cohort coordination.</p>
            <button className="btn-outline" onClick={requestWhatsApp}>Request WhatsApp invite</button>
            {whatsappInvites.length > 0 && <div style={{ marginTop: '0.7rem', display: 'grid', gap: '0.35rem' }}>{whatsappInvites.slice(0, 3).map((invite) => <div key={invite.id} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{invite.coach_type || 'Mentorship'}: <strong>{invite.status}</strong>{invite.group_link && <> · <a href={invite.group_link} target="_blank" rel="noreferrer">Join WhatsApp group</a></>}</div>)}</div>}
          </article>
        </section>
        <section className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #a78bfa' }}>
          <div style={{ color: '#a78bfa', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800 }}>Coach groups</div>
          <h3 style={{ margin: '0.45rem 0' }}>Form a mentorship team</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Create a focused group under one coach. Members can be invited after the team is formed.</p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <input aria-label="Mentorship team name" placeholder="Team name" value={teamName} onChange={(event) => setTeamName(event.target.value)} />
            <select aria-label="Mentorship coach" value={teamCoach} onChange={(event) => setTeamCoach(event.target.value)}>
              {coaches.map((coach) => <option key={coach.name}>{coach.name}</option>)}
            </select>
            <button className="btn-primary" onClick={createMentorshipTeam}>Create coach team</button>
          </div>
          {teams.length > 0 && <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.8rem' }}>{teams.map((team) => <div key={`${team.name}-${team.coach}`} style={{ padding: '0.7rem', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}><strong>{team.name}</strong><span style={{ color: 'var(--color-text-muted)' }}>{team.coach} · {team.members} members</span></div>)}</div>}
        </section>
        <section style={{ padding: '1rem 0 3rem' }}><div style={{ marginBottom: '1rem' }}><div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Mentorship trail</div><h2>From assessment to capability intelligence</h2></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>{['Assessment', 'Mentorship', 'Training', 'Certification', 'Simulation', 'Deployment', 'Performance Review', 'Higher Merit'].map((step, index) => <div key={step} style={{ padding: '0.8rem', background: index % 2 ? 'var(--color-surface)' : 'transparent', border: '1px solid var(--color-border)', color: index === 7 ? '#22c55e' : 'var(--color-text)' }}><span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>0{index + 1}</span><div style={{ marginTop: '0.5rem', fontWeight: 700 }}>{step}</div></div>)}</div></section>
      </main>
    </>
  )
}
