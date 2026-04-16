import { useState, useEffect, useMemo } from 'react'
import { Package, Download, ChevronDown, X, ArrowLeft, Check, AlertTriangle, FileDown, Truck, CheckCircle, ShoppingBag, CreditCard, FileText, Search, ArrowUpDown, Bookmark, ChevronUp, Navigation, RotateCcw, Edit2, Copy, Clock, AlertCircle } from 'lucide-react'

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

function Tooltip({ text, children }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-text text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text"></div>
      </div>
    </div>
  )
}

const fmt = (amount) => {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount
  return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const carrierUrl = (carrier, tracking) => {
  const t = (tracking || '').replace(/\s/g, '')
  if (!carrier) return '#'
  const c = carrier.toLowerCase()
  if (c.includes('ups')) return `https://www.ups.com/track?tracknum=${t}`
  return `https://www.fedex.com/fedextrack/?trknbr=${t}`
}

const ORDER_DATA = [
  {
    id: 'ORD-001', date: 'Mar 15, 2026', estimatedDelivery: 'Mar 25, 2026',
    items: 'Kitchen Cabinets Set (Maple)', total: 4500.00, status: 'Delivered',
    project: 'Modern Kitchen Remodel', carrier: 'FedEx',
    trackingNumber: '7489 2034 5612 0098', deliveredDate: 'Mar 24, 2026',
    paymentStatus: 'Paid', deliveryAddress: '1423 Oak Valley Dr, Pasadena, CA 91101',
    poNumber: 'PO-2026-0041', issues: [{ type: 'Damaged item', status: 'Resolved', date: 'Mar 26, 2026' }],
    lineItems: [
      { sku: 'MC-SHK-36W', description: 'Shaker Base Cabinet 36"', qty: 4, unitPrice: 680.00, tradePrice: 510.00 },
      { sku: 'MC-SHK-30W', description: 'Shaker Wall Cabinet 30"', qty: 6, unitPrice: 420.00, tradePrice: 315.00 },
      { sku: 'MC-HNG-SS', description: 'Soft-Close Hinge Set (pair)', qty: 20, unitPrice: 12.00, tradePrice: 9.00 },
    ]
  },
  {
    id: 'ORD-002', date: 'Mar 8, 2026', estimatedDelivery: 'Mar 22, 2026',
    items: 'Island Cabinet + Hardware', total: 2200.00, status: 'Shipped',
    project: 'Full Home Kitchen + Dining', carrier: 'FedEx',
    trackingNumber: '7489 2034 5612 1122', deliveredDate: null,
    paymentStatus: 'Net 30', paymentDue: 'Apr 15, 2026',
    deliveryAddress: '782 Elmwood Blvd, Glendale, CA 91202', poNumber: '', issues: [],
    lineItems: [
      { sku: 'MC-ISL-48', description: 'Island Base Cabinet 48"', qty: 1, unitPrice: 1450.00, tradePrice: 1087.50 },
      { sku: 'MC-HW-BRS', description: 'Brass Pull Handle Set (10pk)', qty: 2, unitPrice: 185.00, tradePrice: 138.75 },
      { sku: 'MC-HNG-SS', description: 'Soft-Close Hinge Set (pair)', qty: 8, unitPrice: 12.00, tradePrice: 9.00 },
    ]
  },
  {
    id: 'ORD-003', date: 'Feb 28, 2026', estimatedDelivery: 'Mar 10, 2026',
    items: 'Bathroom Vanity Cabinet', total: 1800.00, status: 'Delivered',
    project: 'Bathroom Vanity Refresh', carrier: 'UPS',
    trackingNumber: '1Z999AA10123456784', deliveredDate: 'Mar 9, 2026',
    paymentStatus: 'Paid', deliveryAddress: '2210 Maple St, Burbank, CA 91505',
    poNumber: 'PO-2026-0038', issues: [],
    lineItems: [
      { sku: 'MC-VAN-60D', description: 'Double Vanity Cabinet 60"', qty: 1, unitPrice: 1350.00, tradePrice: 1012.50 },
      { sku: 'MC-DRW-SC', description: 'Soft-Close Drawer Slides (pair)', qty: 6, unitPrice: 28.00, tradePrice: 21.00 },
      { sku: 'MC-HW-CHR', description: 'Chrome Knob Set (10pk)', qty: 1, unitPrice: 95.00, tradePrice: 71.25 },
    ]
  },
  {
    id: 'ORD-004', date: 'Feb 15, 2026', estimatedDelivery: 'Feb 28, 2026',
    items: 'Corner Cabinet + Installation Kit', total: 3200.00, status: 'Delivered',
    project: null, carrier: 'FedEx',
    trackingNumber: '7489 2034 5612 3344', deliveredDate: 'Feb 27, 2026',
    paymentStatus: 'Paid', deliveryAddress: '9901 Sunset Ave, Los Angeles, CA 90028',
    poNumber: 'PO-2026-0032', issues: [],
    lineItems: [
      { sku: 'MC-CRN-36', description: 'Lazy Susan Corner Cabinet 36"', qty: 2, unitPrice: 920.00, tradePrice: 690.00 },
      { sku: 'MC-INST-KIT', description: 'Professional Installation Kit', qty: 1, unitPrice: 245.00, tradePrice: 183.75 },
      { sku: 'MC-FLR-ADJ', description: 'Floor Leveling Adjustment Kit', qty: 2, unitPrice: 65.00, tradePrice: 48.75 },
    ]
  },
  {
    id: 'ORD-005', date: 'Feb 1, 2026', estimatedDelivery: 'Feb 14, 2026',
    items: 'Full Kitchen Remodel Set', total: 8900.00, status: 'Delivered',
    project: 'Island Cabinet Installation', carrier: 'FedEx Freight',
    trackingNumber: '0298 3347 5510 6677', deliveredDate: 'Feb 13, 2026',
    paymentStatus: 'Paid', deliveryAddress: '4420 Hillcrest Rd, Arcadia, CA 91006',
    poNumber: 'PO-2026-0025', issues: [{ type: 'Missing piece', status: 'In Review', date: 'Feb 15, 2026' }],
    lineItems: [
      { sku: 'MC-SHK-36W', description: 'Shaker Base Cabinet 36"', qty: 6, unitPrice: 680.00, tradePrice: 510.00 },
      { sku: 'MC-SHK-30W', description: 'Shaker Wall Cabinet 30"', qty: 8, unitPrice: 420.00, tradePrice: 315.00 },
      { sku: 'MC-PNT-42T', description: 'Pantry Tower Cabinet 42"', qty: 2, unitPrice: 1150.00, tradePrice: 862.50 },
      { sku: 'MC-HNG-SS', description: 'Soft-Close Hinge Set (pair)', qty: 32, unitPrice: 12.00, tradePrice: 9.00 },
    ]
  },
  {
    id: 'ORD-006', date: 'Mar 18, 2026', estimatedDelivery: 'Mar 28, 2026',
    items: 'Cabinet Hardware & Hinges', total: 450.00, status: 'Processing',
    project: 'Commercial Kitchen Renovation', carrier: null,
    trackingNumber: null, deliveredDate: null,
    paymentStatus: 'Net 30', paymentDue: 'Apr 18, 2026',
    deliveryAddress: '5500 Commerce Way, Unit 12, Pasadena, CA 91107',
    poNumber: '', issues: [],
    lineItems: [
      { sku: 'MC-HW-BRS', description: 'Brass Pull Handle Set (10pk)', qty: 1, unitPrice: 185.00, tradePrice: 138.75 },
      { sku: 'MC-HNG-SS', description: 'Soft-Close Hinge Set (pair)', qty: 15, unitPrice: 12.00, tradePrice: 9.00 },
      { sku: 'MC-HW-CHR', description: 'Chrome Knob Set (10pk)', qty: 1, unitPrice: 95.00, tradePrice: 71.25 },
    ]
  },
]

const INVOICES = [
  { id: 'INV-001', orderId: 'ORD-001', dateIssued: 'Mar 16, 2026', dueDate: 'Apr 15, 2026', amount: 4500.00, status: 'Paid' },
  { id: 'INV-002', orderId: 'ORD-002', dateIssued: 'Mar 9, 2026', dueDate: 'Apr 8, 2026', amount: 2200.00, status: 'Due' },
  { id: 'INV-003', orderId: 'ORD-003', dateIssued: 'Mar 1, 2026', dueDate: 'Mar 31, 2026', amount: 1800.00, status: 'Overdue' },
  { id: 'INV-004', orderId: 'ORD-005', dateIssued: 'Feb 2, 2026', dueDate: 'Mar 4, 2026', amount: 8900.00, status: 'Paid' },
]

const PROJECTS = [
  'Modern Kitchen Remodel',
  'Bathroom Vanity Refresh',
  'Island Cabinet Installation',
  'Full Home Kitchen + Dining',
  'Commercial Kitchen Renovation'
]

export default function Orders() {
  const [orders, setOrders] = useState(ORDER_DATA)
  const [statusFilter, setStatusFilter] = useState('All')
  const [projectFilter, setProjectFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('desc')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [toast, setToast] = useState(null)

  // Modal states
  const [trackingOrder, setTrackingOrder] = useState(null)
  const [reorderOrder, setReorderOrder] = useState(null)
  const [reorderProject, setReorderProject] = useState('')
  const [detailOrder, setDetailOrder] = useState(null)
  const [issueOrder, setIssueOrder] = useState(null)
  const [issueType, setIssueType] = useState('')
  const [issueNotes, setIssueNotes] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ cardNumber: '', expiry: '', cvv: '' })
  const [editingPo, setEditingPo] = useState(null)
  const [assignDropdown, setAssignDropdown] = useState(null)
  const [poSaved, setPoSaved] = useState(false)

  // Filter + search + sort
  const filtered = useMemo(() => {
    let result = orders.filter(order => {
      if (statusFilter !== 'All' && statusFilter !== 'Invoices' && order.status !== statusFilter) return false
      if (projectFilter && order.project !== projectFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!order.id.toLowerCase().includes(q) && !order.items.toLowerCase().includes(q)) return false
      }
      if (startDate || endDate) {
        const d = new Date(order.date)
        if (startDate && d < new Date(startDate)) return false
        if (endDate && d > new Date(endDate)) return false
      }
      return true
    })
    if (sortField) {
      result = [...result].sort((a, b) => {
        let va, vb
        if (sortField === 'date') { va = new Date(a.date); vb = new Date(b.date) }
        else if (sortField === 'total') { va = a.total; vb = b.total }
        else return 0
        return sortDir === 'asc' ? va - vb : vb - va
      })
    }
    return result
  }, [orders, statusFilter, projectFilter, searchQuery, startDate, endDate, sortField, sortDir])

  const projectTotal = projectFilter ? filtered.reduce((s, o) => s + o.total, 0) : 0

  const totalOrders = filtered.length
  const totalSpent = filtered.reduce((sum, order) => sum + order.total, 0)
  const totalSaved = totalSpent * 0.25

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Shipped': return 'bg-[#6b6258]/10 text-[#6b6258]'
      case 'Processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIssueStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-yellow-100 text-yellow-800'
      case 'In Review': return 'bg-gold/10 text-gold'
      case 'Resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Due': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-muted ml-1 inline" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-gold ml-1 inline" /> : <ChevronDown size={12} className="text-gold ml-1 inline" />
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(o => o.id)))
  }

  const handleDownloadInvoice = (orderId, e) => {
    if (e) e.stopPropagation()
    setToast(`Invoice ${orderId} downloaded`)
  }

  const handleBulkDownload = () => {
    setToast(`${selectedIds.size} invoice(s) downloaded`)
    setSelectedIds(new Set())
  }

  const handleConfirmReorder = () => {
    if (reorderProject) {
      setReorderOrder(null)
      setReorderProject('')
      setToast('Reorder placed successfully')
    }
  }

  const handleReportIssue = () => {
    if (issueType && issueOrder) {
      const newIssue = { type: issueType, status: 'Open', date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
      setOrders(orders.map(o => o.id === issueOrder.id ? { ...o, issues: [...(o.issues || []), newIssue] } : o))
      setIssueOrder(null)
      setIssueType('')
      setIssueNotes('')
      setToast('Issue reported successfully')
    }
  }

  const handlePoSave = (orderId) => {
    setEditingPo(null)
    setPoSaved(true)
    setTimeout(() => setPoSaved(false), 2000)
  }

  const handleCopyTracking = async (trackingNumber) => {
    try { await navigator.clipboard.writeText(trackingNumber) } catch {}
    setToast('Tracking number copied')
  }

  const handlePoUpdate = (orderId, value) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, poNumber: value } : o))
    if (detailOrder && detailOrder.id === orderId) setDetailOrder(prev => ({ ...prev, poNumber: value }))
  }

  const handleAssignProject = (orderId, projectName) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, project: projectName } : o))
    setAssignDropdown(null)
    setToast(`Order assigned to ${projectName}`)
  }

  const handleExportCsv = () => {
    const header = 'Order#,Date,Est. Delivery,Items,Project,Total,Status'
    const rows = filtered.map(o =>
      `${o.id},"${o.date}","${o.estimatedDelivery}","${o.items}","${o.project || ''}",${fmt(o.total)},${o.status}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'orders-export.csv'
    a.click()
    URL.revokeObjectURL(url)
    setToast('Orders exported as CSV')
  }

  const handleSavePayment = () => {
    setShowPaymentModal(false)
    setPaymentForm({ cardNumber: '', expiry: '', cvv: '' })
    setToast('Payment method updated')
  }

  const handleSaveTemplate = (order) => {
    setToast(`Template saved for ${order.id}`)
  }

  // ── Order Detail View ──
  if (detailOrder) {
    const order = orders.find(o => o.id === detailOrder.id) || detailOrder
    const lineTotal = order.lineItems.reduce((sum, li) => sum + li.tradePrice * li.qty, 0)

    const STATUS_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered']
    const currentStepIdx = (() => {
      if (order.status === 'Delivered') return 3
      if (order.status === 'Shipped') return 2
      if (order.status === 'Processing') return 1
      return 0
    })()
    const stepDates = [order.date, order.status !== 'Processing' ? null : null, order.status === 'Shipped' || order.status === 'Delivered' ? order.estimatedDelivery : null, order.deliveredDate || null]

    return (
      <div className="space-y-6">
        <button
          onClick={() => setDetailOrder(null)}
          className="flex items-center gap-2 text-muted hover:text-gold transition-colors font-body text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-sm border border-placeholder p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading text-4xl font-normal">{order.id}</h1>
                <span className={`inline-block px-3 py-1 rounded-sm text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-lg text-muted">Placed {order.date}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button onClick={() => handleDownloadInvoice(order.id)}
                className="flex items-center gap-2 px-3 py-2 border border-placeholder text-muted rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors">
                <Download size={14} /> Invoice
              </button>
              <button onClick={() => setToast(`Packing slip for ${order.id} downloaded`)}
                className="flex items-center gap-2 px-3 py-2 border border-placeholder text-muted rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors">
                <FileText size={14} /> Packing Slip
              </button>
              <button onClick={() => { setReorderOrder(order); setReorderProject('') }}
                className="btn-primary flex items-center gap-2 text-xs py-2 px-3">
                <RotateCcw size={14} /> Reorder
              </button>
              <button onClick={() => handleSaveTemplate(order)}
                className="flex items-center gap-2 px-3 py-2 border border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">
                <Bookmark size={14} /> Template
              </button>
              <button onClick={() => setIssueOrder(order)}
                className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-red-50 transition-colors">
                <AlertCircle size={14} /> Report Issue
              </button>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="mb-8 pt-2">
            <div className="flex items-start">
              {STATUS_STEPS.map((step, idx) => {
                const completed = idx < currentStepIdx
                const current = idx === currentStepIdx
                const future = idx > currentStepIdx
                return (
                  <div key={step} className="flex-1 flex flex-col items-center relative">
                    {/* Connector line */}
                    {idx > 0 && (
                      <div className={`absolute top-3 right-1/2 w-full h-0.5 -translate-y-1/2 ${completed || current ? 'bg-gold' : 'bg-gray-200'}`}></div>
                    )}
                    {/* Circle */}
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                      completed ? 'bg-gold' : current ? 'bg-gold' : 'bg-gray-200'
                    }`}>
                      {completed ? <Check size={14} className="text-white" /> : current ? <div className="w-2 h-2 bg-white rounded-full"></div> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                    </div>
                    {/* Label */}
                    <span className={`text-xs font-semibold mt-2 text-center ${completed || current ? 'text-text' : 'text-muted'}`}>{step}</span>
                    {/* Date */}
                    {(completed || current) && stepDates[idx] && (
                      <span className="text-[10px] text-muted mt-0.5">{stepDates[idx]}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-sm p-5 border border-placeholder">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Payment Status</p>
              {order.paymentStatus === 'Paid' ? (
                <p className="text-lg font-semibold text-green-700 flex items-center gap-2"><CheckCircle size={16} /> Paid</p>
              ) : (
                <p className="text-lg font-semibold text-text">Net 30 — <span className="text-gold">Due {order.paymentDue}</span></p>
              )}
            </div>
            <div className="bg-white rounded-sm p-5 border border-placeholder">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Delivery Address</p>
              <p className="text-sm text-text leading-relaxed">{order.deliveryAddress}</p>
            </div>
            <div className="bg-white rounded-sm p-5 border border-placeholder">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Carrier & Tracking</p>
              {order.status === 'Processing' || !order.carrier ? (
                <div className="flex items-center gap-2 text-muted">
                  <Clock size={16} />
                  <span className="text-sm">Awaiting shipment</span>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-text mb-1">{order.carrier}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-text">{order.trackingNumber}</span>
                    <button onClick={() => handleCopyTracking(order.trackingNumber)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors" title="Copy tracking number">
                      <Copy size={12} className="text-muted" />
                    </button>
                  </div>
                  <a href={carrierUrl(order.carrier, order.trackingNumber)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()}
                    className="text-xs font-semibold text-gold hover:underline mt-2 inline-block">Track on {order.carrier}</a>
                </>
              )}
            </div>
          </div>

          {order.project && (
            <div className="mb-6 pb-6 border-b border-placeholder">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Project</p>
              <div className="flex items-center gap-3">
                <span className="text-gold font-semibold">{order.project}</span>
                <button onClick={() => { setDetailOrder(null); setProjectFilter(order.project); setStatusFilter('All') }}
                  className="inline-flex items-center gap-1 px-3 py-1 border border-gold text-gold text-xs font-semibold rounded-full hover:bg-gold hover:text-white transition-colors">
                  View all orders in this project
                </button>
              </div>
            </div>
          )}

          {/* Internal PO Number — read-only with edit icon */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Internal PO Number</label>
            {editingPo === order.id ? (
              <input type="text" value={order.poNumber} onChange={(e) => handlePoUpdate(order.id, e.target.value)}
                onBlur={() => handlePoSave(order.id)} autoFocus placeholder="Enter PO number..."
                className="w-64 px-4 py-2 border-2 border-gold rounded-sm focus:outline-none transition-colors text-sm" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-text font-semibold">{order.poNumber || <span className="text-muted font-normal">Not set</span>}</span>
                <button onClick={() => setEditingPo(order.id)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors" title="Edit PO number">
                  <Edit2 size={14} className="text-muted" />
                </button>
                {poSaved && <Check size={14} className="text-green-600" />}
              </div>
            )}
          </div>

          {/* Delivery confirmation */}
          {order.status === 'Delivered' && order.deliveredDate && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-sm">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-green-800">Delivered on {order.deliveredDate}</span>
            </div>
          )}
        </div>

        {/* Open Issues Tracker */}
        {order.issues && order.issues.length > 0 && (
          <div className="bg-white rounded-sm border border-placeholder p-8">
            <h2 className="font-heading text-2xl font-normal mb-4">Open Issues</h2>
            <div className="space-y-3">
              {order.issues.map((issue, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-placeholder last:border-b-0">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={16} className="text-muted" />
                    <div>
                      <p className="text-sm font-semibold text-text">{issue.type}</p>
                      <p className="text-xs text-muted">Reported {issue.date}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-sm text-xs font-semibold ${getIssueStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Line Items Table */}
        <div className="bg-white rounded-sm border border-placeholder overflow-hidden">
          <div className="px-8 py-5 border-b border-placeholder">
            <h2 className="font-heading text-2xl font-normal">Line Items</h2>
          </div>
          <table className="w-full">
            <thead className="bg-white border-b border-placeholder">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Description</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-muted">Qty</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-muted">Unit Price</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-muted">Trade Price</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-muted">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((li, idx) => (
                <tr key={idx} className="border-b border-placeholder">
                  <td className="px-6 py-4 text-sm font-mono text-muted">{li.sku}</td>
                  <td className="px-6 py-4 text-sm text-text">{li.description}</td>
                  <td className="px-6 py-4 text-sm text-text text-right">{li.qty}</td>
                  <td className="px-6 py-4 text-sm text-muted text-right line-through">{fmt(li.unitPrice)}</td>
                  <td className="px-6 py-4 text-sm text-text font-semibold text-right">{fmt(li.tradePrice)}</td>
                  <td className="px-6 py-4 text-sm text-text font-semibold text-right">{fmt(li.tradePrice * li.qty)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-white">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-muted">Order Total</td>
                <td className="px-6 py-4 text-right font-heading text-xl">{fmt(lineTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Report Issue Modal */}
        {issueOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-normal">Report an Issue</h2>
                <button onClick={() => { setIssueOrder(null); setIssueType(''); setIssueNotes('') }} className="p-1 hover:bg-gray-50 rounded-sm transition-colors">
                  <X size={20} className="text-muted" />
                </button>
              </div>
              <p className="text-sm text-muted mb-6">Order {issueOrder.id} — {issueOrder.items}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Issue Type</label>
                  <div className="relative">
                    <select value={issueType} onChange={(e) => setIssueType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                      <option value="">Select an issue type...</option>
                      <option value="Damaged item">Damaged item</option>
                      <option value="Missing piece">Missing piece</option>
                      <option value="Wrong item">Wrong item</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-muted pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Notes</label>
                  <textarea value={issueNotes} onChange={(e) => setIssueNotes(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none"
                    rows="4" placeholder="Describe the issue..."></textarea>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => { setIssueOrder(null); setIssueType(''); setIssueNotes('') }}
                    className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                  <button type="button" onClick={handleReportIssue} disabled={!issueType}
                    className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">Submit Report</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reorder Modal */}
        {reorderOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-normal">Reorder Items</h2>
                <button onClick={() => setReorderOrder(null)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
              </div>
              <div className="mb-6 pb-6 border-b border-placeholder">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Original Items</p>
                <div className="space-y-2">
                  {reorderOrder.lineItems.map((li, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-text">{li.description}</span>
                      <span className="text-muted font-semibold">x{li.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-placeholder flex justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">Total</span>
                  <span className="font-semibold text-text">{fmt(reorderOrder.total)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Assign to Project</label>
                  <div className="relative">
                    <select value={reorderProject} onChange={(e) => setReorderProject(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                      <option value="">-- Choose a project --</option>
                      {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-muted pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setReorderOrder(null)} className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                  <button onClick={handleConfirmReorder} disabled={!reorderProject} className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">Confirm Reorder</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    )
  }

  // ── Empty state ──
  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div><h1 className="font-heading text-4xl font-normal mb-2">Orders</h1><p className="text-lg text-muted">Track your past and current orders.</p></div>
        <div className="bg-white rounded-sm p-16 text-center border border-placeholder">
          <div className="flex justify-center mb-4"><ShoppingBag size={64} className="text-placeholder" /></div>
          <h3 className="font-heading text-2xl font-normal mb-2">No orders yet</h3>
          <p className="text-muted">Your orders will appear here once you place your first order.</p>
        </div>
      </div>
    )
  }

  // ── Table View ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-normal mb-2">Orders</h1>
          <p className="text-lg text-muted">Track your past and current orders.</p>
        </div>
        <button onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 border-2 border-placeholder text-muted rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors">
          <FileDown size={16} /> Export CSV
        </button>
      </div>

      {/* Project filter banner */}
      {projectFilter && (
        <div className="bg-gold/5 border border-gold/20 rounded-sm px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Showing orders for </span>
            <span className="font-semibold text-text">{projectFilter}</span>
            <span className="text-muted mx-2">—</span>
            <span className="font-semibold text-gold">{fmt(projectTotal)}</span>
            <span className="text-muted text-sm ml-1">combined total</span>
          </div>
          <button onClick={() => setProjectFilter('')} className="text-xs font-semibold text-gold hover:underline">Clear filter</button>
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-sm p-6 border border-placeholder">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Total Orders</p>
          <p className="font-heading text-3xl font-normal">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-sm p-6 border border-placeholder">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Total Spent</p>
          <p className="font-heading text-3xl font-normal">{fmt(totalSpent)}</p>
        </div>
        <div className="bg-white rounded-sm p-6 border border-placeholder">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Amount Saved</p>
          <p className="font-heading text-3xl font-normal text-gold">{fmt(totalSaved)}</p>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-white rounded-sm p-6 border border-placeholder flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/5 rounded-sm flex items-center justify-center">
            <CreditCard size={24} className="text-gold" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Payment Method on File</p>
            <p className="font-semibold text-text">Visa ending in 4242 <span className="text-muted font-normal">— Exp 09/27</span></p>
          </div>
        </div>
        <button onClick={() => setShowPaymentModal(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">
          Update Payment Method
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-sm p-4 border border-placeholder space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex gap-2 border-b border-placeholder pb-4 overflow-x-auto">
            {['All', 'Processing', 'Shipped', 'Delivered', 'Invoices'].map(tab => (
              <button key={tab} onClick={() => { setStatusFilter(tab); setSelectedIds(new Set()) }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-1.5 ${
                  statusFilter === tab ? 'bg-gold text-white' : 'text-text hover:bg-gray-50'
                }`}>
                {tab === 'Invoices' && <FileText size={14} />}
                {tab}
              </button>
            ))}
          </div>
          {statusFilter !== 'Invoices' && (
            <div className="flex gap-2 ml-auto items-end">
              {/* Projects filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-1">Project</label>
                <div className="relative">
                  <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
                    className="px-3 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors text-sm appearance-none pr-8 min-w-[160px]">
                    <option value="">All Projects</option>
                    {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-3 text-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-1">From</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-1">To</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>
              {(startDate || endDate) && (
                <button onClick={() => { setStartDate(''); setEndDate('') }}
                  className="px-3 py-2 text-xs font-semibold text-muted hover:text-gold transition-colors">Clear</button>
              )}
            </div>
          )}
        </div>
        {/* Search */}
        {statusFilter !== 'Invoices' && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-muted" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number or product name..."
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && statusFilter !== 'Invoices' && (
        <div className="bg-gold/5 border border-gold/20 rounded-sm px-6 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm text-text font-semibold">{selectedIds.size} order{selectedIds.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-5">
            <button onClick={handleBulkDownload}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold hover:underline">
              <Download size={14} /> Download Invoices
            </button>
            <button onClick={() => { handleExportCsv(); setSelectedIds(new Set()) }}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold hover:underline">
              <FileDown size={14} /> Export Selected
            </button>
            <button onClick={() => setSelectedIds(new Set())}
              className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-text transition-colors">
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      {statusFilter === 'Invoices' ? (
        <div className="bg-white rounded-sm border border-placeholder overflow-hidden">
          <table className="w-full">
            <thead className="bg-white border-b border-placeholder">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Invoice #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Order #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Date Issued</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Due Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-muted">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Action</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-placeholder hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-body font-semibold text-text">{inv.id}</td>
                  <td className="px-6 py-4 text-gold font-semibold text-sm cursor-pointer">{inv.orderId}</td>
                  <td className="px-6 py-4 text-text text-sm">{inv.dateIssued}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${inv.status === 'Overdue' ? 'text-red-600' : 'text-text'}`}>{inv.dueDate}</td>
                  <td className="px-6 py-4 font-body font-semibold text-text text-right">{fmt(inv.amount)}</td>
                  <td className="px-6 py-4"><span className={`inline-block px-3 py-1 rounded-sm text-xs font-semibold ${getInvoiceStatusColor(inv.status)}`}>{inv.status}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => setToast(`Invoice ${inv.id} downloaded`)} className="text-xs font-semibold text-gold hover:underline uppercase tracking-widest">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Orders Table (desktop) + Cards (mobile) */
        <div>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-sm border border-placeholder p-12 text-center"><p className="text-muted">No orders match your filters.</p></div>
          ) : (
            <>
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((order) => (
                <div key={order.id} onClick={() => setDetailOrder(order)}
                  className="bg-white rounded-sm border border-placeholder p-4 hover:border-gold transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body font-semibold text-text">{order.id}</span>
                    <span className={`inline-block px-3 py-1 rounded-sm text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <p className="text-sm text-text mb-2 truncate">{order.items}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{order.date}</span>
                    <span className="font-semibold text-text">{fmt(order.total)}</span>
                  </div>
                  {order.project && <p className="text-xs text-gold font-semibold mt-2">{order.project}</p>}
                </div>
              ))}
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-sm border border-placeholder overflow-hidden">
            <table className="w-full">
              <thead className="bg-white border-b border-placeholder">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll} className="w-4 h-4 accent-gold cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted whitespace-nowrap min-w-[100px]">Order #</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('date')}>
                    Date <SortIcon field="date" />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Items</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Project</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('total')}>
                    Total <SortIcon field="total" />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, idx) => (
                  <tr key={order.id} onClick={() => setDetailOrder(order)}
                    className={`border-b border-placeholder hover:bg-[#faf8f5] transition-colors cursor-pointer ${idx % 2 === 1 ? 'bg-[#fafaf9]' : 'bg-white'}`}>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelect(order.id)} className="w-4 h-4 accent-gold cursor-pointer" />
                    </td>
                    <td className="px-4 py-4 font-body font-semibold text-text whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-text text-sm block">{order.date}</span>
                      <span className="text-muted text-xs">Est. delivery {order.estimatedDelivery}</span>
                    </td>
                    <td className="px-4 py-4 text-text text-sm">{order.items}</td>
                    <td className="px-4 py-4 text-sm relative" onClick={(e) => e.stopPropagation()}>
                      {order.project ? (
                        <button onClick={() => setProjectFilter(order.project)} className="text-gold font-semibold hover:underline">{order.project}</button>
                      ) : (
                        <div className="relative">
                          <button onClick={() => setAssignDropdown(assignDropdown === order.id ? null : order.id)}
                            className="text-xs font-semibold text-gold hover:underline">+ Assign</button>
                          {assignDropdown === order.id && (
                            <div className="absolute left-0 top-full mt-1 bg-white border border-placeholder rounded-sm shadow-lg z-20 w-56">
                              {PROJECTS.map(p => (
                                <button key={p} onClick={() => handleAssignProject(order.id, p)}
                                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-gray-50 transition-colors">{p}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 font-body font-semibold text-text whitespace-nowrap">{fmt(order.total)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-3 py-1 rounded-sm text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <Tooltip text="Download Invoice">
                          <button onClick={(e) => { e.stopPropagation(); handleDownloadInvoice(order.id, e) }}
                            className="p-2 hover:bg-gold/10 rounded-sm transition-colors">
                            <Download size={16} className="text-muted" />
                          </button>
                        </Tooltip>
                        {(order.status === 'Shipped' || order.status === 'Processing') && (
                          <Tooltip text="Track Shipment">
                            <button onClick={(e) => { e.stopPropagation(); setTrackingOrder(order) }}
                              className="p-2 hover:bg-gold/10 rounded-sm transition-colors">
                              <Navigation size={16} className="text-gold" />
                            </button>
                          </Tooltip>
                        )}
                        <Tooltip text="Reorder">
                          <button onClick={(e) => { e.stopPropagation(); setReorderOrder(order); setReorderProject('') }}
                            className="p-2 hover:bg-gold/10 rounded-sm transition-colors">
                            <RotateCcw size={16} className="text-muted" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </>
          )}
        </div>
      )}

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Track Shipment</h2>
              <button onClick={() => setTrackingOrder(null)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
            </div>
            <p className="text-sm text-muted mb-6">{trackingOrder.id} — {trackingOrder.items}</p>
            {trackingOrder.carrier ? (
              <div className="space-y-4">
                <div className="bg-white rounded-sm p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Carrier</p>
                  <p className="text-lg font-semibold text-text flex items-center gap-2"><Truck size={18} />{trackingOrder.carrier}</p>
                </div>
                <div className="bg-white rounded-sm p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Tracking Number</p>
                  <a href={carrierUrl(trackingOrder.carrier, trackingOrder.trackingNumber)} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.preventDefault()} className="text-gold font-mono text-sm hover:underline">{trackingOrder.trackingNumber}</a>
                </div>
                {trackingOrder.status === 'Delivered' && trackingOrder.deliveredDate ? (
                  <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-sm">
                    <CheckCircle size={20} className="text-green-600" />
                    <div><p className="text-sm font-semibold text-green-800">Delivered</p><p className="text-xs text-green-700">{trackingOrder.deliveredDate}</p></div>
                  </div>
                ) : (
                  <a href={carrierUrl(trackingOrder.carrier, trackingOrder.trackingNumber)} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.preventDefault()} className="btn-primary w-full text-center block py-3">
                    Track on {trackingOrder.carrier}
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-sm p-8 text-center">
                <Package size={32} className="text-placeholder mx-auto mb-3" />
                <p className="text-muted text-sm">This order is still being processed. Tracking info will be available once shipped.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {reorderOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Reorder Items</h2>
              <button onClick={() => setReorderOrder(null)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
            </div>
            <div className="mb-6 pb-6 border-b border-placeholder">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Original Items</p>
              <div className="space-y-2">
                {reorderOrder.lineItems.map((li, idx) => (
                  <div key={idx} className="flex justify-between text-sm"><span className="text-text">{li.description}</span><span className="text-muted font-semibold">x{li.qty}</span></div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-placeholder flex justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">Total</span>
                <span className="font-semibold text-text">{fmt(reorderOrder.total)}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Assign to Project</label>
                <div className="relative">
                  <select value={reorderProject} onChange={(e) => setReorderProject(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                    <option value="">-- Choose a project --</option>
                    {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-3.5 text-muted pointer-events-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setReorderOrder(null)} className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                <button onClick={handleConfirmReorder} disabled={!reorderProject} className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">Confirm Reorder</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Update Payment Method</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Card Number</label>
                <input type="text" value={paymentForm.cardNumber} onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                  placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Expiry</label>
                  <input type="text" value={paymentForm.expiry} onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                    placeholder="MM/YY" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">CVV</label>
                  <input type="text" value={paymentForm.cvv} onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                    placeholder="123" className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSavePayment} className="flex-1 btn-primary py-3">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
