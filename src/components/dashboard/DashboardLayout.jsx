import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, Bell, Package, Tag, Sparkles, CheckCircle, HelpCircle, MessageSquare, BookOpen, AlertTriangle, X, ExternalLink, LayoutDashboard, ShoppingCart, FolderOpen, FileText, User, LogOut, CalendarDays, LayoutGrid } from 'lucide-react'

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: Package, text: 'ORD-002 has shipped — Est. delivery Mar 22', time: '2 hours ago', read: false },
  { id: 2, icon: Tag, text: 'Your trade discount was upgraded to 25%', time: '1 day ago', read: false },
  { id: 3, icon: Sparkles, text: 'New cabinet collection available — Shaker Series', time: '2 days ago', read: true },
  { id: 4, icon: CheckCircle, text: 'ORD-001 was delivered successfully', time: '3 days ago', read: true },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [toast, setToast] = useState(null)
  const notifRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    { label: 'Calendar', path: '/dashboard/calendar', icon: CalendarDays },
    { label: 'Projects', path: '/dashboard/projects', icon: FolderOpen },
    { label: 'Quick Quote', path: '/dashboard/quick-quote', icon: FileText },
    { label: 'Catalog', path: '/dashboard/catalog', icon: LayoutGrid },
    { label: 'Resources', path: '/dashboard/resources', icon: BookOpen },
    { label: 'Help', path: '/dashboard/help', icon: HelpCircle },
    { label: 'Account', path: '/dashboard/account', icon: User },
  ]

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSendMessage = () => {
    if (contactMessage.trim()) {
      setShowContactModal(false)
      setContactMessage('')
      setShowSupport(false)
      setToast('Message sent to Michael Torres')
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-[72px]'} bg-white border-r border-[#e8e3de] transition-all duration-200 ease-in-out flex flex-col shrink-0`}>
        {/* Sidebar Header — matches top navbar height */}
        <div className="h-[57px] flex items-center border-b border-[#e8e3de] shrink-0" style={{ padding: sidebarOpen ? '0 24px' : '0' }}>
          {sidebarOpen ? (
            <Link to="/" className="block">
              <span className="font-heading text-xl font-normal tracking-wide text-text block leading-tight">PK Cabinet</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">Contractor Portal</span>
            </Link>
          ) : (
            <Link to="/" className="w-full flex justify-center">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                <span className="font-heading text-xs font-bold text-white leading-none">PK</span>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link key={item.path} to={item.path} title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  sidebarOpen ? 'px-3 py-2.5' : 'justify-center py-2.5'
                } ${active ? 'bg-gold text-white' : 'text-text hover:bg-gray-50'}`}>
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-semibold uppercase tracking-widest whitespace-nowrap overflow-hidden transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Trade Tier */}
        <div className="border-t border-[#e8e3de] px-3 py-3">
          {sidebarOpen ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">Trade Tier</span>
                <span className="text-xs font-semibold text-gold">Gold 25%</span>
              </div>
              <div className="w-full h-1.5 bg-placeholder rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gold rounded-full" style={{ width: '62%' }}></div>
              </div>
              <p className="text-xs text-muted">$15,500 to <span className="font-semibold text-text">Platinum</span></p>
            </>
          ) : (
            <div className="flex justify-center" title="Gold 25%">
              <div className="w-2.5 h-2.5 bg-gold rounded-full"></div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="border-t border-[#e8e3de] px-3 py-3">
          <button onClick={handleLogout} title={!sidebarOpen ? 'Log Out' : undefined}
            className={`w-full flex items-center gap-3 rounded-lg py-2.5 text-text hover:bg-red-50 hover:text-red-600 transition-colors ${
              sidebarOpen ? 'px-3' : 'justify-center'
            }`}>
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-semibold uppercase tracking-widest">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header with Toggle */}
        <div className="bg-white border-b border-[#e8e3de] h-[57px] px-8 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted hover:text-text transition-colors"
            title="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-4">
            <a href="https://www.pkcabinet.com/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted hover:text-text transition-colors">
              Back to PK Cabinets <ExternalLink size={12} />
            </a>

            {/* Support Button */}
            <button
              onClick={() => setShowSupport(true)}
              className="p-2 text-muted hover:text-text transition-colors"
              title="Get Support"
            >
              <HelpCircle size={22} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-muted hover:text-text transition-colors"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-placeholder rounded-sm shadow-lg z-50">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-placeholder">
                    <h3 className="font-body text-sm font-semibold text-text">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="text-xs font-semibold text-gold hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => {
                      const Icon = notif.icon
                      return (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-3 px-5 py-4 border-b border-placeholder last:border-b-0 transition-colors ${
                            !notif.read ? 'bg-gold/5' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`shrink-0 mt-0.5 ${!notif.read ? 'text-gold' : 'text-muted'}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!notif.read ? 'text-text font-semibold' : 'text-muted'}`}>
                              {notif.text}
                            </p>
                            <p className="text-xs text-muted mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-gold"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-white">
          {children}
        </div>
      </main>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-lg w-full mx-4 border border-placeholder">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Get Support</h2>
              <button onClick={() => setShowSupport(false)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors">
                <X size={20} className="text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => { setShowSupport(false); setShowContactModal(true) }}
                className="w-full p-6 bg-white border border-placeholder rounded-sm hover:border-gold hover:shadow-md transition-all text-left flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <MessageSquare size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-body font-bold text-text mb-1">Message Your Rep</h3>
                  <p className="text-sm text-muted">Send a direct message to Michael Torres, your dedicated representative.</p>
                </div>
              </button>

              <button
                onClick={() => { setShowSupport(false); navigate('/dashboard/resources') }}
                className="w-full p-6 bg-white border border-placeholder rounded-sm hover:border-gold hover:shadow-md transition-all text-left flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-body font-bold text-text mb-1">Browse Resources</h3>
                  <p className="text-sm text-muted">Access spec sheets, installation guides, and marketing materials.</p>
                </div>
              </button>

              <button
                onClick={() => { setShowSupport(false); navigate('/dashboard/orders') }}
                className="w-full p-6 bg-white border border-placeholder rounded-sm hover:border-gold hover:shadow-md transition-all text-left flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-body font-bold text-text mb-1">Report an Order Issue</h3>
                  <p className="text-sm text-muted">Report damaged, missing, or incorrect items from a recent order.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Rep Modal (from support) */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-lg w-full mx-4 border border-placeholder">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Message Your Rep</h2>
              <button
                onClick={() => { setShowContactModal(false); setContactMessage('') }}
                className="p-1 hover:bg-gray-50 rounded-sm transition-colors"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">To</label>
                <div className="px-4 py-3 bg-white rounded-sm border border-placeholder text-text font-semibold text-sm">
                  Michael Torres — michael.torres@pkcabinets.com
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Subject</label>
                <input
                  type="text"
                  value={`Message from ${user?.contractorName || 'Shane Nguyen'}`}
                  readOnly
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm bg-white text-text text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none"
                  rows="5"
                  placeholder="Type your message..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowContactModal(false); setContactMessage('') }}
                  className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!contactMessage.trim()}
                  className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle size={16} className="text-green-400" />
          <span className="font-body text-sm">{toast}</span>
        </div>
      )}
    </div>
  )
}
