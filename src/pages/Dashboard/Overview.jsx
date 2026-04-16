import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Package, DollarSign, Gift, Phone, Mail, Check, X, CreditCard, AlertTriangle, Plus, Trash2, Circle, Repeat2, FileText, FolderPlus, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-fade-in">
      <Check size={16} className="text-green-400" />
      <span className="font-body text-sm">{message}</span>
    </div>
  )
}

const spendData = [
  { month: 'Oct', amount: 4200 },
  { month: 'Nov', amount: 6800 },
  { month: 'Dec', amount: 3100 },
  { month: 'Jan', amount: 7500 },
  { month: 'Feb', amount: 8900 },
  { month: 'Mar', amount: 9150 },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-text text-white px-3 py-2 rounded-sm text-sm font-semibold">
        ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
    )
  }
  return null
}

const STORAGE_KEY = 'pk-dashboard-todos'
const DEFAULT_TODOS = [
  { id: 1, text: 'Confirm ORD-002 delivery address', tag: 'Order', done: false },
  { id: 2, text: 'Upload photos for Modern Kitchen Remodel', tag: 'Project', done: false },
  { id: 3, text: 'Follow up on overdue invoice INV-003', tag: 'Urgent', done: false },
]

const deliveries = [
  { id: 'ORD-002', items: 'Island Cabinet + Hardware', date: 'Apr 15, 2026', isToday: true },
  { id: 'ORD-006', items: 'Cabinet Hardware & Hinges', date: 'Apr 18, 2026', isToday: false },
]

const activeProjects = [
  { name: 'Modern Kitchen Remodel', orderCount: 1, lastOrder: 'Mar 15, 2026' },
  { name: 'Full Home Kitchen + Dining', orderCount: 1, lastOrder: 'Mar 8, 2026' },
  { name: 'Commercial Kitchen Renovation', orderCount: 1, lastOrder: 'Mar 18, 2026' },
]

export default function Overview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [alertDismissed, setAlertDismissed] = useState(false)

  // Todos with localStorage
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_TODOS
    } catch { return DEFAULT_TODOS }
  })
  const [newTodo, setNewTodo] = useState('')
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), tag: newTag || null, done: false }])
    setNewTodo('')
    setNewTag('')
  }

  const toggleTodo = (id) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTodo = (id) => setTodos(todos.filter(t => t.id !== id))

  const tagColors = { Order: 'bg-blue-100 text-blue-800', Project: 'bg-gold/20 text-gold', Urgent: 'bg-red-100 text-red-800' }

  const creditUsed = 21050
  const creditLimit = 50000

  const dedicatedRep = { name: 'Michael Torres', phone: '(555) 987-6543', email: 'michael.torres@pkcabinets.com' }

  const recentOrders = [
    { id: 'ORD-001', date: 'Mar 15, 2026', total: '$4,500', status: 'Delivered' },
    { id: 'ORD-002', date: 'Mar 8, 2026', total: '$2,200', status: 'Shipped' },
    { id: 'ORD-003', date: 'Feb 28, 2026', total: '$1,800', status: 'Delivered' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600'
      case 'Shipped': return 'text-[#6b6258]'
      case 'Processing': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const handleSendMessage = () => {
    if (contactMessage.trim()) {
      setShowContactModal(false)
      setContactMessage('')
      setToast('Message sent to Michael Torres')
    }
  }

  // YTD financials
  const ytdSpent = spendData.reduce((s, d) => s + d.amount, 0)
  const ytdLastYear = 32400
  const spendDelta = ytdSpent - ytdLastYear
  const spendDeltaPct = Math.round((spendDelta / ytdLastYear) * 100)
  const ytdSavings = Math.round(ytdSpent * 0.25)
  const ytdSavingsLastYear = Math.round(ytdLastYear * 0.22)
  const savingsDelta = ytdSavings - ytdSavingsLastYear

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-4xl font-normal mb-2">Welcome back, {user?.contractorName}!</h1>
        <p className="text-lg text-muted">Here's what's happening with your trade account.</p>
      </div>

      {/* Alert Bar — invoice due within 7 days */}
      {!alertDismissed && (
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50 border border-amber-200 rounded-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Invoice INV-002</span> for $2,200.00 is due <span className="font-semibold">Apr 8, 2026</span>.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setToast('Redirecting to payment...')} className="text-xs font-semibold text-gold hover:underline uppercase tracking-widest">Pay Now</button>
            <button onClick={() => setAlertDismissed(true)} className="p-1 hover:bg-amber-100 rounded-sm transition-colors"><X size={16} className="text-amber-600" /></button>
          </div>
        </div>
      )}

      {/* Stat Cards — 4 columns */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-sm p-6 border border-placeholder">
          <div className="text-2xl text-gold mb-4"><Package size={32} /></div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Total Orders</p>
          <p className="font-heading text-3xl font-normal">12</p>
        </div>
        <div className="bg-white rounded-sm p-6 border border-placeholder">
          <div className="text-2xl text-gold mb-4"><DollarSign size={32} /></div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Total Spent</p>
          <p className="font-heading text-3xl font-normal">$34,500</p>
        </div>
        <div className="bg-white rounded-sm p-6 border border-placeholder">
          <div className="text-2xl text-gold mb-4"><Gift size={32} /></div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Amount Saved</p>
          <p className="font-heading text-3xl font-normal">$8,625</p>
        </div>
        <div className="bg-white rounded-sm p-6 border border-placeholder">
          <div className="text-2xl text-gold mb-4"><CreditCard size={32} /></div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Available Credit</p>
          <p className="font-heading text-3xl font-normal">${(creditLimit - creditUsed).toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">${creditUsed.toLocaleString()} of ${creditLimit.toLocaleString()} used</p>
          <div className="w-full h-1.5 bg-placeholder rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gold rounded-full" style={{ width: `${(creditUsed / creditLimit) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Row: Rep + Recent Orders */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-heading text-2xl font-normal mb-6">Your Dedicated Rep</h2>
          <div className="bg-white rounded-sm p-8 border border-placeholder">
            <div className="w-16 h-16 bg-placeholder rounded-full mb-6"></div>
            <h3 className="font-body font-bold text-lg mb-6">{dedicatedRep.name}</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gold" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">Phone</p>
                  <p className="text-text">{dedicatedRep.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gold" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">Email</p>
                  <p className="text-text">{dedicatedRep.email}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowContactModal(true)} className="btn-primary w-full text-center py-3">Contact Rep</button>
          </div>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-normal mb-6">Recent Orders</h2>
          <div className="bg-white rounded-sm border border-placeholder overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-placeholder">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-placeholder hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-body font-semibold text-text">{order.id}</td>
                    <td className="px-4 py-3 text-text">{order.date}</td>
                    <td className="px-4 py-3 font-body font-semibold text-text">{order.total}</td>
                    <td className={`px-4 py-3 font-semibold text-xs ${getStatusColor(order.status)}`}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row: Todo List + Deliveries This Week */}
      <div className="grid grid-cols-2 gap-6">
        {/* Todo List */}
        <div className="bg-white rounded-sm border border-placeholder p-6">
          <h2 className="font-heading text-2xl font-normal mb-4">To-Do</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a task..." className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
            <select value={newTag} onChange={(e) => setNewTag(e.target.value)}
              className="px-2 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors text-xs appearance-none">
              <option value="">No tag</option>
              <option value="Order">Order</option>
              <option value="Project">Project</option>
              <option value="Urgent">Urgent</option>
            </select>
            <button onClick={addTodo} className="p-2 bg-gold text-white rounded-sm hover:bg-opacity-90 transition-colors"><Plus size={16} /></button>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-3 py-2 px-2 rounded-sm hover:bg-gray-50 group transition-colors">
                <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} className="w-4 h-4 accent-gold cursor-pointer shrink-0" />
                <span className={`flex-1 text-sm ${todo.done ? 'line-through text-muted' : 'text-text'}`}>{todo.text}</span>
                {todo.tag && <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold shrink-0 ${tagColors[todo.tag]}`}>{todo.tag}</span>}
                <button onClick={() => deleteTodo(todo.id)} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-sm transition-all"><Trash2 size={12} className="text-red-500" /></button>
              </div>
            ))}
            {todos.length === 0 && <p className="text-sm text-muted py-4 text-center">No tasks yet.</p>}
          </div>
        </div>

        {/* Deliveries This Week */}
        <div className="bg-white rounded-sm border border-placeholder p-6">
          <h2 className="font-heading text-2xl font-normal mb-4">Deliveries This Week</h2>
          <div className="space-y-3">
            {deliveries.map((d, idx) => (
              <div key={idx} className="flex items-center gap-3 py-3 border-b border-placeholder last:border-b-0">
                <div className={`w-3 h-3 rounded-full shrink-0 ${d.isToday ? 'bg-green-500' : 'bg-gold'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text">{d.id} — {d.items}</p>
                  <p className="text-xs text-muted">{d.date}</p>
                </div>
                {d.isToday && <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm">Today</span>}
              </div>
            ))}
            {/* Processing order */}
            <div className="flex items-center gap-3 py-3">
              <div className="w-3 h-3 rounded-full shrink-0 bg-gray-300"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">ORD-006 — Cabinet Hardware & Hinges</p>
                <p className="text-xs text-muted">Processing — delivery TBD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Active Projects + Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="bg-white rounded-sm border border-placeholder p-6">
          <h2 className="font-heading text-2xl font-normal mb-4">Active Projects</h2>
          <div className="space-y-3">
            {activeProjects.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-placeholder last:border-b-0">
                <div>
                  <button onClick={() => navigate('/dashboard/orders')} className="text-sm font-semibold text-gold hover:underline">{p.name}</button>
                  <p className="text-xs text-muted">{p.orderCount} order{p.orderCount > 1 ? 's' : ''} — Last: {p.lastOrder}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-sm border border-placeholder p-6">
          <h2 className="font-heading text-2xl font-normal mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setToast('Reordering last purchase...')}
              className="flex items-center gap-3 p-4 border border-placeholder rounded-sm hover:border-gold hover:shadow-sm transition-all text-left">
              <Repeat2 size={20} className="text-gold shrink-0" />
              <span className="text-sm font-semibold text-text">Reorder Last Purchase</span>
            </button>
            <button onClick={() => navigate('/dashboard/quick-quote')}
              className="flex items-center gap-3 p-4 border border-placeholder rounded-sm hover:border-gold hover:shadow-sm transition-all text-left">
              <FileText size={20} className="text-gold shrink-0" />
              <span className="text-sm font-semibold text-text">Request a Quote</span>
            </button>
            <button onClick={() => navigate('/dashboard/projects')}
              className="flex items-center gap-3 p-4 border border-placeholder rounded-sm hover:border-gold hover:shadow-sm transition-all text-left">
              <FolderPlus size={20} className="text-gold shrink-0" />
              <span className="text-sm font-semibold text-text">Start New Project</span>
            </button>
            <button onClick={() => setToast('Downloading all invoices...')}
              className="flex items-center gap-3 p-4 border border-placeholder rounded-sm hover:border-gold hover:shadow-sm transition-all text-left">
              <Download size={20} className="text-gold shrink-0" />
              <span className="text-sm font-semibold text-text">Download All Invoices</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spending Overview + Financial Snapshot */}
      <div>
        <h2 className="font-heading text-2xl font-normal mb-6">Spending Overview</h2>
        <div className="bg-white rounded-sm p-8 border border-placeholder">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e3de" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b6258', fontSize: 12, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b6258', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168,144,96,0.05)' }} />
              <Bar dataKey="amount" fill="#a89060" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>

          {/* Financial Snapshot */}
          <div className="mt-6 pt-6 border-t border-placeholder grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">YTD Spent</p>
              <div className="flex items-baseline gap-3">
                <p className="font-heading text-2xl font-normal">${ytdSpent.toLocaleString()}</p>
                <span className={`flex items-center gap-1 text-xs font-semibold ${spendDelta > 0 ? 'text-gold' : 'text-green-700'}`}>
                  {spendDelta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {spendDelta > 0 ? '+' : ''}{spendDeltaPct}% vs last year
                </span>
              </div>
              <p className="text-xs text-muted mt-1">Last year same period: ${ytdLastYear.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">YTD Savings</p>
              <div className="flex items-baseline gap-3">
                <p className="font-heading text-2xl font-normal text-gold">${ytdSavings.toLocaleString()}</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
                  <TrendingUp size={14} /> +${savingsDelta.toLocaleString()} vs last year
                </span>
              </div>
              <p className="text-xs text-muted mt-1">Last year same period: ${ytdSavingsLastYear.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Rep Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-lg w-full mx-4 border border-placeholder">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Message Your Rep</h2>
              <button onClick={() => { setShowContactModal(false); setContactMessage('') }} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">To</label>
                <div className="px-4 py-3 bg-white rounded-sm border border-placeholder text-text font-semibold text-sm">{dedicatedRep.name} — {dedicatedRep.email}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Subject</label>
                <input type="text" value={`Message from ${user?.contractorName || 'Shane Nguyen'}`} readOnly className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm bg-white text-text text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Message</label>
                <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none" rows="5" placeholder="Type your message..."></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowContactModal(false); setContactMessage('') }}
                  className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                <button type="button" onClick={handleSendMessage} disabled={!contactMessage.trim()}
                  className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
