import api from './axiosInstance'

export const getCohorts = () => api.get('/cohorts/')
export const getCohort = (id) => api.get(`/cohorts/${id}/`)
export const enrollCohort = (id) => api.post(`/cohorts/${id}/enroll/`)
export const getAssessments = (cohortId) => api.get(`/cohorts/${cohortId}/assessments/`)
export const startAssessment = (assessmentId) => api.post(`/cohorts/assessments/${assessmentId}/start/`)
export const submitAssessment = (assessmentId, answers) =>
  api.post(`/cohorts/assessments/${assessmentId}/submit/`, { answers })
export const getCohortLeaderboard = (cohortId) => api.get(`/cohorts/${cohortId}/leaderboard/`)
export const sendHeartbeat = (attemptId, data) =>
  api.post(`/cohorts/attempts/${attemptId}/heartbeat/`, data)
