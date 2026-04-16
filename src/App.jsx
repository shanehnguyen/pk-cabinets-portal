import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Pro from './pages/Pro'
import Login from './pages/Login'
import Apply from './pages/Apply'
import Dashboard from './pages/Dashboard'
import Overview from './pages/Dashboard/Overview'
import Orders from './pages/Dashboard/Orders'
import Calendar from './pages/Dashboard/Calendar'
import Projects from './pages/Dashboard/Projects'
import Resources from './pages/Dashboard/Resources'
import QuickQuote from './pages/Dashboard/QuickQuote'
import Catalog from './pages/Dashboard/Catalog'
import Help from './pages/Dashboard/Help'
import Account from './pages/Dashboard/Account'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Pro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apply" element={<Apply />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="projects" element={<Projects />} />
            <Route path="quick-quote" element={<QuickQuote />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="resources" element={<Resources />} />
            <Route path="help" element={<Help />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
