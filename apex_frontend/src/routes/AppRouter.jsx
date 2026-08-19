import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import VendorRoute from './VendorRoute'

import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import CohortsPage from '../pages/CohortsPage'
import RankingsPage from '../pages/RankingsPage'
import VendorPortalPage from '../pages/VendorPortalPage'
import OpportunityCenterPage from '../pages/OpportunityCenterPage'
import NotificationsPage from '../pages/NotificationsPage'
import ProfileSettingsPage from '../pages/ProfileSettingsPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import MentorsPage from '../pages/MentorsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/cohorts" element={<CohortsPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/opportunities" element={<OpportunityCenterPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfileSettingsPage />} />
        </Route>

        <Route element={<VendorRoute />}>
          <Route path="/vendor" element={<VendorPortalPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
