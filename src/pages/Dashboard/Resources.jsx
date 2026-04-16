import { useState, useEffect } from 'react'
import { FileText, Wrench, Image, Download, Ruler, Play, Search, X, Check, BarChart3, ClipboardList, FileSpreadsheet, Shield, Heart } from 'lucide-react'

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

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showSampleModal, setShowSampleModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [sampleRequest, setSampleRequest] = useState({ name: '', email: '', phone: '', address: '', finishes: [] })

  const finishOptions = ['Maple', 'Oak', 'Cherry', 'Walnut', 'White Paint', 'Gray Paint']

  const resources = [
    { title: 'Cabinet Spec Sheets', description: 'Complete specifications, dimensions, and finishes for all cabinet collections.', icon: FileText, action: 'Download PDF', category: 'Product Specs', lastUpdated: 'March 2026', isNew: true },
    { title: 'Cabinet Line Comparison Chart', description: 'Side-by-side comparison of all PK Cabinet lines — style, price, lead time.', icon: BarChart3, action: 'Download PDF', category: 'Product Specs', lastUpdated: 'April 2026', isNew: true },
    { title: 'Installation Guides', description: 'Step-by-step installation instructions and best practices for all cabinet types.', icon: Wrench, action: 'Download PDF', category: 'Installation', lastUpdated: 'February 2026' },
    { title: 'Measurement Checklist', description: 'Step-by-step checklist to accurately measure your space before ordering.', icon: ClipboardList, action: 'Download PDF', category: 'Installation', lastUpdated: 'March 2026' },
    { title: 'Homeowner Care Guide', description: 'Cabinet care and maintenance instructions to hand off after installation.', icon: Heart, action: 'Download PDF', category: 'Installation', lastUpdated: 'March 2026' },
    { title: 'Marketing Materials', description: 'High-resolution images, brochures, and marketing assets for your clients.', icon: Image, action: 'Download ZIP', category: 'Marketing', lastUpdated: 'March 2026' },
    { title: 'Pricing & Volume Discounts', description: 'Current trade pricing, volume discount tiers, and special offers.', icon: Download, action: 'Download PDF', category: 'Pricing', lastUpdated: 'March 2026' },
    { title: 'Design Templates', description: 'Editable design templates and layout guides for common kitchen configurations.', icon: Ruler, action: 'Download Files', category: 'Templates', lastUpdated: 'January 2026' },
    { title: 'Bulk Order Template', description: 'Pre-formatted CSV template for submitting large cabinet orders.', icon: FileSpreadsheet, action: 'Download CSV', category: 'Templates', lastUpdated: 'March 2026' },
    { title: 'Warranty Documentation', description: 'Full warranty terms and coverage details to share with your clients.', icon: Shield, action: 'Download PDF', category: 'Product Specs', lastUpdated: 'February 2026' },
    { title: 'Color & Finish Selector', description: 'Interactive tool showing all available finishes with live previews.', icon: Image, action: 'Request Samples', category: 'Product Specs', lastUpdated: 'March 2026' },
  ]

  const videos = [
    { title: 'Cabinet Measurement Guide', duration: '8:45' },
    { title: 'Installation Walkthrough', duration: '15:30' },
    { title: 'Finish & Hardware Selection', duration: '6:20' },
  ]

  const categories = ['All', 'Product Specs', 'Installation', 'Marketing', 'Pricing', 'Templates', 'Videos']

  let filteredResources = resources
  if (selectedCategory !== 'All' && selectedCategory !== 'Videos') {
    filteredResources = resources.filter(r => r.category === selectedCategory)
  }
  if (searchQuery) {
    filteredResources = filteredResources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const handleFinishToggle = (finish) => {
    setSampleRequest(prev => ({
      ...prev,
      finishes: prev.finishes.includes(finish) ? prev.finishes.filter(f => f !== finish) : [...prev.finishes, finish]
    }))
  }

  const handleSubmitSampleRequest = () => {
    if (sampleRequest.name && sampleRequest.email && sampleRequest.finishes.length > 0) {
      setShowSampleModal(false)
      setSampleRequest({ name: '', email: '', phone: '', address: '', finishes: [] })
      setToast('Sample request submitted! We\'ll contact you within 2 business days.')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-4xl font-normal mb-2">Resources</h1>
        <p className="text-lg text-muted">Download materials to help you design and market cabinet projects.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-3 text-muted" />
        <input type="text" placeholder="Search resources by name..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-placeholder pb-4 overflow-x-auto">
        {categories.map(category => (
          <button key={category} onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors whitespace-nowrap ${
              selectedCategory === category ? 'bg-gold text-white' : 'text-text hover:bg-gray-50'
            }`}>
            {category}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {selectedCategory !== 'Videos' && (
        filteredResources.length === 0 ? (
          <div className="bg-white rounded-sm p-16 text-center border border-placeholder">
            <p className="text-muted">No resources found matching your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredResources.map((resource, idx) => {
              const Icon = resource.icon
              return (
                <div key={idx} className="bg-white rounded-sm p-8 border border-placeholder hover:border-gold hover:shadow-md transition-all relative flex flex-col">
                  {resource.isNew && (
                    <span className="absolute top-4 right-4 bg-gold text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">New</span>
                  )}
                  <div className="text-gold mb-4"><Icon size={36} /></div>
                  <h3 className="font-body font-bold text-lg mb-3">{resource.title}</h3>
                  <p className="text-muted text-sm mb-3 flex-1">{resource.description}</p>
                  <p className="text-xs text-muted mb-6">Updated {resource.lastUpdated}</p>
                  {resource.action === 'Request Samples' ? (
                    <button onClick={() => setShowSampleModal(true)} className="btn-primary text-xs py-2 px-4 self-start">Request Samples</button>
                  ) : (
                    <button onClick={() => setToast(`${resource.title} downloaded`)} className="btn-primary text-xs py-2 px-4 self-start">{resource.action}</button>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Videos Section */}
      {(selectedCategory === 'All' || selectedCategory === 'Videos') && (
        <div className={selectedCategory === 'All' ? 'mt-8 pt-8 border-t border-placeholder' : ''}>
          <h2 className="font-heading text-3xl font-normal mb-8">Video Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {videos.map((video, idx) => (
              <div key={idx} className="bg-white rounded-sm overflow-hidden border border-placeholder hover:border-gold hover:shadow-md transition-all group">
                {/* Video Thumbnail */}
                <div className="relative bg-[#e8e3de] aspect-video flex items-center justify-center overflow-hidden">
                  <svg width="56" height="56" viewBox="0 0 56 56" className="opacity-60 group-hover:opacity-100 transition-opacity">
                    <circle cx="28" cy="28" r="27" fill="none" stroke="#a89060" strokeWidth="2" />
                    <polygon points="22,18 22,38 40,28" fill="#a89060" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-body font-bold text-base mb-2 group-hover:text-gold transition-colors">{video.title}</h3>
                  <p className="text-xs text-muted mb-4">Duration: {video.duration}</p>
                  <button className="btn-primary text-xs py-2 px-4">Watch Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Request Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-lg w-full mx-4 border border-placeholder max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Request Samples</h2>
              <button onClick={() => setShowSampleModal(false)} className="text-muted hover:text-text transition-colors"><X size={24} /></button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Full Name *</label>
                <input type="text" value={sampleRequest.name} onChange={(e) => setSampleRequest({ ...sampleRequest, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Email Address *</label>
                <input type="email" value={sampleRequest.email} onChange={(e) => setSampleRequest({ ...sampleRequest, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Phone Number</label>
                <input type="tel" value={sampleRequest.phone} onChange={(e) => setSampleRequest({ ...sampleRequest, phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Shipping Address *</label>
                <textarea value={sampleRequest.address} onChange={(e) => setSampleRequest({ ...sampleRequest, address: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm resize-none" rows="2" placeholder="Street, city, state, zip"></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">Select Finishes *</label>
                <div className="space-y-2">
                  {finishOptions.map(finish => (
                    <label key={finish} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-sm transition-colors">
                      <input type="checkbox" checked={sampleRequest.finishes.includes(finish)} onChange={() => handleFinishToggle(finish)} className="w-4 h-4 accent-gold cursor-pointer" />
                      <span className="text-sm text-text font-medium">{finish}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowSampleModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors text-sm">Cancel</button>
                <button type="button" onClick={handleSubmitSampleRequest}
                  className="flex-1 btn-primary py-3 text-sm">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
