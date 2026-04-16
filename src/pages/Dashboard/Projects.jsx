import { useState, useEffect } from 'react'
import { Plus, Search, ChevronDown, Circle, MoreVertical, Trash2, Copy, Archive, Edit2, ArrowLeft, Share2, Link, Check, X, FolderOpen, LinkIcon, Camera, Clock, AlertTriangle } from 'lucide-react'

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

const getUrgency = (installDate, status) => {
  if (status === 'Completed' || status === 'Archived') return null
  const now = new Date()
  const install = new Date(installDate)
  const diffDays = Math.ceil((install - now) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: 'Overdue', bg: 'bg-red-100', text: 'text-red-800' }
  if (diffDays <= 14) return { label: 'Due Soon', bg: 'bg-amber-100', text: 'text-amber-800', days: diffDays }
  return null
}

export default function Projects() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Modern Kitchen Remodel', clientName: 'Johnson Family', dateCreated: 'Mar 10, 2026', cabinetCount: 12, estimate: '$18,500', status: 'Active', completion: 65, installationDate: 'Apr 20, 2026', orderNumber: 'ORD-001', notes: 'Client prefers shaker-style doors in warm walnut. Island needs custom sizing for 10ft span.' },
    { id: 2, name: 'Bathroom Vanity Refresh', clientName: 'Smith Residence', dateCreated: 'Mar 5, 2026', cabinetCount: 2, estimate: '$3,200', status: 'Ordered', completion: 30, installationDate: 'Apr 10, 2026', orderNumber: 'ORD-002', notes: 'Double vanity with soft-close drawers. White oak finish.' },
    { id: 3, name: 'Island Cabinet Installation', clientName: 'Martinez Homes', dateCreated: 'Feb 28, 2026', cabinetCount: 1, estimate: '$2,800', status: 'Completed', completion: 100, installationDate: 'Mar 25, 2026', orderNumber: 'ORD-003', notes: 'Standalone island unit with waterfall countertop support. Installation complete.' },
    { id: 4, name: 'Full Home Kitchen + Dining', clientName: 'Williams Estate', dateCreated: 'Feb 20, 2026', cabinetCount: 18, estimate: '$24,900', status: 'Active', completion: 40, installationDate: 'May 5, 2026', orderNumber: null, notes: 'Large-scale project spanning kitchen and dining built-ins. Awaiting final countertop selection.' },
    { id: 5, name: 'Commercial Kitchen Renovation', clientName: 'Restaurant Group Co.', dateCreated: 'Feb 15, 2026', cabinetCount: 25, estimate: '$42,000', status: 'On Hold', completion: 10, installationDate: 'Jun 1, 2026', orderNumber: null, notes: 'Project paused pending permit approval. Commercial-grade stainless steel cabinet fronts.' },
  ])

  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Newest')
  const [showModal, setShowModal] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAttachOrder, setShowAttachOrder] = useState(false)
  const [attachOrderId, setAttachOrderId] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [editingNotes, setEditingNotes] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [toast, setToast] = useState(null)

  const unlinkedOrders = [
    { id: 'ORD-004', items: 'Corner Cabinet + Installation Kit', total: '$3,200.00' },
    { id: 'ORD-006', items: 'Cabinet Hardware & Hinges', total: '$450.00' },
  ]

  const orderSpendMap = { 'ORD-001': 4500, 'ORD-002': 2200, 'ORD-003': 1800, 'ORD-004': 3200, 'ORD-005': 8900, 'ORD-006': 450 }

  const [newProject, setNewProject] = useState({ name: '', clientName: '', installationDate: '', cabinetCount: '', estimate: '', notes: '', status: 'Active' })

  // Filter
  let filtered = projects
  if (filter !== 'All') {
    filtered = projects.filter(p => {
      if (filter === 'Archived') return p.status === 'Archived' || p.status === 'On Hold'
      return p.status === filter
    })
  }
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'Oldest': return new Date(a.dateCreated) - new Date(b.dateCreated)
      case 'Newest': return new Date(b.dateCreated) - new Date(a.dateCreated)
      case 'Highest Value': return parseFloat(b.estimate) - parseFloat(a.estimate)
      case 'Closest Deadline': return new Date(a.installationDate) - new Date(b.installationDate)
      default: return 0
    }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return { bg: 'bg-green-100', text: 'text-green-800' }
      case 'Ordered': return { bg: 'bg-gold/20', text: 'text-gold' }
      case 'Completed': return { bg: 'bg-gray-100', text: 'text-gray-800' }
      case 'On Hold': return { bg: 'bg-red-100', text: 'text-red-800' }
      case 'Archived': return { bg: 'bg-gray-100', text: 'text-muted' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800' }
    }
  }

  const handleAddProject = () => {
    if (newProject.name) {
      setProjects([{ id: Date.now(), ...newProject, dateCreated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), completion: 0, orderNumber: null }, ...projects])
      setNewProject({ name: '', clientName: '', installationDate: '', cabinetCount: '', estimate: '', notes: '', status: 'Active' })
      setShowModal(false)
    }
  }

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id))
    setShowDeleteConfirm(null)
    setOpenMenu(null)
    if (selectedProject && selectedProject.id === id) setSelectedProject(null)
    setToast('Project deleted')
  }

  const handleDuplicateProject = (id) => {
    const project = projects.find(p => p.id === id)
    if (project) setProjects([{ ...project, id: Date.now(), name: `${project.name} (Copy)` }, ...projects])
    setOpenMenu(null)
    setToast('Project duplicated')
  }

  const handleArchiveProject = (id) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: 'Archived' } : p))
    setOpenMenu(null)
    setToast('Project archived')
  }

  const handleEditOpen = (project) => { setEditingProject({ ...project }); setOpenMenu(null) }

  const handleEditSave = () => {
    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p))
    if (selectedProject && selectedProject.id === editingProject.id) setSelectedProject(editingProject)
    setEditingProject(null)
    setToast('Project updated successfully')
  }

  const handleCopyLink = async (project) => {
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    try { await navigator.clipboard.writeText(`pkcabinets.com/projects/${slug}`) } catch {}
    setShowShareModal(false)
    setToast('Link copied to clipboard')
  }

  const handleAttachOrder = () => {
    if (attachOrderId && selectedProject) {
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, orderNumber: attachOrderId } : p))
      setSelectedProject({ ...selectedProject, orderNumber: attachOrderId })
      setShowAttachOrder(false); setAttachOrderId('')
      setToast('Order linked to project')
    }
  }

  const handleNoteSave = () => {
    if (selectedProject) {
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, notes: noteDraft } : p))
      setSelectedProject({ ...selectedProject, notes: noteDraft })
    }
    setEditingNotes(false)
    setToast('Notes saved')
  }

  const handlePhotoUpload = () => setToast('Photo uploaded successfully')

  const pluralize = (count) => count === 1 ? 'unit' : 'units'
  const generateShareUrl = (project) => `pkcabinets.com/projects/${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`

  // Mock timeline for detail view
  const getTimeline = (project) => {
    const entries = [{ date: project.dateCreated, text: 'Project created' }]
    if (project.orderNumber) entries.push({ date: 'Mar 15, 2026', text: `Order ${project.orderNumber} linked` })
    if (project.status !== 'Active') entries.push({ date: 'Mar 16, 2026', text: `Status updated to ${project.status}` })
    else entries.push({ date: 'Mar 16, 2026', text: 'Status updated to Active' })
    if (project.notes) entries.push({ date: 'Apr 1, 2026', text: 'Note added' })
    return entries
  }

  // ── Detail View ──
  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject.id) || selectedProject
    const colors = getStatusColor(project.status)
    const urgency = getUrgency(project.installationDate, project.status)
    const timeline = getTimeline(project)

    return (
      <div className="space-y-8">
        <button onClick={() => { setSelectedProject(null); setEditingNotes(false) }}
          className="flex items-center gap-2 text-muted hover:text-gold transition-colors font-body text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Projects
        </button>

        {/* Urgency Banner */}
        {urgency && urgency.days !== undefined && (
          <div className="flex items-center gap-3 px-6 py-4 bg-amber-50 border border-amber-200 rounded-sm">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <p className="text-sm font-semibold text-amber-800">
              Installation in {urgency.days} day{urgency.days !== 1 ? 's' : ''} — ensure your order is confirmed.
            </p>
          </div>
        )}
        {urgency && urgency.label === 'Overdue' && (
          <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border border-red-200 rounded-sm">
            <AlertTriangle size={18} className="text-red-600 shrink-0" />
            <p className="text-sm font-semibold text-red-800">Installation date has passed — this project is overdue.</p>
          </div>
        )}

        {/* Project Header */}
        <div className="bg-white rounded-sm border border-placeholder p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading text-4xl font-normal">{project.name}</h1>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-semibold ${colors.bg} ${colors.text}`}>
                  <Circle size={8} fill="currentColor" /> {project.status}
                </span>
              </div>
              <p className="text-lg text-muted">{project.clientName}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-placeholder text-muted rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors">
                <Share2 size={14} /> Share
              </button>
              <button onClick={() => handleEditOpen(project)} className="btn-primary flex items-center gap-2">
                <Edit2 size={14} /> Edit Project
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">Overall Progress</span>
              <span className="text-sm font-semibold text-text">{project.completion}%</span>
            </div>
            <div className="w-full h-3 bg-placeholder rounded-full overflow-hidden">
              <div className="h-full bg-gold transition-all rounded-full" style={{ width: `${project.completion}%` }}></div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Cabinet Count</p>
              <p className="text-2xl font-semibold text-text">{project.cabinetCount} <span className="text-sm font-normal text-muted">{pluralize(project.cabinetCount)}</span></p>
            </div>
            <div className="bg-white rounded-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Estimated Total</p>
              <p className="text-2xl font-semibold text-text">{project.estimate}</p>
            </div>
            <div className="bg-white rounded-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Installation Date</p>
              <p className="text-2xl font-semibold text-text">{project.installationDate}</p>
            </div>
            <div className="bg-white rounded-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Date Created</p>
              <p className="text-lg font-semibold text-text">{project.dateCreated}</p>
            </div>
            <div className="bg-white rounded-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Linked Order</p>
              {project.orderNumber ? <p className="text-lg font-semibold text-gold">{project.orderNumber}</p> : <p className="text-lg text-muted">No order linked</p>}
            </div>
            <div className="bg-white rounded-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Status</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-semibold ${colors.bg} ${colors.text}`}>
                <Circle size={8} fill="currentColor" /> {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        {(() => {
          const budget = parseFloat((project.estimate || '0').replace(/[$,]/g, ''))
          const actualSpend = project.orderNumber ? (orderSpendMap[project.orderNumber] || 0) : 0
          const budgetUsage = budget > 0 ? Math.round((actualSpend / budget) * 100) : 0
          const overBudget = budgetUsage > 100
          return (
            <div className="bg-white rounded-sm border border-placeholder p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-normal">Cost Summary</h2>
                {!project.orderNumber && (
                  <button onClick={() => setShowAttachOrder(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">
                    <LinkIcon size={14} /> Attach Order
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-sm p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Estimated Budget</p>
                  <p className="text-2xl font-semibold text-text">{project.estimate}</p>
                </div>
                <div className="bg-white rounded-sm p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Actual Spend</p>
                  <p className={`text-2xl font-semibold ${overBudget ? 'text-red-600' : 'text-text'}`}>
                    ${actualSpend.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">Budget Usage</span>
                  <span className={`text-sm font-semibold ${overBudget ? 'text-red-600' : 'text-text'}`}>{budgetUsage}%</span>
                </div>
                <div className="w-full h-3 bg-placeholder rounded-full overflow-hidden">
                  <div className={`h-full transition-all rounded-full ${overBudget ? 'bg-red-500' : 'bg-gold'}`}
                    style={{ width: `${Math.min(budgetUsage, 100)}%` }}></div>
                </div>
                {overBudget && (
                  <p className="text-xs text-red-600 font-semibold mt-2">Over budget by ${(actualSpend - budget).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                )}
              </div>
            </div>
          )
        })()}

        {/* Notes Section — editable inline */}
        <div className="bg-white rounded-sm border border-placeholder p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-normal">Notes</h2>
            {!editingNotes && (
              <button onClick={() => { setEditingNotes(true); setNoteDraft(project.notes || '') }}
                className="text-xs font-semibold text-gold hover:underline uppercase tracking-widest">Edit</button>
            )}
          </div>
          {editingNotes ? (
            <div>
              <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                onBlur={handleNoteSave}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none text-sm"
                rows="4" autoFocus></textarea>
            </div>
          ) : project.notes ? (
            <p className="text-muted leading-relaxed">{project.notes}</p>
          ) : (
            <p className="text-muted italic">No notes added yet.</p>
          )}
        </div>

        {/* Photos Section */}
        <div className="bg-white rounded-sm border border-placeholder p-8">
          <h2 className="font-heading text-2xl font-normal mb-6">Photos</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* 2 mock placeholder tiles */}
            <div className="aspect-square bg-placeholder rounded-sm flex items-center justify-center">
              <Camera size={32} className="text-muted" />
            </div>
            <div className="aspect-square bg-placeholder rounded-sm flex items-center justify-center">
              <Camera size={32} className="text-muted" />
            </div>
            {/* Upload tile */}
            <label className="aspect-square border-2 border-dashed border-placeholder rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              <Plus size={24} className="text-muted mb-1" />
              <span className="text-xs text-muted font-semibold">Upload</span>
            </label>
          </div>
        </div>

        {/* Project Timeline */}
        <div className="bg-white rounded-sm border border-placeholder p-8">
          <h2 className="font-heading text-2xl font-normal mb-6">Project Timeline</h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-1 bottom-1 w-px bg-placeholder"></div>
            {timeline.map((entry, idx) => (
              <div key={idx} className="relative pb-6 last:pb-0">
                <div className="absolute -left-4 top-1 w-4 h-4 rounded-full bg-white border-2 border-gold"></div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-text">{entry.text}</p>
                  <p className="text-xs text-muted mt-0.5">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attach Order Modal */}
        {showAttachOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-normal">Attach Order</h2>
                <button onClick={() => { setShowAttachOrder(false); setAttachOrderId('') }} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
              </div>
              <p className="text-sm text-muted mb-4">Link an existing unlinked order to this project.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Select Order</label>
                  <select value={attachOrderId} onChange={(e) => setAttachOrderId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                    <option value="">-- Choose an order --</option>
                    {unlinkedOrders.map(o => <option key={o.id} value={o.id}>{o.id} — {o.items} ({o.total})</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => { setShowAttachOrder(false); setAttachOrderId('') }}
                    className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                  <button onClick={handleAttachOrder} disabled={!attachOrderId}
                    className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-placeholder">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-normal">Share Project</h2>
                <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-50 rounded-sm transition-colors"><X size={20} className="text-muted" /></button>
              </div>
              <p className="text-sm text-muted mb-4">Share this project with a read-only link.</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-white border border-placeholder rounded-sm">
                  <Link size={14} className="text-muted shrink-0" />
                  <span className="text-sm text-text truncate select-all">{generateShareUrl(project)}</span>
                </div>
                <button onClick={() => handleCopyLink(project)} className="btn-primary whitespace-nowrap flex items-center gap-2">
                  <Copy size={14} /> Copy Link
                </button>
              </div>
            </div>
          </div>
        )}

        {editingProject && <EditModal editingProject={editingProject} setEditingProject={setEditingProject} onSave={handleEditSave} onDelete={() => { setShowDeleteConfirm(editingProject.id); setEditingProject(null) }} />}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    )
  }

  // ── Grid View ──
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-normal mb-2">Projects</h1>
          <p className="text-lg text-muted">Manage your cabinet projects from design to delivery.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* Filter, Search, Sort Bar */}
      <div className="bg-white rounded-sm p-4 border border-placeholder space-y-4">
        <div className="flex gap-2 border-b border-placeholder pb-4">
          {['All', 'Active', 'Ordered', 'Completed', 'Archived'].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors ${filter === tab ? 'bg-gold text-white' : 'text-text hover:bg-gray-50'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-muted" />
            <input type="text" placeholder="Search projects by name..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer pr-8 text-xs font-semibold uppercase tracking-widest">
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Highest Value">Highest Value</option>
              <option value="Closest Deadline">Closest Deadline</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-3 text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-sm p-16 text-center border border-placeholder">
          <div className="flex justify-center mb-4"><FolderOpen size={64} className="text-placeholder" /></div>
          <h3 className="font-heading text-2xl font-normal mb-2">{search ? 'No projects found' : 'No projects yet'}</h3>
          <p className="text-muted mb-6">{search ? 'Try adjusting your search.' : 'Your projects will appear here once you create one.'}</p>
          {!search && <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 mx-auto"><Plus size={18} /> New Project</button>}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {sorted.map(project => {
            const colors = getStatusColor(project.status)
            const urgency = getUrgency(project.installationDate, project.status)
            return (
              <div key={project.id} className="bg-white rounded-sm p-6 border border-placeholder hover:border-gold hover:shadow-md transition-all group relative">
                {/* 3-dot menu */}
                <div className="absolute top-6 right-6 z-10">
                  <button onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                    className="p-2 hover:bg-gray-50 rounded-sm transition-colors">
                    <MoreVertical size={18} className="text-muted" />
                  </button>
                  {openMenu === project.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-placeholder rounded-sm shadow-lg z-10 w-40">
                      <button onClick={() => handleDuplicateProject(project.id)}
                        className="w-full px-4 py-2 text-left text-xs font-semibold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Copy size={14} /> Duplicate
                      </button>
                      <button onClick={() => handleArchiveProject(project.id)}
                        className="w-full px-4 py-2 text-left text-xs font-semibold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Archive size={14} /> Archive
                      </button>
                      <button onClick={() => { setShowDeleteConfirm(project.id); setOpenMenu(null) }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-placeholder">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Badge + Urgency */}
                <div className="flex items-center gap-2 mb-3 pr-10">
                  <h3 className="font-body font-bold text-lg group-hover:text-gold transition-colors flex-1 truncate">{project.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-semibold shrink-0 ${colors.bg} ${colors.text}`}>
                    <Circle size={8} fill="currentColor" /> {project.status}
                  </span>
                  {urgency && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-semibold shrink-0 ${urgency.bg} ${urgency.text}`}>
                      {urgency.label}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted mb-4">{project.clientName}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted">Progress</span>
                    <span className="text-xs font-semibold text-text">{project.completion}%</span>
                  </div>
                  <div className="w-full h-2 bg-placeholder rounded-full overflow-hidden">
                    <div className="h-full bg-gold transition-all" style={{ width: `${project.completion}%` }}></div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-placeholder">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Cabinet Count</p>
                    <p className="text-text font-semibold">{project.cabinetCount} {pluralize(project.cabinetCount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Budget</p>
                    <p className="text-text font-semibold">{project.estimate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Install Date</p>
                    <p className="text-text text-sm">{project.installationDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Order</p>
                    {project.orderNumber ? <p className="text-text font-semibold text-sm">{project.orderNumber}</p> : <p className="text-muted text-sm">—</p>}
                  </div>
                </div>

                {/* Notes preview */}
                {project.notes && (
                  <p className="text-xs text-muted italic truncate mb-4">{project.notes}</p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button onClick={() => setSelectedProject(project)} className="btn-primary flex-1 text-center py-2 text-xs">View Details</button>
                  <button onClick={() => handleEditOpen(project)}
                    className="flex-1 px-4 py-2 border-2 border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors text-center">Edit</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-sm w-full mx-4 border border-placeholder">
            <h2 className="font-heading text-2xl font-normal mb-4">Delete Project</h2>
            <p className="text-sm text-muted mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
              <button onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-lg w-full mx-4 border border-placeholder">
            <h2 className="font-heading text-2xl font-normal mb-6">Create New Project</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Project Name *</label>
                <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g., Modern Kitchen Remodel" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Client Name</label>
                <input type="text" value={newProject.clientName} onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" placeholder="Client or company name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Cabinet Count</label>
                  <input type="number" value={newProject.cabinetCount} onChange={(e) => setNewProject({ ...newProject, cabinetCount: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" placeholder="12" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Estimated Budget</label>
                  <input type="text" value={newProject.estimate} onChange={(e) => setNewProject({ ...newProject, estimate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" placeholder="$18,500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Installation Date</label>
                <input type="date" value={newProject.installationDate} onChange={(e) => setNewProject({ ...newProject, installationDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Status</label>
                <select value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors appearance-none">
                  <option value="Active">Active</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Notes</label>
                <textarea value={newProject.notes} onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none" rows="3" placeholder="Any additional details..."></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                <button type="button" onClick={handleAddProject} className="flex-1 btn-primary py-3">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProject && <EditModal editingProject={editingProject} setEditingProject={setEditingProject} onSave={handleEditSave} onDelete={() => { setShowDeleteConfirm(editingProject.id); setEditingProject(null) }} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

function EditModal({ editingProject, setEditingProject, onSave, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm p-8 max-w-lg w-full mx-4 border border-placeholder">
        <h2 className="font-heading text-2xl font-normal mb-6">Edit Project</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Project Name</label>
            <input type="text" value={editingProject.name} onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Client Name</label>
            <input type="text" value={editingProject.clientName} onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Cabinet Count</label>
              <input type="number" value={editingProject.cabinetCount} onChange={(e) => setEditingProject({ ...editingProject, cabinetCount: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Estimated Budget</label>
              <input type="text" value={editingProject.estimate} onChange={(e) => setEditingProject({ ...editingProject, estimate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Installation Date</label>
            <input type="text" value={editingProject.installationDate} onChange={(e) => setEditingProject({ ...editingProject, installationDate: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Status</label>
            <select value={editingProject.status} onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors appearance-none">
              <option value="Active">Active</option>
              <option value="Ordered">Ordered</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Notes</label>
            <textarea value={editingProject.notes || ''} onChange={(e) => setEditingProject({ ...editingProject, notes: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none" rows="3"></textarea>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setEditingProject(null)}
              className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
            <button type="button" onClick={onSave} className="flex-1 btn-primary py-3">Save Changes</button>
          </div>
          <button type="button" onClick={onDelete}
            className="w-full mt-4 px-4 py-3 border-2 border-red-300 text-red-600 rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <Trash2 size={14} /> Delete Project
          </button>
        </form>
      </div>
    </div>
  )
}
