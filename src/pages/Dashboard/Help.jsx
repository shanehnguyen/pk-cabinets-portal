import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, AlertCircle, Package, ChevronDown, ChevronUp, ChevronRight, Upload, Check, X, Phone, Search, AlertTriangle, Circle } from 'lucide-react'

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

const FAQ_DATA = [
  { q: 'How do I access trade pricing?', a: 'Trade pricing is automatically applied to your account once approved. You will see your discounted price on all product pages when logged in.' },
  { q: 'What is my trade discount percentage?', a: 'Your current discount is shown in the sidebar under Trade Tier. Gold members receive 25% off retail, Platinum members receive 30% off.' },
  { q: 'How long does shipping take?', a: 'Standard orders ship within 3 business days. Orders over $5,000 qualify for free shipping. Expedited options are available at checkout.' },
  { q: 'Can I return or exchange cabinets?', a: 'Yes. Unopened cabinets may be returned within 30 days of delivery. Custom or modified cabinets are non-returnable. Contact your rep to initiate a return.' },
  { q: 'How do I link an order to a project?', a: 'Go to Orders, click the reorder/track icon on any order, then select a project from the dropdown. You can also link from inside the Project Detail view.' },
  { q: 'What file types can I upload for verification?', a: 'We accept JPG, PNG, PDF, and DOC files up to 10MB. Accepted documents include contractor license, business license, and state release certificate.' },
  { q: 'How do I add team members to my account?', a: 'Go to Account Settings and scroll to Team Members. Click Invite Team Member and enter their email and role.' },
  { q: 'Who do I contact if a cabinet arrives damaged?', a: 'Report it immediately through Orders \u2192 Report an Issue, or submit a support ticket below. Include photos of the damage. We will arrange a replacement within 2 business days.' },
]

const MOCK_TICKETS = [
  { id: 'TKT-001', issueType: 'Order Issue', submitted: 'Mar 20, 2026', status: 'Resolved' },
  { id: 'TKT-002', issueType: 'Product Question', submitted: 'Apr 10, 2026', status: 'In Progress' },
]

const ticketStatusColor = (status) => {
  switch (status) {
    case 'Open': return 'bg-yellow-100 text-yellow-800'
    case 'In Progress': return 'bg-gold/10 text-gold'
    case 'Resolved': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function Help() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)
  const [faqSearch, setFaqSearch] = useState('')
  const [toast, setToast] = useState(null)

  const [showContactModal, setShowContactModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')

  const [showSampleModal, setShowSampleModal] = useState(false)
  const [sampleNotes, setSampleNotes] = useState('')

  const [ticket, setTicket] = useState({ urgent: false, issueType: '', priority: 'Normal', orderNumber: '', description: '', attachment: null })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [submittedTicketId, setSubmittedTicketId] = useState('')

  const filteredFaq = faqSearch
    ? FAQ_DATA.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()))
    : FAQ_DATA

  const handleSendMessage = () => {
    if (contactMessage.trim()) {
      setShowContactModal(false)
      setContactMessage('')
      setToast('Message sent to Michael Torres')
    }
  }

  const handleSampleRequest = () => {
    setShowSampleModal(false)
    setSampleNotes('')
    setToast('Sample request submitted! We\'ll follow up within 2 business days.')
  }

  const handleSubmitTicket = () => {
    if (ticket.issueType && ticket.description.trim()) {
      const id = 'TKT-' + String(MOCK_TICKETS.length + 1).padStart(3, '0')
      setSubmittedTicketId(id)
      setTicketSubmitted(true)
    }
  }

  const handleResetTicket = () => {
    setTicket({ urgent: false, issueType: '', priority: 'Normal', orderNumber: '', description: '', attachment: null })
    setTicketSubmitted(false)
    setSubmittedTicketId('')
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-4xl font-normal mb-2">Help & Support</h1>
        <p className="text-lg text-muted">Get answers or reach out to our team.</p>
      </div>

      {/* Quick Actions — 4 cards */}
      <div>
        <h2 className="font-heading text-2xl font-normal mb-6">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-6">
          <button onClick={() => setShowContactModal(true)}
            className="bg-white rounded-sm p-6 border border-placeholder hover:border-gold hover:shadow-md transition-all text-left relative group">
            <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center mb-4">
              <Mail size={20} className="text-gold" />
            </div>
            <h3 className="font-body font-bold text-base mb-1">Message Your Rep</h3>
            <p className="text-sm text-muted">Send a direct message to your dedicated account representative.</p>
            <ChevronRight size={16} className="absolute bottom-6 right-6 text-placeholder group-hover:text-gold transition-colors" />
          </button>

          <button onClick={() => navigate('/dashboard/orders')}
            className="bg-white rounded-sm p-6 border border-placeholder hover:border-gold hover:shadow-md transition-all text-left relative group">
            <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center mb-4">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <h3 className="font-body font-bold text-base mb-1">Report an Order Issue</h3>
            <p className="text-sm text-muted">Report damaged, missing, or incorrect items from a recent order.</p>
            <ChevronRight size={16} className="absolute bottom-6 right-6 text-placeholder group-hover:text-gold transition-colors" />
          </button>

          <button onClick={() => setShowSampleModal(true)}
            className="bg-white rounded-sm p-6 border border-placeholder hover:border-gold hover:shadow-md transition-all text-left relative group">
            <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center mb-4">
              <Package size={20} className="text-gold" />
            </div>
            <h3 className="font-body font-bold text-base mb-1">Request a Sample</h3>
            <p className="text-sm text-muted">Order free finish samples and door styles to show clients.</p>
            <ChevronRight size={16} className="absolute bottom-6 right-6 text-placeholder group-hover:text-gold transition-colors" />
          </button>

          <div className="bg-white rounded-sm p-6 border border-placeholder hover:border-gold hover:shadow-md transition-all text-left relative group">
            <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center mb-4">
              <Phone size={20} className="text-gold" />
            </div>
            <h3 className="font-body font-bold text-base mb-1">Call Us</h3>
            <p className="text-sm text-muted mb-3">Speak directly with our support team Mon-Fri 8am-5pm CST.</p>
            <a href="tel:+15558001234" className="text-sm font-semibold text-gold hover:underline">(555) 800-1234</a>
            <ChevronRight size={16} className="absolute bottom-6 right-6 text-placeholder group-hover:text-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-heading text-2xl font-normal mb-6">Frequently Asked Questions</h2>

        {/* FAQ Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-muted" />
          <input type="text" value={faqSearch} onChange={(e) => { setFaqSearch(e.target.value); setOpenFaq(null) }}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
        </div>

        <div className="bg-white rounded-sm border border-placeholder">
          {filteredFaq.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted">No questions match your search.</div>
          ) : (
            filteredFaq.map((faq, idx) => (
              <div key={idx} className={`border-b border-placeholder last:border-b-0 ${openFaq === idx ? 'bg-gray-50' : ''}`}>
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left">
                  <span className="text-sm font-semibold text-text pr-4">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} className="text-gold shrink-0" /> : <ChevronDown size={18} className="text-muted shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* My Tickets */}
      <div>
        <h2 className="font-heading text-2xl font-normal mb-6">My Tickets</h2>
        <div className="bg-white rounded-sm border border-placeholder overflow-hidden">
          {MOCK_TICKETS.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted">No tickets yet.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-white border-b border-placeholder">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Ticket #</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Issue Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TICKETS.map(t => (
                  <tr key={t.id} className="border-b border-placeholder last:border-b-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-semibold text-text">{t.id}</td>
                    <td className="px-6 py-3 text-sm text-text">{t.issueType}</td>
                    <td className="px-6 py-3 text-sm text-muted">{t.submitted}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-3 py-1 rounded-sm text-xs font-semibold ${ticketStatusColor(t.status)}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Submit a Support Ticket */}
      <div>
        <h2 className="font-heading text-2xl font-normal mb-6">Submit a Support Ticket</h2>

        {ticketSubmitted ? (
          /* Success State */
          <div className="bg-white rounded-sm p-12 border border-placeholder text-center max-w-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="font-heading text-2xl font-normal mb-2">Ticket {submittedTicketId} submitted</h3>
            <p className="text-muted mb-6">We'll respond within 1 business day. Check your email for confirmation.</p>
            <button onClick={handleResetTicket} className="text-sm font-semibold text-gold hover:underline uppercase tracking-widest">Submit Another</button>
          </div>
        ) : (
          <div className={`bg-white rounded-sm p-8 border border-placeholder max-w-xl ${ticket.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
            <form className="space-y-4">
              {/* Urgent Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-placeholder">
                <div>
                  <span className="text-sm font-semibold text-red-600">Mark as Urgent</span>
                  <p className="text-xs text-muted mt-0.5">Use for time-sensitive issues affecting an active job site.</p>
                </div>
                <button type="button" onClick={() => setTicket({ ...ticket, urgent: !ticket.urgent })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${ticket.urgent ? 'bg-red-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${ticket.urgent ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Issue Type *</label>
                <div className="relative">
                  <select value={ticket.issueType} onChange={(e) => setTicket({ ...ticket, issueType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                    <option value="">Select an issue type...</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="Billing">Billing</option>
                    <option value="Account Access">Account Access</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-muted pointer-events-none" />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Priority</label>
                <div className="flex gap-4">
                  {['Normal', 'High', 'Critical'].map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="priority" value={p} checked={ticket.priority === p}
                        onChange={() => setTicket({ ...ticket, priority: p })}
                        className="w-4 h-4 accent-gold cursor-pointer" />
                      <span className={`text-sm ${p === 'Critical' ? 'text-red-600 font-semibold' : p === 'High' ? 'text-gold font-semibold' : 'text-text'}`}>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order # */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Order # <span className="font-normal">(optional)</span></label>
                <input type="text" value={ticket.orderNumber} onChange={(e) => setTicket({ ...ticket, orderNumber: e.target.value })}
                  placeholder="e.g., ORD-001" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Description *</label>
                <textarea value={ticket.description} onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                  rows="4" placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none text-sm"></textarea>
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Attachment</label>
                {ticket.attachment ? (
                  <div className="flex items-center justify-between p-3 bg-white border border-placeholder rounded-sm">
                    <span className="text-sm text-text font-semibold truncate">{ticket.attachment}</span>
                    <button type="button" onClick={() => setTicket({ ...ticket, attachment: null })} className="p-1 hover:bg-red-100 rounded-sm"><X size={14} className="text-red-500" /></button>
                  </div>
                ) : (
                  <label className="block p-4 border-2 border-dashed border-placeholder rounded-sm text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
                    <input type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setTicket({ ...ticket, attachment: e.target.files[0].name }) }} />
                    <Upload size={18} className="text-muted mx-auto mb-1" />
                    <p className="text-xs text-muted">Upload a screenshot or document</p>
                  </label>
                )}
              </div>

              <button type="button" onClick={handleSubmitTicket} disabled={!ticket.issueType || !ticket.description.trim()}
                className="btn-primary py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Ticket
              </button>
            </form>
          </div>
        )}
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
                <div className="px-4 py-3 bg-white border border-placeholder rounded-sm text-text font-semibold text-sm">Michael Torres — michael.torres@pkcabinets.com</div>
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

      {/* Sample Request Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Request a Sample</h2>
              <button onClick={() => setShowSampleModal(false)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
            </div>
            <p className="text-sm text-muted mb-4">We'll ship complimentary door samples and finish swatches to your address on file.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Notes</label>
                <textarea value={sampleNotes} onChange={(e) => setSampleNotes(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none" rows="3" placeholder="Specific finishes, styles, or quantities..."></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowSampleModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSampleRequest}
                  className="flex-1 btn-primary py-3">Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
