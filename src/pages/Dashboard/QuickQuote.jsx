import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Plus, X, Check, Calculator, Minus, Upload, Search, FileText, Save, ChevronDown, User, Building, Truck, Edit2, ArrowLeft, ArrowRight, CheckCircle, CreditCard, MapPin } from 'lucide-react'

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-fade-in">
      <Check size={16} className="text-green-400" /><span className="font-body text-sm">{message}</span>
    </div>
  )
}

const FINISHES = ['White', 'Espresso', 'Natural', 'Sage', 'Navy', 'Custom']
const CABINET_LINES = ['Mallorca', 'Aspen', 'Franco', 'Shady', 'Irena', 'Newport']
const SKU_CATALOG = [
  { sku: 'MAL-B36', name: 'Mallorca Base Cabinet 36"', line: 'Mallorca', price: 710 },
  { sku: 'MAL-W30', name: 'Mallorca Wall Cabinet 30"', line: 'Mallorca', price: 440 },
  { sku: 'MAL-W36', name: 'Mallorca Wall Cabinet 36"', line: 'Mallorca', price: 520 },
  { sku: 'MAL-P84', name: 'Mallorca Pantry Tower 84"', line: 'Mallorca', price: 1190 },
  { sku: 'ASP-B36', name: 'Aspen Shaker Base 36"', line: 'Aspen', price: 680 },
  { sku: 'ASP-B30', name: 'Aspen Shaker Base 30"', line: 'Aspen', price: 580 },
  { sku: 'ASP-W30', name: 'Aspen Shaker Wall 30"', line: 'Aspen', price: 420 },
  { sku: 'ASP-ISL48', name: 'Aspen Island Cabinet 48"', line: 'Aspen', price: 1450 },
  { sku: 'FRN-B36', name: 'Franco Flat Panel Base 36"', line: 'Franco', price: 650 },
  { sku: 'FRN-W30', name: 'Franco Flat Panel Wall 30"', line: 'Franco', price: 390 },
  { sku: 'FRN-CRN36', name: 'Franco Corner Cabinet 36"', line: 'Franco', price: 920 },
  { sku: 'SHD-B36', name: 'Shady Raised Panel Base 36"', line: 'Shady', price: 740 },
  { sku: 'SHD-W30', name: 'Shady Raised Panel Wall 30"', line: 'Shady', price: 460 },
  { sku: 'SHD-VAN60', name: 'Shady Double Vanity 60"', line: 'Shady', price: 1350 },
  { sku: 'IRN-B36', name: 'Irena Slab Base 36"', line: 'Irena', price: 690 },
  { sku: 'IRN-W30', name: 'Irena Slab Wall 30"', line: 'Irena', price: 410 },
  { sku: 'IRN-W36', name: 'Irena Slab Wall 36"', line: 'Irena', price: 490 },
  { sku: 'NPT-B36', name: 'Newport Beaded Base 36"', line: 'Newport', price: 720 },
  { sku: 'NPT-W30', name: 'Newport Beaded Wall 30"', line: 'Newport', price: 430 },
  { sku: 'NPT-P84', name: 'Newport Beaded Pantry 84"', line: 'Newport', price: 1220 },
]
const TEMPLATES = [
  { name: 'Standard Kitchen (10 cabinets)', items: [{ sku: 'ASP-B36', qty: 4 }, { sku: 'ASP-W30', qty: 4 }, { sku: 'ASP-ISL48', qty: 1 }, { sku: 'MAL-P84', qty: 1 }] },
  { name: 'Bathroom Vanity Set', items: [{ sku: 'SHD-VAN60', qty: 1 }, { sku: 'SHD-W30', qty: 2 }] },
]
const PROJECTS = ['Modern Kitchen Remodel', 'Bathroom Vanity Refresh', 'Island Cabinet Installation', 'Full Home Kitchen + Dining', 'Commercial Kitchen Renovation']
const ADDRESSES = [
  { id: 1, nickname: 'Main Office', street: '123 Business Ave', city: 'Los Angeles', state: 'CA', zip: '90001' },
  { id: 2, nickname: 'Jobsite - Oak St', street: '456 Oak Street', city: 'Los Angeles', state: 'CA', zip: '90002' },
]

const fmt = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const getPrice = (sku) => SKU_CATALOG.find(s => s.sku === sku)?.price || 0
const getName = (sku) => SKU_CATALOG.find(s => s.sku === sku)?.name || sku
const getLine = (sku) => SKU_CATALOG.find(s => s.sku === sku)?.line || ''
const emptyRow = () => ({ id: Date.now() + Math.random(), sku: '', finish: 'White', qty: 1, search: '', lineFilter: '' })

const STEPS = [{ n: 1, l: 'Contact' }, { n: 2, l: 'Products' }, { n: 3, l: 'Shipping' }, { n: 4, l: 'Review & Pay' }]

const INPUT_CLS = 'h-10 px-3 border border-[#e8e3de] rounded-sm bg-white focus:outline-none focus:border-gold transition-colors text-sm'

function SkuPicker({ item, onSelect, onSearchChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  const q = (item.search || '').toLowerCase()
  const filtered = SKU_CATALOG.filter(s => { if (item.lineFilter && s.line !== item.lineFilter) return false; if (q && !s.name.toLowerCase().includes(q) && !s.sku.toLowerCase().includes(q)) return false; return true })
  const selected = SKU_CATALOG.find(s => s.sku === item.sku)
  const line = selected?.line
  return (
    <div className="relative" ref={ref}>
      <div className="flex gap-2">
        <select value={item.lineFilter || ''} onChange={(e) => { onSearchChange(item.id, 'lineFilter', e.target.value); setOpen(true) }}
          className={`${INPUT_CLS} w-[120px] shrink-0 appearance-none`}>
          <option value="">All Lines</option>{CABINET_LINES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-3 text-muted pointer-events-none" />
          <input type="text" value={open ? item.search : (selected ? selected.name : item.search)}
            onChange={(e) => { onSearchChange(item.id, 'search', e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)} placeholder="Search cabinets..."
            className={`${INPUT_CLS} w-full pl-9 ${line ? 'pr-24' : 'pr-3'}`} />
          {line && !open && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full">{line}</span>
          )}
        </div>
      </div>
      {open && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-[#e8e3de] rounded-sm shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? <div className="px-3 py-3 text-sm text-muted">No cabinets found</div> :
            filtered.map(s => (
              <button key={s.sku} onClick={() => { onSelect(item.id, s.sku); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gold/5 flex justify-between ${item.sku === s.sku ? 'bg-gold/10 font-semibold' : ''}`}>
                <span className="text-text">{s.name}</span><span className="text-muted text-xs ml-2">{s.line} — {fmt(s.price)}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

function StepBar({ current }) {
  return (
    <div className="flex items-start justify-between mb-8 max-w-xl mx-auto">
      {STEPS.map((s, i) => {
        const done = current > s.n, active = current === s.n
        return (
          <div key={s.n} className="flex-1 flex flex-col items-center relative">
            {i > 0 && <div className={`absolute top-4 right-1/2 w-full h-0.5 ${done || active ? 'bg-gold' : 'bg-gray-200'}`}></div>}
            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'bg-gold text-white' : active ? 'bg-gold text-white' : 'bg-gray-200 text-muted'}`}>
              {done ? <Check size={16} /> : s.n}
            </div>
            <span className={`text-xs font-semibold uppercase tracking-widest mt-2 ${active ? 'text-gold' : done ? 'text-text' : 'text-muted'}`}>{s.l}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function QuickQuote() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [toast, setToast] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [orderNum, setOrderNum] = useState('')

  const [contact, setContact] = useState({ name: user?.contractorName || '', business: user?.businessName || '', email: user?.email || '', phone: user?.phone || '', project: '', poNumber: '', notes: '' })
  const [items, setItems] = useState([emptyRow()])
  const [attachment, setAttachment] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(1)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [showNewAddr, setShowNewAddr] = useState(false)
  const [newAddr, setNewAddr] = useState({ nickname: '', street: '', city: '', state: '', zip: '' })
  const [addresses, setAddresses] = useState(ADDRESSES)
  const [paymentMethod, setPaymentMethod] = useState('net30')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })

  const updateItem = (id, f, v) => setItems(items.map(i => i.id === id ? { ...i, [f]: v } : i))
  const selectSku = (id, sku) => { const c = SKU_CATALOG.find(s => s.sku === sku); setItems(items.map(i => i.id === id ? { ...i, sku, search: c?.name || '' } : i)) }
  const addItem = () => setItems([...items, emptyRow()])
  const removeItem = (id) => { if (items.length > 1) setItems(items.filter(i => i.id !== id)) }
  const loadTemplate = (name) => { const t = TEMPLATES.find(t => t.name === name); if (!t) return; setItems(t.items.map(ti => { const c = SKU_CATALOG.find(s => s.sku === ti.sku); return { id: Date.now() + Math.random(), sku: ti.sku, finish: 'White', qty: ti.qty, search: c?.name || '', lineFilter: '' } })) }

  const validItems = items.filter(i => i.sku)
  const subtotal = validItems.reduce((s, i) => s + getPrice(i.sku) * (parseInt(i.qty) || 0), 0)
  const savings = subtotal * 0.25
  const total = subtotal - savings
  const selAddr = addresses.find(a => a.id === selectedAddress)

  const addAddress = () => { if (newAddr.nickname && newAddr.street && newAddr.city && newAddr.state && newAddr.zip) { const id = Date.now(); setAddresses([...addresses, { id, ...newAddr }]); setSelectedAddress(id); setNewAddr({ nickname: '', street: '', city: '', state: '', zip: '' }); setShowNewAddr(false) } }

  const handleSubmit = () => { setOrderNum('ORD-' + String(7 + Math.floor(Math.random() * 90)).padStart(3, '0')); setSubmitted(true) }

  if (submitted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={32} className="text-green-600" /></div>
          <h1 className="font-heading text-4xl font-normal mb-3">Order {orderNum} Submitted</h1>
          <p className="text-muted mb-1">Estimated ship date: <span className="font-semibold text-text">3 business days after confirmation</span></p>
          <p className="text-muted mb-8"><span className="font-semibold text-text">Michael Torres</span> will confirm your order within 24 hours.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/dashboard/orders')} className="btn-primary px-6 py-3">View Order</button>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 border border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">Return to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/dashboard/catalog')} className="flex items-center gap-1.5 text-muted hover:text-gold transition-colors text-xs font-semibold uppercase tracking-widest"><ArrowLeft size={14} /> Back to Catalog</button>

      <div><h1 className="font-heading text-4xl font-normal mb-2">New Order</h1><p className="text-lg text-muted">Configure and place your cabinet order.</p></div>

      <StepBar current={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <h2 className="font-heading text-2xl font-normal mb-6">Contact Information</h2>
          <div className="bg-white rounded-sm p-8 border border-placeholder space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Contact Name</label><input type="text" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Business Name</label><input type="text" value={contact.business} onChange={(e) => setContact({ ...contact, business: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Email</label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Phone</label><input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Linked Project</label>
                <select value={contact.project} onChange={(e) => setContact({ ...contact, project: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold appearance-none text-sm"><option value="">-- Select --</option>{PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">PO Number <span className="font-normal">(optional)</span></label><input type="text" value={contact.poNumber} onChange={(e) => setContact({ ...contact, poNumber: e.target.value })} placeholder="PO-2026-0050" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" /></div>
            </div>
            <div><label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Notes / Special Requirements</label><textarea value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} rows="3" placeholder="Any special requirements..." className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold resize-none text-sm"></textarea></div>
          </div>
          <div className="flex justify-end mt-6"><button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2 py-3 px-6">Next <ArrowRight size={16} /></button></div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Select Products</h2>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard/catalog')} className="text-xs font-semibold text-gold hover:underline uppercase tracking-widest">Browse Catalog</button>
                <select onChange={(e) => { if (e.target.value) loadTemplate(e.target.value); e.target.value = '' }} className="px-3 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold appearance-none text-xs font-semibold uppercase tracking-widest">
                  <option value="">Load Template</option>{TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-sm border border-[#e8e3de] overflow-visible mb-6">
              <table className="w-full table-fixed">
                <colgroup>
                  <col />
                  <col style={{ width: '140px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '110px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '40px' }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#e8e3de]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Finish</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-muted">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted">Unit Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted">Total</th>
                    <th className="px-2 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const p = getPrice(item.sku); const q = parseInt(item.qty) || 0
                    return (
                      <tr key={item.id} className={`border-b border-[#e8e3de] ${idx % 2 === 1 ? 'bg-[#fafaf9]' : 'bg-white'}`}>
                        <td className="px-4 py-3">
                          <SkuPicker item={item} onSelect={selectSku} onSearchChange={(id, f, v) => updateItem(id, f, v)} />
                        </td>
                        <td className="px-4 py-3">
                          <select value={item.finish} onChange={(e) => updateItem(item.id, 'finish', e.target.value)}
                            className={`${INPUT_CLS} w-full appearance-none`}>
                            {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => updateItem(item.id, 'qty', Math.max(1, q - 1))}
                              className="w-8 h-10 flex items-center justify-center border border-[#e8e3de] rounded-sm hover:border-gold transition-colors">
                              <Minus size={14} className="text-muted" />
                            </button>
                            <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-text">{item.qty}</span>
                            <button onClick={() => updateItem(item.id, 'qty', q + 1)}
                              className="w-8 h-10 flex items-center justify-center border border-[#e8e3de] rounded-sm hover:border-gold transition-colors">
                              <Plus size={14} className="text-muted" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-text tabular-nums">{item.sku ? fmt(p) : '—'}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-text tabular-nums">{item.sku ? fmt(p * q) : '—'}</td>
                        <td className="px-2 py-3 text-center">
                          <button onClick={() => removeItem(item.id)} disabled={items.length === 1}
                            className="p-1.5 hover:bg-red-100 rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                            <X size={14} className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-[#e8e3de]">
                <button onClick={addItem} className="flex items-center gap-2 text-gold font-body text-xs font-semibold uppercase tracking-widest hover:underline">
                  <Plus size={14} /> Add Item
                </button>
              </div>
            </div>

            {/* Attachment */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Attachments</label>
              {attachment ? (
                <div className="flex items-center justify-between p-3 bg-white border border-placeholder rounded-sm max-w-md"><div className="flex items-center gap-2"><FileText size={16} className="text-gold" /><span className="text-sm text-text font-semibold truncate">{attachment}</span></div><button onClick={() => setAttachment(null)} className="p-1 hover:bg-red-100 rounded-sm"><X size={14} className="text-red-500" /></button></div>
              ) : (
                <label className="block p-4 border-2 border-dashed border-placeholder rounded-sm text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors max-w-md"><input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setAttachment(e.target.files[0].name) }} /><Upload size={20} className="text-muted mx-auto mb-1" /><p className="text-xs text-muted">Floor plans or spec sheets (PDF, JPG, PNG)</p></label>
              )}
            </div>

            {/* Mobile Summary */}
            <div className="lg:hidden bg-white rounded-sm p-6 border border-placeholder mb-6">
              <div className="flex items-center gap-2 mb-4"><Calculator size={18} className="text-gold" /><h3 className="font-heading text-lg font-normal">Order Summary</h3></div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal ({validItems.length})</span><span className="font-semibold">{fmt(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-green-700 font-semibold">Trade Savings (25%)</span><span className="text-green-700 font-semibold">-{fmt(savings)}</span></div>
                <div className="pt-3 border-t border-placeholder flex justify-between"><span className="text-xs font-semibold uppercase tracking-widest text-muted">Total</span><span className="font-heading text-xl">{fmt(total)}</span></div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 md:px-6 py-3 border border-placeholder text-muted rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors"><ArrowLeft size={16} /> Back</button>
              <button onClick={() => setStep(3)} disabled={validItems.length === 0} className="btn-primary flex items-center gap-2 py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed">Next <ArrowRight size={16} /></button>
            </div>
          </div>

          {/* Sticky Summary */}
          <div className="w-72 shrink-0 hidden lg:block">
            <div className="sticky top-6 bg-white rounded-sm p-6 border border-placeholder">
              <div className="flex items-center gap-2 mb-4"><Calculator size={18} className="text-gold" /><h3 className="font-heading text-lg font-normal">Order Summary</h3></div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal ({validItems.length})</span><span className="font-semibold">{fmt(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-green-700 font-semibold">Trade Savings (25%)</span><span className="font-semibold text-green-700">-{fmt(savings)}</span></div>
                <div className="pt-3 border-t border-placeholder flex justify-between"><span className="text-xs font-semibold uppercase tracking-widest text-muted">Total</span><span className="font-heading text-xl">{fmt(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-normal mb-6">Shipping Information</h2>
          <div className="bg-white rounded-sm p-8 border border-placeholder space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">Delivery Address</label>
              <div className="space-y-3">
                {addresses.map(a => (
                  <label key={a.id} className={`block p-4 rounded-sm border cursor-pointer transition-colors ${selectedAddress === a.id ? 'border-gold bg-gold/5' : 'border-placeholder hover:border-gold/50'}`}>
                    <div className="flex items-start gap-3"><input type="radio" name="addr" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} className="mt-1 accent-gold" /><div><p className="font-semibold text-text text-sm">{a.nickname}</p><p className="text-sm text-muted">{a.street}, {a.city}, {a.state} {a.zip}</p></div></div>
                  </label>
                ))}
                {!showNewAddr ? (
                  <button onClick={() => setShowNewAddr(true)} className="flex items-center gap-2 text-xs font-semibold text-gold hover:underline uppercase tracking-widest"><Plus size={14} /> Add New Address</button>
                ) : (
                  <div className="p-4 border border-placeholder rounded-sm space-y-3">
                    <input type="text" value={newAddr.nickname} onChange={(e) => setNewAddr({ ...newAddr, nickname: e.target.value })} placeholder="Nickname" className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                    <input type="text" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} placeholder="Street" className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                    <div className="grid grid-cols-3 gap-3">
                      <input type="text" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} placeholder="City" className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                      <input type="text" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} placeholder="CA" maxLength="2" className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                      <input type="text" value={newAddr.zip} onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} placeholder="ZIP" className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                    </div>
                    <div className="flex gap-3"><button onClick={addAddress} className="btn-primary py-2 px-4 text-xs">Save</button><button onClick={() => setShowNewAddr(false)} className="px-4 py-2 border border-gray-300 rounded-sm text-sm text-muted hover:text-text">Cancel</button></div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Requested Delivery Date</label>
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
              <p className="text-xs text-muted mt-2">Standard orders ship within 3 business days of confirmation.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Jobsite Access Instructions</label>
              <textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} rows="3" placeholder="Gate code, contact name on site, dock number..." className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold resize-none text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">Shipping Method</label>
              <div className="space-y-3">
                <label className={`block p-4 rounded-sm border cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-gold bg-gold/5' : 'border-placeholder hover:border-gold/50'}`}>
                  <div className="flex items-start gap-3"><input type="radio" name="ship" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="mt-1 accent-gold" /><div><p className="font-semibold text-text text-sm">Standard Shipping</p><p className="text-xs text-muted">Free on orders over $5,000</p></div></div>
                </label>
                <label className={`block p-4 rounded-sm border cursor-pointer transition-colors ${shippingMethod === 'expedited' ? 'border-gold bg-gold/5' : 'border-placeholder hover:border-gold/50'}`}>
                  <div className="flex items-start gap-3"><input type="radio" name="ship" checked={shippingMethod === 'expedited'} onChange={() => setShippingMethod('expedited')} className="mt-1 accent-gold" /><div><p className="font-semibold text-text text-sm">Expedited Shipping</p><p className="text-xs text-muted">Contact rep for pricing</p></div></div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 border border-placeholder text-muted rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors"><ArrowLeft size={16} /> Back</button>
            <button onClick={() => setStep(4)} className="btn-primary flex items-center gap-2 py-3 px-6">Next <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* STEP 4 — Review & Pay */}
      {step === 4 && (
        <div className="flex gap-6">
          {/* Left — Order Summary */}
          <div className="flex-1 min-w-0 space-y-4">
            <h2 className="font-heading text-2xl font-normal mb-2">Review & Pay</h2>

            {/* Contact */}
            <div className="bg-white rounded-sm p-6 border border-placeholder">
              <div className="flex items-center justify-between mb-3"><h3 className="font-body font-bold text-sm uppercase tracking-widest text-muted">Contact</h3><button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline"><Edit2 size={12} /> Edit</button></div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted">Name:</span> <span className="font-semibold">{contact.name}</span></div>
                <div><span className="text-muted">Business:</span> <span className="font-semibold">{contact.business}</span></div>
                <div><span className="text-muted">Email:</span> <span className="font-semibold">{contact.email}</span></div>
                <div><span className="text-muted">Phone:</span> <span className="font-semibold">{contact.phone}</span></div>
                {contact.project && <div><span className="text-muted">Project:</span> <span className="text-gold font-semibold">{contact.project}</span></div>}
                {contact.poNumber && <div><span className="text-muted">PO #:</span> <span className="font-semibold">{contact.poNumber}</span></div>}
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-sm border border-placeholder overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-placeholder">
                <h3 className="font-body font-bold text-sm uppercase tracking-widest text-muted">Products ({validItems.length})</h3>
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline"><Edit2 size={12} /> Edit</button>
              </div>
              <table className="w-full">
                <thead className="bg-white border-b border-placeholder">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Item</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-muted w-16">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted w-24">Unit</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {validItems.map(i => { const p = getPrice(i.sku); return (
                    <tr key={i.id} className="border-b border-placeholder">
                      <td className="px-6 py-3"><span className="text-sm text-text font-semibold">{getName(i.sku)}</span><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold block">{getLine(i.sku)} — {i.finish}</span></td>
                      <td className="px-6 py-3 text-center text-sm">{i.qty}</td>
                      <td className="px-6 py-3 text-right text-sm">{fmt(p)}</td>
                      <td className="px-6 py-3 text-right text-sm font-semibold">{fmt(p * i.qty)}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
              <div className="px-6 py-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="font-semibold">{fmt(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-green-700 font-semibold">Trade Savings (25%)</span><span className="text-green-700 font-semibold">-{fmt(savings)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Estimated Tax</span><span className="text-muted">TBD</span></div>
                <div className="flex justify-between pt-3 border-t border-placeholder"><span className="text-xs font-semibold uppercase tracking-widest text-muted">Order Total</span><span className="font-heading text-2xl">{fmt(total)}</span></div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-sm p-6 border border-placeholder">
              <div className="flex items-center justify-between mb-3"><h3 className="font-body font-bold text-sm uppercase tracking-widest text-muted">Shipping</h3><button onClick={() => setStep(3)} className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline"><Edit2 size={12} /> Edit</button></div>
              <div className="space-y-1 text-sm">
                {selAddr && <div><span className="text-muted">Address:</span> <span className="font-semibold">{selAddr.nickname} — {selAddr.street}, {selAddr.city}, {selAddr.state} {selAddr.zip}</span></div>}
                {deliveryDate && <div><span className="text-muted">Delivery:</span> <span className="font-semibold">{deliveryDate}</span></div>}
                <div><span className="text-muted">Method:</span> <span className="font-semibold">{shippingMethod === 'standard' ? 'Standard (Free over $5k)' : 'Expedited'}</span></div>
              </div>
            </div>
          </div>

          {/* Right — Payment */}
          <div className="w-80 shrink-0 hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-sm p-6 border border-placeholder">
                <h3 className="font-heading text-lg font-normal mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`block p-4 rounded-sm border cursor-pointer transition-colors ${paymentMethod === 'net30' ? 'border-gold bg-gold/5' : 'border-placeholder hover:border-gold/50'}`}>
                    <div className="flex items-start gap-3">
                      <input type="radio" name="pay" checked={paymentMethod === 'net30'} onChange={() => setPaymentMethod('net30')} className="mt-1 accent-gold" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><Building size={16} className="text-gold" /><span className="font-semibold text-text text-sm">Net 30 — Bill to account</span></div>
                        <p className="text-xs text-muted mt-1">Available credit: <span className="font-semibold text-text">$28,950</span></p>
                      </div>
                    </div>
                  </label>
                  <label className={`block p-4 rounded-sm border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-gold bg-gold/5' : 'border-placeholder hover:border-gold/50'}`}>
                    <div className="flex items-start gap-3">
                      <input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mt-1 accent-gold" />
                      <div className="flex items-center gap-2"><CreditCard size={16} className="text-gold" /><span className="font-semibold text-text text-sm">Pay by Card</span></div>
                    </div>
                  </label>
                  {paymentMethod === 'card' && (
                    <div className="space-y-3 pt-2">
                      <input type="text" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                        <input type="text" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} placeholder="CVV" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold text-sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button onClick={handleSubmit} className="btn-primary w-full text-center py-3">Place Order</button>
              <button onClick={() => setToast('Order saved as draft')} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors"><Save size={14} /> Save as Draft</button>
              <p className="text-[11px] text-muted leading-relaxed">By placing this order you agree to PK Cabinet's terms of sale. Trade pricing applied to verified accounts only.</p>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
