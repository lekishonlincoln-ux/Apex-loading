import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import CohortLeaderboard from '../components/cohorts/CohortLeaderboard'
import QuestionCard from '../components/cohorts/QuestionCard'
import AssessmentTimer from '../components/cohorts/AssessmentTimer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { getCohorts, enrollCohort, getAssessments, startAssessment, submitAssessment, sendHeartbeat } from '../api/cohortAPI'

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [activeAttempt, setActiveAttempt] = useState(null)
  const [activeAssessment, setActiveAssessment] = useState(null)
  const [answers, setAnswers] = useState({})
  const [view, setView] = useState('list')

  useEffect(() => {
    getCohorts().then(({ data }) => setCohorts(data.results || data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!activeAttempt) return
    const id = setInterval(() => {
      sendHeartbeat(activeAttempt.id, { tab_switch: false, time_anomaly: false }).catch(() => {})
    }, 30000)
    return () => clearInterval(id)
  }, [activeAttempt])

  const handleEnroll = async (cohortId) => {
    try {
      await enrollCohort(cohortId)
      toast.success('Enrolled!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Already enrolled or cohort full.')
    }
  }

  const handleSelectCohort = async (cohort) => {
    setSelectedCohort(cohort)
    const { data } = await getAssessments(cohort.id)
    setAssessments(data)
    setView('cohort')
  }

  const handleStartAssessment = async (assessment) => {
    try {
      const { data } = await startAssessment(assessment.id)
      setActiveAttempt(data)
      setActiveAssessment(assessment)
      setAnswers({})
      setView('assessment')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not start assessment.')
    }
  }

  const handleSubmit = async () => {
    try {
      const { data } = await submitAssessment(activeAssessment.id, answers)
      toast.success(`Score: ${data.score?.toFixed(1)}%`)
      setView('cohort')
      setActiveAttempt(null)
    } catch {
      toast.error('Submission failed.')
    }
  }

  if (loading) return <><Navbar /><LoadingSpinner /></>

  const demoAssessment = {
    title: 'Cohort Assessment',
    time_limit_minutes: 15,
    questions: [
      {
        id: 'q1',
        text: 'The API endpoint /user/123 is returning an error. What is the MOST likely cause?',
        points: 1,
        options: [
          { id: 'a', text: 'Database connection is failing.' },
          { id: 'b', text: 'The getUser function is not exported properly.' },
          { id: 'c', text: 'The route path is incorrect.' },
          { id: 'd', text: 'User ID is not being passed in the request.' },
        ],
      },
      {
        id: 'q2',
        text: 'Why is Option B the best solution?',
        points: 1,
        options: [
          { id: 'a', text: 'Because the function is not available outside the file.' },
          { id: 'b', text: 'Because it logs to console and improves debugging.' },
          { id: 'c', text: 'Because the database schema is not correct.' },
          { id: 'd', text: 'Because the request headers are missing authorization.' },
        ],
      },
    ],
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '1280px' }}>
        {view === 'list' && (
          <>
            <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1.2rem', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 700 }}>Assessment</div>
                  <h2 style={{ marginTop: '0.3rem', fontSize: '2rem', fontWeight: 800 }}>Open Cohorts</h2>
                </div>
                <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '999px', padding: '0.55rem 0.9rem', fontWeight: 700, color: '#e2e8f0' }}>Question 7 of 20</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {cohorts.map((c) => (
                <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(148,163,184,0.12)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{c.title}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{c.profession} · {c.participant_count}/{c.max_participants} enrolled</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEnroll(c.id)} className="btn-outline">Enroll</button>
                    <button onClick={() => handleSelectCohort(c)} className="btn-primary">View</button>
                  </div>
                </div>
              ))}
              {cohorts.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No open cohorts at the moment.</p>}
            </div>
          </>
        )}

        {view === 'cohort' && selectedCohort && (
          <>
            <button onClick={() => setView('list')} style={{ marginBottom: '1rem', background: 'none', color: '#a78bfa', padding: 0, fontWeight: 700 }}>← Back</button>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 800 }}>{selectedCohort.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Assessments</h3>
                {(assessments.length ? assessments : [demoAssessment]).map((a) => (
                  <div key={a.title} className="card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(148,163,184,0.12)' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{a.difficulty || 'Intermediate'} · {a.time_limit_minutes || 15}min · Pass: {a.passing_score || 75}%</div>
                    </div>
                    <button onClick={() => handleStartAssessment(a)} className="btn-primary">Start</button>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Leaderboard</h3>
                <CohortLeaderboard cohortId={selectedCohort.id} />
              </div>
            </div>
          </>
        )}

        {view === 'assessment' && activeAssessment && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a78bfa', fontWeight: 700 }}>Question 7 of 20</div>
                <h2 style={{ marginTop: '0.25rem', fontSize: '2rem', fontWeight: 800 }}>{activeAssessment.title}</h2>
              </div>
              <AssessmentTimer limitMinutes={activeAssessment.time_limit_minutes} onExpire={handleSubmit} />
            </div>

            <div style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '1rem', padding: '1.3rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Scenario video</div>
              <div style={{ height: '200px', borderRadius: '0.9rem', marginTop: '0.7rem', background: 'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(88,28,135,0.5)), repeating-linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 2px, transparent 2px, transparent 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(196,181,253,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>▶</div>
              </div>
            </div>

            {(activeAssessment.questions || demoAssessment.questions).map((q, index) => (
              <QuestionCard key={q.id || index} question={q} index={index} selected={answers[q.id || index]} onSelect={(qId, val) => setAnswers((prev) => ({ ...prev, [qId]: val }))} />
            ))}

            <button onClick={handleSubmit} className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Submit Assessment</button>
          </>
        )}
      </div>
    </>
  )
}
