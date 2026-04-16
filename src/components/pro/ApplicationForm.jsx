import { useState } from 'react'

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    businessName: '',
    profession: '',
    licenseNumber: '',
    yearsExperience: '',
    website: '',
    annualVolume: '',
    projectTypes: '',
    message: '',
    terms: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section className="py-24">
      <div className="max-w-2xl mx-auto px-8">
        <h2 className="text-center mb-3">Apply for the Trade Program</h2>
        <p className="text-center text-base text-muted mb-12">
          Complete this form to apply. We'll review your information and reach out within 2 business days.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-12 space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="font-heading text-lg font-normal mb-4 pb-2 border-b border-placeholder">Personal Information</h3>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="font-heading text-lg font-normal mb-4 pb-2 border-b border-placeholder">Professional Information</h3>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Select Your Profession</label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition appearance-none bg-no-repeat bg-right-4"
              >
                <option value="">Choose one</option>
                <option value="installer">Kitchen Installer</option>
                <option value="builder">Builder/Contractor</option>
                <option value="designer">Interior Designer</option>
                <option value="remodeler">Remodeling Contractor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Years in Business</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Business Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
              />
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h3 className="font-heading text-lg font-normal mb-4 pb-2 border-b border-placeholder">Business Details</h3>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Estimated Annual Cabinet Volume</label>
              <select
                name="annualVolume"
                value={formData.annualVolume}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition appearance-none"
              >
                <option value="">Select range</option>
                <option value="0-50k">Under $50,000</option>
                <option value="50-100k">$50,000 - $100,000</option>
                <option value="100-250k">$100,000 - $250,000</option>
                <option value="250k+">$250,000+</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">What types of projects do you focus on?</label>
              <input
                type="text"
                name="projectTypes"
                value={formData.projectTypes}
                onChange={handleChange}
                placeholder="e.g., residential remodels, new construction, commercial"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">Tell us about your business</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share a bit about your company, your approach, and what you're looking for in a cabinet partner."
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-background text-text focus:border-gold outline-none transition resize-none"
                rows="5"
              ></textarea>
            </div>
          </div>

          {/* Agreement */}
          <div>
            <label className="flex items-start gap-3 font-body text-sm text-text cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
                className="mt-1 w-5 h-5 border border-gray-300 rounded cursor-pointer"
              />
              <span>
                I agree to the terms and conditions and would like to receive updates about PK Cabinets trade program opportunities.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button type="submit" className="btn-primary min-w-64">Submit Application</button>
            <p className="text-xs text-muted mt-4">By submitting this form, you agree to be contacted by our team about your application.</p>
          </div>
        </form>
      </div>
    </section>
  )
}
