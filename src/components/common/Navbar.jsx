import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e3de]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Left: Logo + label */}
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img src="/pk-logo.webp" alt="PK Cabinets" className="h-7 md:h-9 w-auto" />
          <span className="text-[10px] md:text-xs font-body font-semibold uppercase tracking-widest text-muted hidden sm:inline">Contractor Portal</span>
        </Link>

        {/* Right */}
        <nav className="flex items-center gap-3 md:gap-5">
          <a href="https://www.pkcabinet.com/" target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted hover:text-text transition-colors">
            Back to PK Cabinets <ExternalLink size={12} />
          </a>

          {user ? (
            <Link to="/dashboard" className="btn-primary text-xs py-2 px-4 md:px-5">
              My Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login"
                className="text-xs font-semibold uppercase tracking-widest text-gold border border-gold px-3 md:px-5 py-2 rounded-sm hover:bg-gold hover:text-white transition-colors min-h-[44px] flex items-center">
                Log In
              </Link>
              <Link to="/apply" className="btn-primary text-xs py-2 px-3 md:px-5 min-h-[44px] flex items-center">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
