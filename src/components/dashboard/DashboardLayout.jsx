import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, Bell, Package, Tag, Sparkles, CheckCircle, HelpCircle, MessageSquare, BookOpen, AlertTriangle, X, ExternalLink, LayoutDashboard, ShoppingCart, FolderOpen, FileText, LogOut, CalendarDays, LayoutGrid, Settings } from 'lucide-react'

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: Package, text: 'ORD-002 has shipped — Est. delivery Mar 22', time: '2 hours ago', read: false },
  { id: 2, icon: Tag, text: 'Your trade discount was upgraded to 25%', time: '1 day ago', read: false },
  { id: 3, icon: Sparkles, text: 'New cabinet collection available — Shaker Series', time: '2 days ago', read: true },
  { id: 4, icon: CheckCircle, text: 'ORD-001 was delivered successfully', time: '3 days ago', read: true },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    { label: 'Calendar', path: '/dashboard/calendar', icon: CalendarDays },
    { label: 'Projects', path: '/dashboard/projects', icon: FolderOpen },
    { label: 'Quick Quote', path: '/dashboard/quick-quote', icon: FileText },
    { label: 'Catalog', path: '/dashboard/catalog', icon: LayoutGrid },
    { label: 'Resources', path: '/dashboard/resources', icon: BookOpen },
    { label: 'Help', path: '/dashboard/help', icon: HelpCircle },
  ]

  const isActive = (path) => path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path)
  const handleLogout = () => { logout(); navigate('/login') }
  const handleSendMessage = () => { if (contactMessage.trim()) { setShowContactModal(false); setContactMessage(''); setShowSupport(false); setToast('Message sent to Michael Torres') } }

  const initials = (user?.contractorName || 'SN').split(' ').map(n => n[0]).join('').slice(0, 2)

  const SidebarContent = () => (
    <>
      <div className="h-[57px] flex items-center px-6 border-b border-[#e8e3de] shrink-0">
        <Link to="/" className="block" onClick={() => setSidebarOpen(false)}>
          <span className="font-heading text-xl font-normal tracking-wide text-text block leading-tight">PK Cabinet</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">Contractor Portal</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon; const active = isActive(item.path)
          return (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 min-h-[44px] ${active ? 'bg-gold text-white' : 'text-text hover:bg-gray-50'}`}>
              <Icon size={18} className="shrink-0" />
              <span className="text-sm font-semibold uppercase tracking-widest">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      {/* Mobile-only: Back to PK + Account + Logout */}
      <div className="md:hidden border-t border-[#e8e3de] px-3 py-3 space-y-1">
        <a href="https://www.pkcabinet.com/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-muted hover:text-text transition-colors min-h-[44px]">
          <ExternalLink size={18} /> Back to PK Cabinets
        </a>
        <button onClick={() => { setSidebarOpen(false); navigate('/dashboard/account') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-text hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]">
          <Settings size={18} /> Account Settings
        </button>
        <button onClick={() => { setSidebarOpen(false); handleLogout() }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[44px]">
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex ${desktopCollapsed ? 'w-[72px]' : 'w-64'} bg-white border-r border-[#e8e3de] transition-all duration-200 ease-in-out flex-col shrink-0`}>
        {desktopCollapsed ? (
          <>
            <div className="h-[57px] flex items-center justify-center border-b border-[#e8e3de] shrink-0">
              <Link to="/"><div className="w-8 h-8 bg-gold rounded flex items-center justify-center"><span className="font-heading text-xs font-bold text-white leading-none">PK</span></div></Link>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon; const active = isActive(item.path)
                return (
                  <Link key={item.path} to={item.path} title={item.label}
                    className={`flex justify-center py-2.5 rounded-lg transition-colors ${active ? 'bg-gold text-white' : 'text-text hover:bg-gray-50'}`}>
                    <Icon size={18} />
                  </Link>
                )
              })}
            </nav>
          </>
        ) : (
          <SidebarContent />
        )}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-xl animate-fade-in">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-muted hover:text-text z-10">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-[#e8e3de] h-[57px] px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => { if (window.innerWidth < 768) setSidebarOpen(true); else setDesktopCollapsed(!desktopCollapsed) }}
              className="text-muted hover:text-text transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center" title="Toggle sidebar">
              <Menu size={22} />
            </button>
            <span className="font-heading text-lg font-normal text-text md:hidden">PK Cabinet</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <a href="https://www.pkcabinet.com/" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted hover:text-text transition-colors">
              Back to PK Cabinets <ExternalLink size={12} />
            </a>
            <button onClick={() => setShowSupport(true)} className="hidden md:flex p-2 text-muted hover:text-text transition-colors min-w-[44px] min-h-[44px] items-center justify-center" title="Get Support">
              <HelpCircle size={22} />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfile(!showProfile)}
                className="w-9 h-9 rounded-full bg-text flex items-center justify-center hover:ring-2 hover:ring-gold transition-all" title={user?.contractorName}>
                <span className="text-xs font-heading font-bold text-gold">{initials}</span>
              </button>
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-placeholder rounded-sm shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-placeholder">
                    <p className="text-sm font-semibold text-text">{user?.contractorName}</p>
                    <p className="text-xs text-muted">{user?.email}</p>
                  </div>
                  <div className="px-4 py-2 border-b border-placeholder">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-sm">Gold 25%</span>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setShowProfile(false); navigate('/dashboard/account') }}
                      className="w-full px-4 py-2.5 text-left text-sm text-text hover:bg-gray-50 transition-colors flex items-center gap-3 min-h-[44px]">
                      <Settings size={16} className="text-muted" /> Account Settings
                    </button>
                    <button onClick={() => { setShowProfile(false); handleLogout() }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 min-h-[44px]">
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-muted hover:text-text transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Bell size={22} />
                {unreadCount > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="fixed md:absolute right-0 md:right-0 left-0 md:left-auto top-[57px] md:top-full md:mt-2 w-full md:w-96 bg-white border border-placeholder md:rounded-sm shadow-lg z-50">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-placeholder">
                    <h3 className="font-body text-sm font-semibold text-text">Notifications</h3>
                    {unreadCount > 0 && <button onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} className="text-xs font-semibold text-gold hover:underline">Mark all as read</button>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => {
                      const Icon = notif.icon
                      return (
                        <div key={notif.id} className={`flex items-start gap-3 px-5 py-4 border-b border-placeholder last:border-b-0 ${!notif.read ? 'bg-gold/5' : 'hover:bg-gray-50'}`}>
                          <div className={`shrink-0 mt-0.5 ${!notif.read ? 'text-gold' : 'text-muted'}`}><Icon size={16} /></div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!notif.read ? 'text-text font-semibold' : 'text-muted'}`}>{notif.text}</p>
                            <p className="text-xs text-muted mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-gold"></div>}
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
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-white">
          {children}
        </div>
      </main>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white md:rounded-sm p-6 md:p-8 w-full md:max-w-lg md:mx-4 border-t md:border border-placeholder rounded-t-lg md:rounded-t-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Get Support</h2>
              <button onClick={() => setShowSupport(false)} className="p-2 hover:bg-gray-50 rounded-sm min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={20} className="text-muted" /></button>
            </div>
            <div className="space-y-4">
              <button onClick={() => { setShowSupport(false); setShowContactModal(true) }} className="w-full p-4 md:p-6 bg-white border border-placeholder rounded-sm hover:border-gold hover:shadow-md transition-all text-left flex items-start gap-4 min-h-[44px]">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0"><MessageSquare size={20} className="text-gold" /></div>
                <div><h3 className="font-body font-bold text-text mb-1">Message Your Rep</h3><p className="text-sm text-muted">Send a direct message to Michael Torres.</p></div>
              </button>
              <button onClick={() => { setShowSupport(false); navigate('/dashboard/resources') }} className="w-full p-4 md:p-6 bg-white border border-placeholder rounded-sm hover:border-gold hover:shadow-md transition-all text-left flex items-start gap-4 min-h-[44px]">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0"><BookOpen size={20} className="text-gold" /></div>
                <div><h3 className="font-body font-bold text-text mb-1">Browse Resources</h3><p className="text-sm text-muted">Spec sheets, guides, and materials.</p></div>
              </button>
              <button onClick={() => { setShowSupport(false); navigate('/dashboard/orders') }} className="w-full p-4 md:p-6 bg-white border border-placeholder rounded-sm hover:border-gold hover:shadow-md transition-all text-left flex items-start gap-4 min-h-[44px]">
                <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center shrink-0"><AlertTriangle size={20} className="text-red-500" /></div>
                <div><h3 className="font-body font-bold text-text mb-1">Report an Order Issue</h3><p className="text-sm text-muted">Damaged, missing, or incorrect items.</p></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Rep Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white md:rounded-sm p-6 md:p-8 w-full md:max-w-lg md:mx-4 border-t md:border border-placeholder rounded-t-lg md:rounded-t-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Message Your Rep</h2>
              <button onClick={() => { setShowContactModal(false); setContactMessage('') }} className="p-2 hover:bg-gray-50 rounded-sm min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={20} className="text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">To</label><div className="px-4 py-3 bg-white rounded-sm border border-placeholder text-text font-semibold text-sm">Michael Torres — michael.torres@pkcabinets.com</div></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Subject</label><input type="text" value={`Message from ${user?.contractorName || 'Shane Nguyen'}`} readOnly className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm bg-white text-text text-sm" /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Message</label><textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none" rows="5" placeholder="Type your message..."></textarea></div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => { setShowContactModal(false); setContactMessage('') }} className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors min-h-[44px]">Cancel</button>
                <button onClick={handleSendMessage} disabled={!contactMessage.trim()} className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 bg-text text-white px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle size={16} className="text-green-400 shrink-0" />
          <span className="font-body text-sm">{toast}</span>
        </div>
      )}
    </div>
  )
}
