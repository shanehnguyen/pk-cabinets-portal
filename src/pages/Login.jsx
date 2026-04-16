import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/pro/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      login(email, password)
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-dot-pattern" style={{ backgroundColor: '#ffffff' }}>
      <Navbar />

      {/* Content — vertically centered */}
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="w-full mx-auto px-8" style={{ maxWidth: '480px' }}>
          <form className="bg-white rounded-sm p-12 shadow-md border border-placeholder" onSubmit={handleSubmit}>
            {/* Logo */}
            <div className="text-center mb-8">
              <img src="/pk-logo.webp" alt="PK Cabinets" className="h-12 w-auto mx-auto" />
            </div>

            <div className="mb-8 text-center">
              <h1 className="font-heading text-3xl font-normal mb-2">Contractor Login</h1>
              <p className="text-muted">Access your trade account and manage your projects.</p>
            </div>

            {/* Email Field */}
            <div className="mb-8">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-placeholder rounded-sm bg-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="mb-10">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-placeholder rounded-sm bg-white focus:outline-none focus:border-gold transition-colors"
              />
              <Link to="#" className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-amber-900 mt-4 inline-block transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary w-full text-center py-4">
              Log In
            </button>

            {/* Signup CTA */}
            <div className="text-center mt-8 pt-8 border-t border-placeholder">
              <p className="text-muted mb-4 text-sm">Don't have a trade account?</p>
              <Link
                to="/apply"
                className="inline-block px-7 py-3 border-2 border-gold text-gold font-body text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-gold hover:text-white transition-colors"
              >
                Apply for Trade Access
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
