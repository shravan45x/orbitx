import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import MobileHeader from '../components/layout/MobileHeader'
import PageTransition from '../components/effects/PageTransition'
import Home from '../pages/home/Home'
import About from '../pages/about/About'
import Events from '../pages/events/Events'
import Members from '../pages/members/Members'
import Recruitment from '../pages/recruitment/Recruitment'
import Contact from '../pages/contact/Contact'
import Merch from '../pages/merch/Merch'
import Blog from '../pages/blog/Blog'
import Login from '../pages/auth/Login'
import Onboarding from '../pages/auth/Onboarding'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Dashboard from '../pages/dashboard/Dashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageMembers from '../pages/manage-members/ManageMembers'
import AdminSetup from '../components/admin/AdminSetup'
import ApplicationsManager from '../components/admin/ApplicationsManager'
import ManageQueries from '../components/admin/ManageQueries'
import MerchOrdersManager from '../components/admin/MerchOrdersManager'
import MerchManager from '../components/admin/MerchManager'

import { ToastProvider } from '../components/toast/Toast'
import { AuthProvider } from '../contexts/AuthContext'
import { SnowfallProvider } from '../contexts/SnowfallContext'
import { RecruitmentProvider } from '../contexts/RecruitmentContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ProtectedRoute, PublicRoute, AdminRoute } from '../components/auth'
import ScrollToTop from '../components/navigation/ScrollToTop'

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="/members" element={<PageTransition><Members /></PageTransition>} />
        <Route path="/recruitment" element={<PageTransition><Recruitment /></PageTransition>} />
        <Route path="/join" element={<PageTransition><Recruitment /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/merch" element={<PageTransition><Merch /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blogs" element={<PageTransition><Blog /></PageTransition>} />

        {/* Auth Routes - Redirect to dashboard if already logged in */}
        <Route path="/login" element={
          <PublicRoute>
            <PageTransition><Login /></PageTransition>
          </PublicRoute>
        } />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />

        {/* Admin Setup - URL only access (no frontend link) */}
        <Route path="/admin-setup" element={<PageTransition><AdminSetup /></PageTransition>} />

        {/* Protected Routes - Require authentication */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <PageTransition><AdminDashboard /></PageTransition>
          </AdminRoute>
        } />
        <Route path="/manage-user-applications" element={
          <AdminRoute>
            <PageTransition><ApplicationsManager /></PageTransition>
          </AdminRoute>
        } />
        <Route path="/manage-user-queries" element={
          <AdminRoute>
            <PageTransition><ManageQueries /></PageTransition>
          </AdminRoute>
        } />
        <Route path="/manage-merch-orders" element={
          <AdminRoute>
            <PageTransition><MerchOrdersManager /></PageTransition>
          </AdminRoute>
        } />
        <Route path="/manage-merch" element={
          <AdminRoute>
            <PageTransition><MerchManager /></PageTransition>
          </AdminRoute>
        } />
        <Route path="/manage-members" element={
          <AdminRoute requireSuperAdmin>
            <PageTransition><ManageMembers /></PageTransition>
          </AdminRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function NavigationLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <MobileHeader />
      <AnimatedRoutes />
    </>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <NavigationLayout />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SnowfallProvider>
          <RecruitmentProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </RecruitmentProvider>
        </SnowfallProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
