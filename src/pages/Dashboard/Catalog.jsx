import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Check, Grid3X3, List, ChevronDown, X, ExternalLink, Heart, Plus, Minus } from 'lucide-react'

function Toast({ message, action, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-fade-in">
      <Check size={16} className="text-green-400" />
      <span className="font-body text-sm">{message}</span>
      {action}
    </div>
  )
}

const PRODUCTS = [
  { id: 1, name: 'Mallorca White Shaker 36"W Base Cabinet', line: 'Mallorca', type: 'Base', finish: 'White Shaker', retail: 525.55, trade: 394.16, image: 'https://img-va.myshopline.com/image/store/1736838390436/Mallorca-White-Shaker-Banner.png?w=400&h=400', url: 'https://www.pkcabinet.com/products/mallorca-white-shaker-36w-base' },
  { id: 2, name: 'Mallorca Dolphin Gray 36"W Base Cabinet', line: 'Mallorca', type: 'Base', finish: 'Gray Shaker', retail: 876.19, trade: 657.14, image: 'https://img-va.myshopline.com/image/store/1736838390436/2DB36-gray-shaker-(2).jpg?w=400&h=400', url: 'https://www.pkcabinet.com/products/white-box-gray-shaker-36w-drawer-base-cabinet-2-drawers' },
  { id: 3, name: 'Shady Slim White Shaker 36"W Wall Cabinet', line: 'Shady', type: 'Wall', finish: 'White Shaker', retail: 600.92, trade: 450.69, image: 'https://img-va.myshopline.com/image/store/1736838390436/W3642-white-slim-(2)_400x.jpg?w=400&h=400', url: 'https://www.pkcabinet.com/products/shady-slim-white-shaker-36w-wall-cabinet' },
  { id: 4, name: 'Shady Slim Gray Shaker 36"W Wall Cabinet', line: 'Shady', type: 'Wall', finish: 'Gray Shaker', retail: 661.47, trade: 496.10, image: 'https://img-va.myshopline.com/image/store/1736838390436/W3642-gray-slim-(2)_400x.jpg?w=400&h=400', url: 'https://www.pkcabinet.com/products/shady-slim-gray-shaker-36w-wall-cabinet' },
  { id: 5, name: 'Franco White Shaker 36"W Base Cabinet', line: 'Franco', type: 'Base', finish: 'White Shaker', retail: 578.51, trade: 433.88, image: 'https://img-va.myshopline.com/image/store/1736838390436/white-shaker-banner.jpg?w=400&h=400', url: 'https://www.pkcabinet.com/products/franco-white-shaker-36w-base' },
  { id: 6, name: 'Irena Cream White Dual Shaker 36"W Base', line: 'Irena', type: 'Base', finish: 'Cream', retail: 612.00, trade: 459.00, image: 'https://img-va.myshopline.com/image/store/1736838390436/creamy-white-banner.jpg?w=400&h=400', url: 'https://www.pkcabinet.com/products/irena-cream-dual-shaker-36w-base' },
  { id: 7, name: 'Newport Natural Oak 36"W Base Cabinet', line: 'Newport', type: 'Base', finish: 'Natural Oak', retail: 743.00, trade: 557.25, image: 'https://img-va.myshopline.com/image/store/1736838390436/Umbria-Elm-banner.jpg?w=400&h=400', url: 'https://www.pkcabinet.com/products/newport-natural-oak-36w-base' },
  { id: 8, name: 'Aspen Raven 36"W Base Cabinet', line: 'Aspen', type: 'Base', finish: 'Raven', retail: 698.00, trade: 523.50, image: 'https://img-va.myshopline.com/image/store/1736838390436/RAVEN-banner.jpg?w=400&h=400', url: 'https://www.pkcabinet.com/products/aspen-raven-36w-base' },
]

const LINES = ['Mallorca', 'Shady', 'Franco', 'Irena', 'Newport', 'Aspen']
const TYPES = ['Base', 'Wall', 'Tall', 'Accessories']
const FINISHES = ['White Shaker', 'Gray Shaker', 'Natural Oak', 'Raven', 'Cream']
const fmt = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export default function Catalog() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [gridView, setGridView] = useState(true)
  const [lineFilters, setLineFilters] = useState(new Set())
  const [typeFilters, setTypeFilters] = useState(new Set())
  const [finishFilters, setFinishFilters] = useState(new Set())
  const [maxPrice, setMaxPrice] = useState(2000)
  const [toast, setToast] = useState(null)
  const [toastAction, setToastAction] = useState(null)

  const [saved, setSaved] = useState(new Set())
  const [compareIds, setCompareIds] = useState(new Set())
  const [showCompare, setShowCompare] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [qtyPopover, setQtyPopover] = useState(null)
  const [qtyVal, setQtyVal] = useState(1)
  const popRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (popRef.current && !popRef.current.contains(e.target)) setQtyPopover(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const toggleFilter = (set, setter, val) => {
    setter(prev => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })
  }
  const clearFilters = () => { setLineFilters(new Set()); setTypeFilters(new Set()); setFinishFilters(new Set()); setMaxPrice(2000); setSearch('') }

  const toggleSave = (id) => setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleCompare = (id) => setCompareIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const trackView = (p) => setRecentlyViewed(prev => [p.id, ...prev.filter(id => id !== p.id)].slice(0, 4))

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      if (lineFilters.size && !lineFilters.has(p.line)) return false
      if (typeFilters.size && !typeFilters.has(p.type)) return false
      if (finishFilters.size && !finishFilters.has(p.finish)) return false
      if (p.trade > maxPrice) return false
      if (search) { const q = search.toLowerCase(); if (!p.name.toLowerCase().includes(q) && !p.line.toLowerCase().includes(q)) return false }
      return true
    })
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.trade - b.trade); break
      case 'price-desc': result.sort((a, b) => b.trade - a.trade); break
      case 'newest': result.sort((a, b) => b.id - a.id); break
      default: break
    }
    return result
  }, [search, sort, lineFilters, typeFilters, finishFilters, maxPrice])

  const openQtyPopover = (p) => { setQtyPopover(p.id); setQtyVal(1) }

  const confirmAdd = (p) => {
    setQtyPopover(null)
    setToast(`${qtyVal}x ${p.name} added to quote`)
    setToastAction(<button onClick={() => { navigate('/dashboard/quick-quote'); setToast(null) }} className="text-gold text-xs font-semibold hover:underline ml-2 whitespace-nowrap">View Quote →</button>)
  }

  const compareProducts = Array.from(compareIds).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)
  const recentProducts = recentlyViewed.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)

  const FilterSection = ({ title, items, selected, onToggle }) => (
    <div className="mb-6">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map(item => (
          <label key={item} className="flex items-center gap-2.5 cursor-pointer text-sm text-text hover:text-gold transition-colors">
            <input type="checkbox" checked={selected.has(item)} onChange={() => onToggle(item)} className="w-3.5 h-3.5 accent-gold cursor-pointer" />
            {item}
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-4xl font-normal mb-2">Product Catalog</h1>
        <p className="text-lg text-muted">Browse PK Cabinet lines at your trade pricing.</p>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar Filters — hidden on mobile */}
        <div className="hidden md:block w-[220px] shrink-0">
          <div className="sticky top-6 bg-white rounded-sm border border-placeholder p-5">
            <h3 className="font-body font-bold text-sm mb-5 pb-3 border-b border-placeholder">Filters</h3>
            <FilterSection title="Cabinet Line" items={LINES} selected={lineFilters} onToggle={(v) => toggleFilter(lineFilters, setLineFilters, v)} />
            <FilterSection title="Cabinet Type" items={TYPES} selected={typeFilters} onToggle={(v) => toggleFilter(typeFilters, setTypeFilters, v)} />
            <FilterSection title="Finish" items={FINISHES} selected={finishFilters} onToggle={(v) => toggleFilter(finishFilters, setFinishFilters, v)} />
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Price Range</h4>
              <input type="range" min="0" max="2000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-gold cursor-pointer" />
              <div className="flex justify-between text-xs text-muted mt-1"><span>$0</span><span className="font-semibold text-text">{fmt(maxPrice)}</span></div>
            </div>
            <button onClick={clearFilters} className="text-xs font-semibold text-gold hover:underline uppercase tracking-widest">Clear All Filters</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-2.5 text-muted" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
            </div>
            {saved.size > 0 && (
              <button onClick={() => { setLineFilters(new Set()); setSearch(''); /* could filter to saved */ }}
                className="flex items-center gap-1.5 px-3 py-2 border border-gold text-gold rounded-sm text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">
                <Heart size={12} fill="currentColor" /> Saved ({saved.size})
              </button>
            )}
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-xs font-semibold uppercase tracking-widest pr-8">
                <option value="featured">Featured</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-3 text-muted pointer-events-none" />
            </div>
            <span className="text-xs text-muted whitespace-nowrap">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            <div className="flex border border-placeholder rounded-sm overflow-hidden">
              <button onClick={() => setGridView(true)} className={`p-2 transition-colors ${gridView ? 'bg-gold text-white' : 'text-muted hover:bg-gray-50'}`}><Grid3X3 size={16} /></button>
              <button onClick={() => setGridView(false)} className={`p-2 transition-colors ${!gridView ? 'bg-gold text-white' : 'text-muted hover:bg-gray-50'}`}><List size={16} /></button>
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-sm p-16 text-center border border-placeholder">
              <p className="text-muted mb-4">No products match your filters.</p>
              <button onClick={clearFilters} className="text-xs font-semibold text-gold hover:underline uppercase tracking-widest">Clear Filters</button>
            </div>
          ) : gridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filtered.map(p => (
                <div key={p.id} className="bg-white rounded-sm border border-placeholder hover:border-gold hover:shadow-lg transition-all group overflow-hidden relative">
                  {/* Image */}
                  <div className="relative h-56 bg-[#f5f2ee] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
                      onClick={() => trackView(p)} />
                    {/* 25% OFF badge */}
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm">25% Off</span>
                    {/* Save heart */}
                    <button onClick={() => toggleSave(p.id)}
                      className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                      <Heart size={16} className={saved.has(p.id) ? 'text-gold fill-gold' : 'text-muted'} />
                    </button>
                    {/* External link — hover only */}
                    <a href={p.url} target="_blank" rel="noopener noreferrer" title="View on PK Cabinets"
                      className="absolute top-3 right-12 p-1.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                      <ExternalLink size={14} className="text-muted" />
                    </a>
                  </div>
                  {/* Body */}
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold">{p.line}</span>
                    <h3 className="font-body font-bold text-sm mt-0.5 mb-2 leading-snug group-hover:text-gold transition-colors">{p.name}</h3>
                    {/* Pricing + Add to Quote row */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-muted line-through block">{fmt(p.retail)}</span>
                        <span className="text-lg font-heading text-gold">{fmt(p.trade)}</span>
                      </div>
                      <div className="relative" ref={qtyPopover === p.id ? popRef : undefined}>
                        <button onClick={() => openQtyPopover(p)}
                          className="btn-primary text-xs py-1.5 px-3">Add to Quote</button>
                        {qtyPopover === p.id && (
                          <div className="absolute bottom-full right-0 mb-2 bg-white border border-placeholder rounded-sm shadow-lg p-3 w-40 z-20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-muted uppercase tracking-widest">Qty</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => setQtyVal(Math.max(1, qtyVal - 1))} className="p-1 border border-gray-300 rounded-sm hover:border-gold"><Minus size={12} /></button>
                                <span className="w-8 text-center text-sm font-semibold">{qtyVal}</span>
                                <button onClick={() => setQtyVal(qtyVal + 1)} className="p-1 border border-gray-300 rounded-sm hover:border-gold"><Plus size={12} /></button>
                              </div>
                            </div>
                            <button onClick={() => confirmAdd(p)} className="btn-primary w-full text-center py-1.5 text-xs">Add {qtyVal} to Quote</button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Compare */}
                    <label className="flex items-center gap-2 mt-3 cursor-pointer">
                      <input type="checkbox" checked={compareIds.has(p.id)} onChange={() => toggleCompare(p.id)} className="w-3.5 h-3.5 accent-gold cursor-pointer" />
                      <span className="text-xs text-muted">Compare</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filtered.map(p => (
                <div key={p.id} className="bg-white rounded-sm border border-placeholder hover:border-gold hover:shadow-md transition-all flex overflow-hidden group relative">
                  <div className="w-32 h-32 bg-[#f5f2ee] shrink-0 overflow-hidden relative" onClick={() => trackView(p)}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm">25% Off</span>
                  </div>
                  <div className="flex-1 p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold">{p.line} — {p.type}</span>
                      <h3 className="font-body font-bold text-sm mt-0.5 group-hover:text-gold transition-colors">{p.name}</h3>
                      <label className="flex items-center gap-2 mt-1 cursor-pointer">
                        <input type="checkbox" checked={compareIds.has(p.id)} onChange={() => toggleCompare(p.id)} className="w-3 h-3 accent-gold cursor-pointer" />
                        <span className="text-xs text-muted">Compare</span>
                      </label>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-muted line-through block">{fmt(p.retail)}</span>
                      <span className="text-lg font-heading text-gold">{fmt(p.trade)}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleSave(p.id)} className="p-2 hover:bg-gray-50 rounded-sm">
                        <Heart size={16} className={saved.has(p.id) ? 'text-gold fill-gold' : 'text-muted'} />
                      </button>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-50 rounded-sm" title="View on PK Cabinets">
                        <ExternalLink size={14} className="text-muted" />
                      </a>
                      <div className="relative" ref={qtyPopover === p.id ? popRef : undefined}>
                        <button onClick={() => openQtyPopover(p)} className="btn-primary py-1.5 px-3 text-xs">Add to Quote</button>
                        {qtyPopover === p.id && (
                          <div className="absolute bottom-full right-0 mb-2 bg-white border border-placeholder rounded-sm shadow-lg p-3 w-40 z-20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-muted uppercase tracking-widest">Qty</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => setQtyVal(Math.max(1, qtyVal - 1))} className="p-1 border border-gray-300 rounded-sm hover:border-gold"><Minus size={12} /></button>
                                <span className="w-8 text-center text-sm font-semibold">{qtyVal}</span>
                                <button onClick={() => setQtyVal(qtyVal + 1)} className="p-1 border border-gray-300 rounded-sm hover:border-gold"><Plus size={12} /></button>
                              </div>
                            </div>
                            <button onClick={() => confirmAdd(p)} className="btn-primary w-full text-center py-1.5 text-xs">Add {qtyVal} to Quote</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recently Viewed */}
          {recentProducts.length > 0 && (
            <div className="mt-10 pt-8 border-t border-placeholder">
              <h2 className="font-heading text-2xl font-normal mb-4">Recently Viewed</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentProducts.map(p => (
                  <div key={p.id} className="w-48 shrink-0 bg-white rounded-sm border border-placeholder overflow-hidden hover:border-gold transition-colors">
                    <div className="h-32 bg-[#f5f2ee] overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold">{p.line}</span>
                      <p className="text-xs font-semibold text-text truncate mt-0.5">{p.name}</p>
                      <p className="text-sm font-heading text-gold mt-1">{fmt(p.trade)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compare Bar */}
      {compareIds.size >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-placeholder shadow-lg z-30 px-8 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm font-semibold text-text">Comparing {compareIds.size} products</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setCompareIds(new Set())} className="text-xs font-semibold text-muted hover:text-text uppercase tracking-widest">Clear</button>
            <button onClick={() => setShowCompare(true)} className="btn-primary text-xs py-2 px-4">Compare Now</button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-3xl w-full mx-4 border border-placeholder max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Compare Products</h2>
              <button onClick={() => setShowCompare(false)} className="p-1 hover:bg-gray-50 rounded-sm"><X size={20} className="text-muted" /></button>
            </div>
            <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${compareProducts.length}, 1fr)` }}>
              {compareProducts.map(p => (
                <div key={p.id} className="text-center">
                  <div className="h-40 bg-[#f5f2ee] rounded-sm overflow-hidden mb-4">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-body font-bold text-sm mb-4">{p.name}</h3>
                  <div className="space-y-3 text-left">
                    {[
                      ['Line', p.line],
                      ['Type', p.type],
                      ['Finish', p.finish],
                      ['Retail', <span className="line-through text-muted">{fmt(p.retail)}</span>],
                      ['Trade Price', <span className="text-gold font-semibold">{fmt(p.trade)}</span>],
                      ['Savings', <span className="text-green-700 font-semibold">{fmt(p.retail - p.trade)}</span>],
                    ].map(([label, val], i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-placeholder pb-2 last:border-b-0">
                        <span className="text-muted">{label}</span>
                        <span className="text-text font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} action={toastAction} onClose={() => { setToast(null); setToastAction(null) }} />}
    </div>
  )
}
