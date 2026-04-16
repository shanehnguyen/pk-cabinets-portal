import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Plus, Trash2, Upload, Check, X, UserPlus, Bell, Package, Edit2 } from 'lucide-react'

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-fade-in">
      <Check size={16} className="text-green-400" /><span className="font-body text-sm">{message}</span>
    </div>
  )
}

function CardHeader({ title, icon: Icon, editing, onEdit, onSave, onCancel, noEdit }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-[#e8e3de] mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-gold" />}
        <h3 className="font-heading text-xl font-normal">{title}</h3>
      </div>
      {!noEdit && (
        editing ? (
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="px-4 py-2 border border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">Cancel</button>
            <button onClick={onSave} className="btn-primary text-xs py-2 px-4">Save Changes</button>
          </div>
        ) : (
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted hover:text-gold transition-colors">
            <Edit2 size={14} /> Edit
          </button>
        )
      )}
    </div>
  )
}

function ReadField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">{label}</p>
      <p className="text-text font-semibold">{value || '—'}</p>
    </div>
  )
}

const CARD = 'bg-white rounded-sm p-8 border border-[#e8e3de] shadow-sm'

export default function Account() {
  const { user } = useAuth()
  const [toast, setToast] = useState(null)
  const [editingSection, setEditingSection] = useState(null)

  // Business Info
  const [bizData, setBizData] = useState({ businessName: user?.businessName || '', businessType: user?.businessType || 'Cabinet installer/Carpenter', licenseNumber: user?.licenseNumber || '' })
  const [bizDraft, setBizDraft] = useState({ ...bizData })

  // Contact Info
  const [contactData, setContactData] = useState({ contactName: user?.contractorName || '', email: user?.email || '', phone: user?.phone || '' })
  const [contactDraft, setContactDraft] = useState({ ...contactData })

  // Addresses
  const [addresses, setAddresses] = useState([
    { id: 1, nickname: 'Main Office', street: '123 Business Ave', city: 'Los Angeles', state: 'CA', zip: '90001', isDefault: true },
    { id: 2, nickname: 'Jobsite - Oak St', street: '456 Oak Street', city: 'Los Angeles', state: 'CA', zip: '90002', isDefault: false },
  ])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ nickname: '', street: '', city: '', state: '', zip: '' })

  // Payment & Tax
  const [taxCertificate, setTaxCertificate] = useState(null)

  // Team Members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Rivera', email: 'alex.rivera@chendesign.com', role: 'Buyer', status: 'Active' },
    { id: 2, name: 'Jordan Kim', email: 'jordan.kim@chendesign.com', role: 'Viewer', status: 'Invited' },
  ])
  const [teamDraft, setTeamDraft] = useState([...teamMembers])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Viewer' })

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState({ orderShipped: true, orderDelivered: true, quoteReady: true, invoiceDue: true, newPromotions: true })
  const [notifDraft, setNotifDraft] = useState({ ...notifPrefs })
  const [orderChannels, setOrderChannels] = useState({ shippingEmail: true, shippingSms: false, deliveryEmail: true, deliverySms: false })
  const [channelDraft, setChannelDraft] = useState({ ...orderChannels })

  const businessTypeOptions = ['Residential remodeling contractor', 'New construction builder', 'Cabinet installer/Carpenter', 'Investor/house flipper', 'Kitchen designer', 'Architect']

  const startEdit = (section) => {
    if (editingSection && editingSection !== section) return // only one at a time
    setEditingSection(section)
    if (section === 'business') setBizDraft({ ...bizData })
    if (section === 'contact') setContactDraft({ ...contactData })
    if (section === 'team') setTeamDraft(teamMembers.map(m => ({ ...m })))
    if (section === 'notifications') { setNotifDraft({ ...notifPrefs }); setChannelDraft({ ...orderChannels }) }
  }

  const cancelEdit = () => {
    setEditingSection(null)
    setShowAddressForm(false)
  }

  const saveSection = (section) => {
    if (section === 'business') setBizData({ ...bizDraft })
    if (section === 'contact') setContactData({ ...contactDraft })
    if (section === 'tax') { /* taxCertificate already set directly */ }
    if (section === 'team') setTeamMembers(teamDraft.map(m => ({ ...m })))
    if (section === 'notifications') { setNotifPrefs({ ...notifDraft }); setOrderChannels({ ...channelDraft }) }
    setEditingSection(null)
    setShowAddressForm(false)
    setToast('Saved successfully')
  }

  const handleRemoveAddress = (id) => { setAddresses(addresses.filter(a => a.id !== id)); setToast('Address removed') }
  const handleSetDefault = (id) => { setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id }))); setToast('Default address updated') }
  const handleAddAddress = () => {
    if (newAddress.nickname && newAddress.street && newAddress.city && newAddress.state && newAddress.zip) {
      setAddresses([...addresses, { id: Date.now(), ...newAddress, isDefault: false }])
      setNewAddress({ nickname: '', street: '', city: '', state: '', zip: '' })
      setShowAddressForm(false)
      setToast('Address added')
    }
  }
  const handleTaxUpload = (e) => { const f = e.target.files?.[0]; if (f?.type === 'application/pdf') setTaxCertificate(f.name) }
  const handleInvite = () => {
    if (inviteForm.name && inviteForm.email) {
      const m = { id: Date.now(), ...inviteForm, status: 'Invited' }
      setTeamMembers(prev => [...prev, m])
      setTeamDraft(prev => [...prev, m])
      setInviteForm({ name: '', email: '', role: 'Viewer' })
      setShowInviteModal(false)
      setToast(`Invite sent to ${inviteForm.email}`)
    }
  }
  const handleRemoveTeamMember = (id) => { setTeamMembers(prev => prev.filter(m => m.id !== id)); setTeamDraft(prev => prev.filter(m => m.id !== id)); setToast('Team member removed') }

  const isBiz = editingSection === 'business'
  const isContact = editingSection === 'contact'
  const isAddr = editingSection === 'addresses'
  const isTax = editingSection === 'tax'
  const isTeam = editingSection === 'team'
  const isNotif = editingSection === 'notifications'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-4xl font-normal mb-2">Account Settings</h1>
        <p className="text-lg text-muted">Manage your business information and account details.</p>
      </div>

      {/* 1. Trade Account Status — read-only */}
      <div className={CARD}>
        <CardHeader title="Trade Account Status" noEdit />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Trade Tier</p>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-gold rounded-full"></span><span className="font-semibold text-text">Deluxe Pro</span></div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Trade Discount</p>
            <p className="font-heading text-2xl font-normal text-gold">15%</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Member Since</p>
            <p className="font-semibold text-text">Feb 20, 2026</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Account Status</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-sm text-xs font-semibold"><Check size={14} /> Active</span>
          </div>
        </div>
      </div>

      {/* 2. Business Information */}
      <div className={CARD}>
        <CardHeader title="Business Information" editing={isBiz} onEdit={() => startEdit('business')} onSave={() => saveSection('business')} onCancel={cancelEdit} />
        {isBiz ? (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Business Name</label>
              <input type="text" value={bizDraft.businessName} onChange={(e) => setBizDraft({ ...bizDraft, businessName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Business Type</label>
                <select value={bizDraft.businessType} onChange={(e) => setBizDraft({ ...bizDraft, businessType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none">
                  {businessTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">License Number</label>
                <input type="text" value={bizDraft.licenseNumber} onChange={(e) => setBizDraft({ ...bizDraft, licenseNumber: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <ReadField label="Business Name" value={bizData.businessName} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadField label="Business Type" value={bizData.businessType} />
              <ReadField label="License Number" value={bizData.licenseNumber} />
            </div>
          </div>
        )}
      </div>

      {/* 3. Contact Information */}
      <div className={CARD}>
        <CardHeader title="Contact Information" editing={isContact} onEdit={() => startEdit('contact')} onSave={() => saveSection('contact')} onCancel={cancelEdit} />
        {isContact ? (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Contact Name</label>
              <input type="text" value={contactDraft.contactName} onChange={(e) => setContactDraft({ ...contactDraft, contactName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Email Address</label>
                <input type="email" value={contactDraft.email} onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Phone Number</label>
                <input type="tel" value={contactDraft.phone} onChange={(e) => setContactDraft({ ...contactDraft, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <ReadField label="Contact Name" value={contactData.contactName} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ReadField label="Email Address" value={contactData.email} />
              <ReadField label="Phone Number" value={contactData.phone} />
            </div>
          </div>
        )}
      </div>

      {/* 4. Delivery Addresses */}
      <div className={CARD}>
        <CardHeader title="Delivery Addresses" editing={isAddr} onEdit={() => startEdit('addresses')} onSave={() => { setEditingSection(null); setShowAddressForm(false) }} onCancel={cancelEdit} />
        <div className="space-y-4 mb-4">
          {addresses.map(a => (
            <div key={a.id} className="p-4 bg-white rounded-sm border border-[#e8e3de]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text">{a.nickname}</span>
                    {a.isDefault && <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs font-semibold rounded-sm">Default</span>}
                  </div>
                  <p className="text-sm text-muted">{a.street}</p>
                  <p className="text-sm text-muted">{a.city}, {a.state} {a.zip}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!a.isDefault && <button onClick={() => handleSetDefault(a.id)} className="text-xs font-semibold text-gold hover:underline">Set as Default</button>}
                  <button onClick={() => handleRemoveAddress(a.id)} className="p-2 hover:bg-red-100 rounded-sm transition-colors text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isAddr && (
          !showAddressForm ? (
            <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 px-4 py-2 border-2 border-gold text-gold rounded-sm hover:bg-gold hover:text-white transition-colors font-semibold text-sm"><Plus size={16} /> Add New Address</button>
          ) : (
            <div className="p-4 bg-white rounded-sm border border-[#e8e3de] space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Nickname</label>
                <input type="text" value={newAddress.nickname} onChange={(e) => setNewAddress({ ...newAddress, nickname: e.target.value })} placeholder="e.g., Main Office"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Street Address</label>
                <input type="text" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">City</label>
                  <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">State</label>
                  <input type="text" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} maxLength="2" placeholder="CA"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">ZIP</label>
                  <input type="text" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddAddress} className="flex-1 btn-primary py-2">Save Address</button>
                <button onClick={() => setShowAddressForm(false)} className="flex-1 px-4 py-2 border-2 border-gray-300 text-text rounded-sm hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          )
        )}
      </div>

      {/* 5. Payment & Tax */}
      <div className={CARD}>
        <CardHeader title="Payment & Tax" editing={isTax} onEdit={() => startEdit('tax')} onSave={() => saveSection('tax')} onCancel={cancelEdit} />
        <div className="space-y-6">
          <ReadField label="Payment Terms" value="Net 30" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Tax Exemption Certificate</p>
            {taxCertificate ? (
              <div className="flex items-center justify-between p-4 bg-white rounded-sm border border-[#e8e3de]">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center"><span className="text-xs font-bold text-red-600">PDF</span></div>
                  <span className="text-sm text-text font-semibold">{taxCertificate}</span>
                </div>
                {isTax && <button onClick={() => { setTaxCertificate(null); setToast('Certificate removed') }} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>}
              </div>
            ) : isTax ? (
              <div className="relative">
                <input type="file" accept=".pdf" onChange={handleTaxUpload} className="hidden" id="taxCert" />
                <label htmlFor="taxCert" className="block p-4 border-2 border-dashed border-gold rounded-sm text-center cursor-pointer hover:bg-gold/5 transition-colors">
                  <Upload size={24} className="text-gold mx-auto mb-2" />
                  <p className="text-sm font-semibold text-text mb-1">Upload Tax Certificate</p>
                  <p className="text-xs text-muted">PDF files only</p>
                </label>
              </div>
            ) : (
              <p className="text-text font-semibold">No certificate uploaded</p>
            )}
          </div>
        </div>
      </div>

      {/* 6. Team Members */}
      <div className={CARD}>
        <CardHeader title="Team Members" editing={isTeam} onEdit={() => startEdit('team')} onSave={() => saveSection('team')} onCancel={cancelEdit} />
        <div className="bg-white rounded-sm border border-[#e8e3de] overflow-hidden mb-4">
          <table className="w-full">
            <thead className="border-b border-[#e8e3de]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Status</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {(isTeam ? teamDraft : teamMembers).map(m => (
                <tr key={m.id} className="border-b border-[#e8e3de] last:border-b-0">
                  <td className="px-4 py-3 text-sm font-semibold text-text">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-muted">{m.email}</td>
                  <td className="px-4 py-3">
                    {isTeam ? (
                      <select value={m.role} onChange={(e) => setTeamDraft(teamDraft.map(t => t.id === m.id ? { ...t, role: e.target.value } : t))}
                        className="px-2 py-1 border border-gray-300 rounded-sm bg-white text-xs font-semibold appearance-none focus:outline-none focus:border-gold">
                        <option value="Admin">Admin</option><option value="Buyer">Buyer</option><option value="Viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-sm">{m.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-sm text-xs font-semibold ${m.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleRemoveTeamMember(m.id)} className="p-1.5 hover:bg-red-100 rounded-sm transition-colors"><Trash2 size={14} className="text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isTeam && (
          <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 px-4 py-2 border-2 border-gold text-gold rounded-sm font-body text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-colors">
            <UserPlus size={14} /> Invite Team Member
          </button>
        )}
      </div>

      {/* 7. Notification Preferences */}
      <div className={CARD}>
        <CardHeader title="Notification Preferences" icon={Bell} editing={isNotif} onEdit={() => startEdit('notifications')} onSave={() => saveSection('notifications')} onCancel={cancelEdit} />

        <div className="space-y-4 mb-8">
          {[
            { key: 'orderShipped', label: 'Order shipped' },
            { key: 'orderDelivered', label: 'Order delivered' },
            { key: 'quoteReady', label: 'Quote ready' },
            { key: 'invoiceDue', label: 'Invoice due' },
            { key: 'newPromotions', label: 'New promotions' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-[#e8e3de] last:border-b-0">
              <span className="text-sm text-text font-semibold">{label}</span>
              <button type="button" disabled={!isNotif}
                onClick={() => isNotif && setNotifDraft(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${(isNotif ? notifDraft : notifPrefs)[key] ? 'bg-gold' : 'bg-gray-300'} ${!isNotif ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(isNotif ? notifDraft : notifPrefs)[key] ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pb-4 border-b border-[#e8e3de] mb-6">
          <Package size={18} className="text-gold" />
          <h4 className="font-body font-bold text-sm uppercase tracking-widest text-muted">Order Notifications</h4>
        </div>
        <p className="text-sm text-muted mb-4">Choose how you want to be notified for shipping updates and delivery confirmation.</p>
        <div className="space-y-4">
          {[
            { label: 'Shipping Updates', emailKey: 'shippingEmail', smsKey: 'shippingSms' },
            { label: 'Delivery Confirmation', emailKey: 'deliveryEmail', smsKey: 'deliverySms' },
          ].map(({ label, emailKey, smsKey }) => (
            <div key={label} className="bg-white rounded-sm p-4 border border-[#e8e3de]">
              <p className="text-sm text-text font-semibold mb-3">{label}</p>
              <div className="flex items-center gap-8">
                <label className={`flex items-center gap-3 ${isNotif ? 'cursor-pointer' : 'cursor-default opacity-70'}`}>
                  <input type="checkbox" disabled={!isNotif} checked={(isNotif ? channelDraft : orderChannels)[emailKey]}
                    onChange={() => isNotif && setChannelDraft(p => ({ ...p, [emailKey]: !p[emailKey] }))}
                    className="w-4 h-4 accent-gold" />
                  <span className="text-sm text-text">Email</span>
                </label>
                <label className={`flex items-center gap-3 ${isNotif ? 'cursor-pointer' : 'cursor-default opacity-70'}`}>
                  <input type="checkbox" disabled={!isNotif} checked={(isNotif ? channelDraft : orderChannels)[smsKey]}
                    onChange={() => isNotif && setChannelDraft(p => ({ ...p, [smsKey]: !p[smsKey] }))}
                    className="w-4 h-4 accent-gold" />
                  <span className="text-sm text-text">SMS</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-md w-full mx-4 border border-[#e8e3de]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-normal">Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-1 hover:bg-gray-50 rounded-sm"><X size={20} className="text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Name</label>
                <input type="text" value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder="Full name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Email</label>
                <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="email@company.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:border-gold transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">Role</label>
                <select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gold transition-colors appearance-none text-sm">
                  <option value="Admin">Admin</option><option value="Buyer">Buyer</option><option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-3 border-2 border-gold text-gold rounded-sm font-semibold hover:bg-gold hover:text-white transition-colors">Cancel</button>
                <button onClick={handleInvite} disabled={!inviteForm.name || !inviteForm.email} className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
