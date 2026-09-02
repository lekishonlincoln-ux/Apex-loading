import api from './axiosInstance'

const publicStatsPath = `${import.meta.env.BASE_URL}public-api/analytics.json`

export const getPublicPlatformStats = async () => {
	const response = await fetch(publicStatsPath, { headers: { Accept: 'application/json' } })
	if (!response.ok) throw new Error(`Public stats request failed: ${response.status}`)
	return { data: await response.json() }
}

export const getProfessionalAnalytics = () => api.get('/analytics/professional/me/')
