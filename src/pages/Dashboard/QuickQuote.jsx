import { useState, useEffect, useRef } from 'react'
import { Plus, X, Check, Calculator, Minus, Upload, Search, FileText, Save, ChevronDown } from 'lucide-react'

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
  { name: 'Standard Kitchen (10 cabinets)', items: [
    { sku: 'ASP-B36', qty: 4 }, { sku: 'ASP-W30', qty: 4 }, { sku: 'ASP-ISL48', qty: 1 }, { sku: 'MAL-P84', qty: 1 }
  ]},
  { name: 'Bathroom Vanity Set', items: [
    { sku: 'SHD-VAN60', qty: 1 }, { sku: 'SHD-W30', qty: 2 }
  ]},
]

const PROJECTS = [
  'Modern Kitchen Remodel', 'Bathroom Vanity Refresh', 'Island Cabinet Installation',
  'Full Home Kitchen + Dining', 'Commercial Kitchen Renovation'
]

const fmt = (amount) => '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const emptyRow = () => ({ id: Date.now(), sku: '', finish: 'White', qty: 1, search: '', lineFilter: '' })

function SkuPicker({ item, onSelect, onSearchChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const q = (item.search || '').toLowerCase()
  const filtered = SKU_CATALOG.filter(s => {
    if (item.lineFilter && s.line !== item.lineFilter) return false
    if (q && !s.name.toLowerCase().includes(q) && !s.sku.toLowerCase().includes(q)) return false
    return true
  })

  const selected = SKU_CATALOG.find(s => s.sku === item.sku)

  return (
    <div className="relative" ref={ref}>
      <div className="flex gap-1">
        <select value={item.lineFilter || ''} onChange={(e) => { onSearchChange(item.id, 'lineFilter', e.target.value); setOpen(true) }}
          className="px-2 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors text-xs appearance-none w-24 shrink-0">
          <option value="">All Lines</option>
          {CABINET_LINES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted" />
          <input type="text"
            value={open ? item.search : (selected ? selected.name : item.search)}
            onChange={(e) => { onSearchChange(item.id, 'search', e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Search cabinets..."
            className="w-full pl-8 pr-3 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
        </div>
      </div>
      {open && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-placeholder rounded-sm shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-3 text-sm text-muted">No cabinets found</div>
          ) : filtered.map(s => (
            <button key={s.sku} onClick={() => { onSelect(item.id, s.sku); setOpen(false) }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gold/5 transition-colors flex justify-between ${item.sku === s.sku ? 'bg-gold/10 font-semibold' : ''}`}>
              <span className="text-text">{s.name}</span>
              <span className="text-muted text-xs shrink-0 ml-2">{s.line} — {fmt(s.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function QuickQuote() {
  const [items, setItems] = useState([emptyRow()])
  const [projectName, setProjectName] = useState('')
  const [installDate, setInstallDate] = useState('')
  const [notes, setNotes] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [toast, setToast] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [quoteRef, setQuoteRef] = useState('')

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const selectSku = (id, sku) => {
    const cat = SKU_CATALOG.find(s => s.sku === sku)
    setItems(items.map(item => item.id === id ? { ...item, sku, search: cat ? cat.name : '' } : item))
  }

  const addItem = () => setItems([...items, emptyRow()])

  const removeItem = (id) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id))
  }

  const getPrice = (sku) => SKU_CATALOG.find(s => s.sku === sku)?.price || 0

  const subtotal = items.reduce((sum, item) => sum + (getPrice(item.sku) * (parseInt(item.qty) || 0)), 0)
  const tradeSavings = subtotal * 0.25

  const handleLoadTemplate = (templateName) => {
    const tmpl = TEMPLATES.find(t => t.name === templateName)
    if (!tmpl) return
    const newItems = tmpl.items.map(ti => {
      const cat = SKU_CATALOG.find(s => s.sku === ti.sku)
      return { id: Date.now() + Math.random(), sku: ti.sku, finish: 'White', qty: ti.qty, search: cat?.name || '', lineFilter: '' }
    })
    setItems(newItems)
  }

  const handleSubmit = () => {
    const ref = 'QR-' + Date.now().toString(36).toUpperCase().slice(-6)
    setQuoteRef(ref)
    setSubmitted(true)
  }

  const handleSaveDraft = () => {
    setToast('Quote saved as draft')
  }

  const handleNewQuote = () => {
    setSubmitted(false)
    setQuoteRef('')
    setItems([emptyRow()])
    setProjectName('')
    setInstallDate('')
    setNotes('')
    setAttachment(null)
  }

  const handleAttachment = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment(file.name)
      setToast(`${file.name} attached`)
    }
  }

  // ── Confirmation State ──
  if (submitted) {
    return (
      <div className="space-y-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="font-heading text-4xl font-normal mb-4">Quote Request Submitted</h1>
          <p className="text-lg text-muted mb-2">Your quote reference number is</p>
          <p className="font-heading text-2xl text-gold mb-6">{quoteRef}</p>
          <div className="bg-white rounded-sm p-6 border border-placeholder mb-8 text-left">
            <p className="text-sm text-text mb-2"><span className="font-semibold">Items:</span> {items.filter(i => i.sku).length} cabinet{items.filter(i => i.sku).length !== 1 ? 's' : ''}</p>
            <p className="text-sm text-text mb-2"><span className="font-semibold">Estimated Total:</span> {fmt(subtotal - tradeSavings)}</p>
            {projectName && <p className="text-sm text-text mb-2"><span className="font-semibold">Project:</span> {projectName}</p>}
            {installDate && <p className="text-sm text-text"><span className="font-semibold">Install Date:</span> {installDate}</p>}
          </div>
          <p className="text-muted mb-8">Your rep <span className="font-semibold text-text">Michael Torres</span> will respond within 24 hours with final trade pricing.</p>
          <button onClick={handleNewQuote} className="btn-primary px-8 py-3">Start New Quote</button>
        </div>
      </div>
    )
  }

  // ── Quote Builder ──
  return (
    <div className="space-y-8" style={{ backgroundColor: '#ffffff' }}>
      <div>
        <h1 className="font-heading text-4xl font-normal mb-2">Request a Quote</h1>
        <p className="text-lg text-muted">Submit a list of cabinets and we'll get back to you within 24 hours with trade pricing.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Line Item Builder (2 cols wide) */}
        <div className="col-span-2 space-y-6">
          {/* Load Template */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted shrink-0">Load Template</label>
            <div className="relative flex-1 max-w-xs">
              <select onChange={(e) => { if (e.target.value) handleLoadTemplate(e.target.value); e.target.value = '' }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                <option value="">-- Select a template --</option>
                {TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-muted pointer-events-none" />
            </div>
          </div>

          <div className="bg-white rounded-sm border border-placeholder overflow-visible">
            <table className="w-full">
              <thead className="bg-white border-b border-placeholder">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Cabinet Style</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted w-28">Finish</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-muted w-28">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted w-28">Est. Price</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-muted w-12"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = getPrice(item.sku)
                  return (
                    <tr key={item.id} className="border-b border-placeholder">
                      <td className="px-4 py-3">
                        <SkuPicker item={item} onSelect={selectSku}
                          onSearchChange={(id, field, val) => updateItem(id, field, val)} />
                      </td>
                      <td className="px-4 py-3">
                        <select value={item.finish} onChange={(e) => updateItem(item.id, 'finish', e.target.value)}
                          className="w-full px-2 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                          {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => updateItem(item.id, 'qty', Math.max(1, (parseInt(item.qty) || 1) - 1))}
                            className="p-1 border border-gray-300 rounded-sm hover:border-gold transition-colors"><Minus size={14} className="text-muted" /></button>
                          <span className="w-8 text-center text-sm font-semibold text-text">{item.qty}</span>
                          <button onClick={() => updateItem(item.id, 'qty', (parseInt(item.qty) || 1) + 1)}
                            className="p-1 border border-gray-300 rounded-sm hover:border-gold transition-colors"><Plus size={14} className="text-muted" /></button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-text">
                        {item.sku ? fmt(price) : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => removeItem(item.id)} disabled={items.length === 1}
                          className="p-1.5 hover:bg-red-100 rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          <X size={16} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-placeholder">
              <button onClick={addItem} className="flex items-center gap-2 text-gold font-body text-xs font-semibold uppercase tracking-widest hover:underline">
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-sm p-6 border border-placeholder">
            <div className="flex items-center gap-3 mb-4">
              <Calculator size={20} className="text-gold" />
              <h3 className="font-heading text-xl font-normal">Estimate Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal ({items.filter(i => i.sku).length} items)</span>
                <span className="font-semibold text-text">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm pb-3 border-b border-placeholder">
                <span className="text-gold font-semibold">Estimated Trade Savings (25%)</span>
                <span className="font-semibold text-gold">-{fmt(tradeSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">Estimated Trade Total</span>
                <span className="font-heading text-2xl">{fmt(subtotal - tradeSavings)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quote Details Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-sm p-6 border border-placeholder space-y-4">
            <h3 className="font-heading text-xl font-normal pb-4 border-b border-placeholder">Quote Details</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Project</label>
              <div className="relative">
                <select value={projectName} onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                  <option value="">-- Select a project --</option>
                  {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-4 text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Installation Date</label>
              <input type="text" value={installDate}
                onChange={(e) => setInstallDate(e.target.value)}
                placeholder="e.g., May 15, 2026"
                className="w-full px-4 py-3 border-b-2 border-gray-300 bg-white focus:outline-none focus:border-gold transition-colors text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4"
                placeholder="Any special requirements, dimensions, or preferences..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none text-sm"></textarea>
            </div>

            {/* File Attachment */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Attachments</label>
              {attachment ? (
                <div className="flex items-center justify-between p-3 bg-white border border-placeholder rounded-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gold" />
                    <span className="text-sm text-text font-semibold truncate">{attachment}</span>
                  </div>
                  <button onClick={() => setAttachment(null)} className="p-1 hover:bg-red-100 rounded-sm transition-colors">
                    <X size={14} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <label className="block p-4 border-2 border-dashed border-placeholder rounded-sm text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleAttachment} />
                  <Upload size={20} className="text-muted mx-auto mb-1" />
                  <p className="text-xs text-muted">Floor plans or spec sheets (PDF, JPG, PNG)</p>
                </label>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button onClick={handleSubmit} disabled={items.every(i => !i.sku)}
                className="btn-primary w-full text-center py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Quote Request
              </button>
              <button onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">
                <Save size={14} /> Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
