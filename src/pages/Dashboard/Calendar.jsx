import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Truck, Wrench, FileText, Clock, X, Package, ExternalLink, Check } from 'lucide-react'

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-fade-in">
      <Check size={16} className="text-green-400" /><span className="font-body text-sm">{message}</span>
    </div>
  )
}

const EVENT_TYPES = {
  delivery: { label: 'Delivery', color: 'bg-blue-500', pill: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', icon: Truck },
  installation: { label: 'Installation', color: 'bg-green-500', pill: 'bg-green-100 text-green-800', dot: 'bg-green-500', icon: Wrench },
  invoice: { label: 'Invoice Due', color: 'bg-red-500', pill: 'bg-red-100 text-red-800', dot: 'bg-red-500', icon: FileText },
  quote: { label: 'Quote Expiry', color: 'bg-amber-500', pill: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', icon: Clock },
}

// Generate mock events relative to current date
const generateEvents = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = (offset) => {
    const dt = new Date(y, m, now.getDate() + offset)
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  }
  return [
    { id: 1, type: 'delivery', title: 'ORD-001 Kitchen Cabinets Set arriving', date: d(2), linkType: 'order', linkId: 'ORD-001' },
    { id: 2, type: 'delivery', title: 'ORD-002 Island Cabinet arriving', date: d(5), linkType: 'order', linkId: 'ORD-002' },
    { id: 3, type: 'installation', title: 'Modern Kitchen Remodel install day', date: d(8), linkType: 'project', linkId: 'Modern Kitchen Remodel' },
    { id: 4, type: 'installation', title: 'Bathroom Vanity Refresh install day', date: d(12), linkType: 'project', linkId: 'Bathroom Vanity Refresh' },
    { id: 5, type: 'invoice', title: 'INV-002 $2,200.00 due', date: d(4), linkType: 'invoice', linkId: 'INV-002' },
    { id: 6, type: 'installation', title: 'Full Home Kitchen + Dining install', date: d(20), linkType: 'project', linkId: 'Full Home Kitchen + Dining' },
    { id: 7, type: 'delivery', title: 'ORD-006 Cabinet Hardware arriving', date: d(15), linkType: 'order', linkId: 'ORD-006' },
    { id: 8, type: 'quote', title: 'Quote #Q-001 expires', date: d(6), linkType: 'quote', linkId: 'Q-001' },
  ]
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const fmtDate = (str) => { const d = new Date(str + 'T00:00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

export default function Calendar() {
  const [events] = useState(generateEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month')
  const [popover, setPopover] = useState(null)
  const [toast, setToast] = useState(null)

  const today = new Date()
  const todayKey = toKey(today)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())
  const prevWeek = () => setCurrentDate(new Date(year, month, currentDate.getDate() - 7))
  const nextWeek = () => setCurrentDate(new Date(year, month, currentDate.getDate() + 7))

  // Build event map by date
  const eventMap = useMemo(() => {
    const map = {}
    events.forEach(e => { if (!map[e.date]) map[e.date] = []; map[e.date].push(e) })
    return map
  }, [events])

  // Month grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false, date: new Date(year, month - 1, prevDays - i) })
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, current: true, date: new Date(year, month, i) })
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, current: false, date: new Date(year, month + 1, i) })

  // Week grid
  const weekStart = new Date(currentDate)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d })

  // List view — next 30 days
  const listEvents = useMemo(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return events.filter(e => new Date(e.date + 'T00:00:00') >= t).sort((a, b) => a.date.localeCompare(b.date))
  }, [events])

  // Stats
  const thisMonthEvents = events.filter(e => { const d = new Date(e.date + 'T00:00:00'); return d.getMonth() === month && d.getFullYear() === year })
  const deliveriesCount = thisMonthEvents.filter(e => e.type === 'delivery').length
  const installsCount = thisMonthEvents.filter(e => e.type === 'installation').length
  const overdueCount = thisMonthEvents.filter(e => e.type === 'invoice').length

  // Upcoming 7 days
  const upcoming = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0)
    const end = new Date(start); end.setDate(end.getDate() + 7)
    return events.filter(e => { const d = new Date(e.date + 'T00:00:00'); return d >= start && d < end }).sort((a, b) => a.date.localeCompare(b.date))
  }, [events])

  const handleAction = (evt) => {
    setPopover(null)
    if (evt.type === 'delivery') setToast(`Tracking ${evt.linkId}...`)
    else if (evt.type === 'installation') setToast(`Viewing project: ${evt.linkId}`)
    else if (evt.type === 'invoice') setToast('Redirecting to payment...')
    else setToast(`Viewing quote ${evt.linkId}`)
  }

  const actionLabel = (type) => {
    switch (type) {
      case 'delivery': return 'Track Shipment'
      case 'installation': return 'View Project'
      case 'invoice': return 'Pay Now'
      case 'quote': return 'View Quote'
      default: return 'View'
    }
  }

  const EventPill = ({ evt, compact }) => {
    const cfg = EVENT_TYPES[evt.type]
    return (
      <button onClick={(e) => { e.stopPropagation(); setPopover(popover?.id === evt.id ? null : evt) }}
        className={`block w-full text-left px-1.5 py-0.5 rounded text-[11px] font-semibold truncate mb-0.5 ${cfg.pill} hover:opacity-80 transition-opacity`}>
        {compact ? evt.title.split(' ').slice(0, 2).join(' ') : evt.title}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-4xl font-normal mb-2">Delivery Calendar</h1>
        <p className="text-lg text-muted">Track deliveries, installations, and deadlines.</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-sm p-5 border border-placeholder">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Deliveries This Month</p>
          <p className="font-heading text-2xl">{deliveriesCount}</p>
        </div>
        <div className="bg-white rounded-sm p-5 border border-placeholder">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Installs This Month</p>
          <p className="font-heading text-2xl">{installsCount}</p>
        </div>
        <div className="bg-white rounded-sm p-5 border border-placeholder">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Invoices Due</p>
          <p className={`font-heading text-2xl ${overdueCount > 0 ? 'text-red-600' : ''}`}>{overdueCount}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Calendar */}
        <div className="flex-1 bg-white rounded-sm border border-placeholder overflow-hidden">
          {/* Calendar Header */}
          <div className="px-6 py-4 border-b border-placeholder flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={view === 'week' ? prevWeek : prevMonth} className="p-1.5 hover:bg-gray-50 rounded-sm transition-colors"><ChevronLeft size={18} className="text-muted" /></button>
              <h2 className="font-heading text-xl font-normal min-w-[200px] text-center">
                {view === 'week'
                  ? `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : `${MONTHS[month]} ${year}`
                }
              </h2>
              <button onClick={view === 'week' ? nextWeek : nextMonth} className="p-1.5 hover:bg-gray-50 rounded-sm transition-colors"><ChevronRight size={18} className="text-muted" /></button>
              <button onClick={goToday} className="ml-2 px-3 py-1 text-xs font-semibold uppercase tracking-widest border border-placeholder rounded-sm text-muted hover:border-gold hover:text-gold transition-colors">Today</button>
            </div>
            <div className="flex border border-placeholder rounded-sm overflow-hidden">
              {['month', 'week', 'list'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${view === v ? 'bg-gold text-white' : 'text-text hover:bg-gray-50'}`}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Month View */}
          {view === 'month' && (
            <div>
              <div className="grid grid-cols-7 border-b border-placeholder">
                {DAYS.map(d => (
                  <div key={d} className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-widest text-muted">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((cell, idx) => {
                  const key = toKey(cell.date)
                  const isToday = key === todayKey
                  const dayEvents = eventMap[key] || []
                  return (
                    <div key={idx} className={`min-h-[100px] p-1.5 border-b border-r border-placeholder ${!cell.current ? 'bg-gray-50/50' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`w-7 h-7 flex items-center justify-center text-sm ${
                          isToday ? 'bg-gold text-white rounded-full font-bold' : cell.current ? 'text-text' : 'text-muted'
                        }`}>{cell.day}</span>
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map(evt => <EventPill key={evt.id} evt={evt} compact />)}
                        {dayEvents.length > 3 && <span className="text-[10px] text-muted font-semibold">+{dayEvents.length - 3} more</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {view === 'week' && (
            <div>
              <div className="grid grid-cols-7 border-b border-placeholder">
                {weekDays.map((d, i) => {
                  const isToday = toKey(d) === todayKey
                  return (
                    <div key={i} className="px-2 py-3 text-center border-r border-placeholder last:border-r-0">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted block">{DAYS[d.getDay()]}</span>
                      <span className={`text-lg font-heading ${isToday ? 'text-gold font-bold' : 'text-text'}`}>{d.getDate()}</span>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-7 min-h-[400px]">
                {weekDays.map((d, i) => {
                  const key = toKey(d)
                  const dayEvents = eventMap[key] || []
                  return (
                    <div key={i} className="p-2 border-r border-placeholder last:border-r-0">
                      {dayEvents.map(evt => {
                        const cfg = EVENT_TYPES[evt.type]
                        const Icon = cfg.icon
                        return (
                          <button key={evt.id} onClick={() => setPopover(popover?.id === evt.id ? null : evt)}
                            className={`w-full text-left p-2 rounded mb-1 ${cfg.pill} hover:opacity-80 transition-opacity`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon size={12} />
                              <span className="text-[10px] font-bold uppercase">{cfg.label}</span>
                            </div>
                            <p className="text-xs font-semibold truncate">{evt.title}</p>
                            {evt.linkId && <p className="text-[10px] text-gold truncate mt-0.5">{evt.linkId}</p>}
                          </button>
                        )
                      })}
                      {dayEvents.length === 0 && <div className="h-full"></div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* List View */}
          {view === 'list' && (
            <div className="divide-y divide-placeholder">
              {listEvents.length === 0 ? (
                <div className="p-12 text-center">
                  <CalendarDays size={40} className="text-placeholder mx-auto mb-3" />
                  <p className="text-muted">No upcoming events</p>
                </div>
              ) : (
                (() => {
                  const grouped = {}
                  listEvents.forEach(e => { const d = fmtDate(e.date); if (!grouped[d]) grouped[d] = []; grouped[d].push(e) })
                  return Object.entries(grouped).map(([date, evts]) => (
                    <div key={date}>
                      <div className="px-6 py-2 bg-gray-50">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted">{date}</span>
                      </div>
                      {evts.map(evt => {
                        const cfg = EVENT_TYPES[evt.type]
                        const Icon = cfg.icon
                        return (
                          <div key={evt.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`}></div>
                            <Icon size={16} className="text-muted shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-text truncate">{evt.title}</p>
                              {evt.linkId && <span className="text-xs text-gold">{evt.linkId}</span>}
                            </div>
                            <button onClick={() => handleAction(evt)}
                              className="text-xs font-semibold uppercase tracking-widest text-gold hover:underline shrink-0">{actionLabel(evt.type)}</button>
                          </div>
                        )
                      })}
                    </div>
                  ))
                })()
              )}
            </div>
          )}
        </div>

        {/* Sidebar — Upcoming */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-sm border border-placeholder p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-normal">Upcoming</h3>
              <span className="text-xs font-bold text-white bg-gold rounded-full w-5 h-5 flex items-center justify-center">{upcoming.length}</span>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted">No events in the next 7 days.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(evt => {
                  const cfg = EVENT_TYPES[evt.type]
                  return (
                    <button key={evt.id} onClick={() => setPopover(popover?.id === evt.id ? null : evt)}
                      className="w-full text-left flex items-start gap-2.5 py-2 hover:bg-gray-50 rounded-sm px-1 transition-colors">
                      <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${cfg.dot}`}></div>
                      <div className="min-w-0">
                        <p className="text-sm text-text font-semibold truncate">{evt.title}</p>
                        <p className="text-xs text-muted">{fmtDate(evt.date)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Popover */}
      {popover && (
        <div className="fixed inset-0 z-40" onClick={() => setPopover(null)}>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-sm border border-placeholder shadow-lg p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${EVENT_TYPES[popover.type].pill}`}>
                {(() => { const Icon = EVENT_TYPES[popover.type].icon; return <Icon size={12} /> })()}
                {EVENT_TYPES[popover.type].label}
              </span>
              <button onClick={() => setPopover(null)} className="p-1 hover:bg-gray-50 rounded-sm"><X size={16} className="text-muted" /></button>
            </div>
            <h3 className="font-body font-bold text-text mb-2">{popover.title}</h3>
            <p className="text-sm text-muted mb-3">{fmtDate(popover.date)}</p>
            {popover.linkId && (
              <p className="text-sm mb-4">
                <span className="text-muted">Linked: </span>
                <span className="text-gold font-semibold cursor-pointer hover:underline">{popover.linkId}</span>
              </p>
            )}
            <button onClick={() => handleAction(popover)}
              className="btn-primary w-full text-center py-2 text-xs">{actionLabel(popover.type)}</button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
