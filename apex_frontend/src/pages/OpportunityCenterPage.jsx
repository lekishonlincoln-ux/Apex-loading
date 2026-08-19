import Navbar from '../components/common/Navbar'
import OpportunityFeed from '../components/dashboard/OpportunityFeed'
import AvailabilityToggle from '../components/dashboard/AvailabilityToggle'

export default function OpportunityCenterPage() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2 style={{ marginBottom: '1rem' }}>Opportunity Center</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <AvailabilityToggle />
        </div>
        <OpportunityFeed />
      </div>
    </>
  )
}
