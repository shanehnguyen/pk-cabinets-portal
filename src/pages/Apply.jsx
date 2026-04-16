import { Link } from 'react-router-dom'
import { DollarSign, UserCheck, Clock, LayoutDashboard, TrendingUp } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/pro/Footer'

const benefits = [
  { icon: DollarSign, text: 'Trade pricing on every order' },
  { icon: UserCheck, text: 'Dedicated account rep' },
  { icon: Clock, text: '48-hour approval' },
  { icon: LayoutDashboard, text: 'Project management portal' },
  { icon: TrendingUp, text: 'Volume discounts' },
]

export default function Apply() {
  return (
    <div className="min-h-screen bg-background bg-dot-pattern" style={{ backgroundColor: '#ffffff' }}>
      <Navbar />

      {/* Content */}
      <div className="py-20">
        <div className="max-w-5xl mx-auto px-8 flex gap-12">
          {/* Form — left */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-16">
              <h1 className="font-heading text-4xl font-normal mb-4">Apply for the Trade Program</h1>
              <p className="text-lg text-muted">Complete this form to apply. We'll review your information and reach out within 2 business days.</p>
            </div>

            <form className="bg-white rounded-sm p-12 shadow-md border border-placeholder">
              {/* Personal Information */}
              <div className="mb-12">
                <h3 className="font-heading text-2xl font-normal pb-4 border-b border-placeholder mb-8">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="first-name" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      required
                      className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      required
                      className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-12">
                <h3 className="font-heading text-2xl font-normal pb-4 border-b border-placeholder mb-8">Professional Information</h3>

                <div className="mb-6">
                  <label htmlFor="business-name" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="business-name"
                    name="business-name"
                    required
                    className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="profession" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    Select Your Profession
                  </label>
                  <select
                    id="profession"
                    name="profession"
                    required
                    className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors appearance-none"
                  >
                    <option value="">Choose one</option>
                    <option value="installer">Kitchen Installer</option>
                    <option value="builder">Builder/Contractor</option>
                    <option value="designer">Interior Designer</option>
                    <option value="remodeler">Remodeling Contractor</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="license-number" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="license-number"
                      name="license-number"
                      className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="years-experience" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      Years in Business
                    </label>
                    <input
                      type="number"
                      id="years-experience"
                      name="years-experience"
                      min="0"
                      className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    Business Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="mb-12">
                <h3 className="font-heading text-2xl font-normal pb-4 border-b border-placeholder mb-8">Business Details</h3>

                <div className="mb-6">
                  <label htmlFor="annual-volume" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    Estimated Annual Cabinet Volume
                  </label>
                  <select
                    id="annual-volume"
                    name="annual-volume"
                    className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors appearance-none"
                  >
                    <option value="">Select range</option>
                    <option value="0-50k">Under $50,000</option>
                    <option value="50-100k">$50,000 - $100,000</option>
                    <option value="100-250k">$100,000 - $250,000</option>
                    <option value="250k+">$250,000+</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="project-types" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    What types of projects do you focus on?
                  </label>
                  <input
                    type="text"
                    id="project-types"
                    name="project-types"
                    placeholder="e.g., residential remodels, new construction, commercial"
                    className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                    Tell us about your business
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Share a bit about your company, your approach, and what you're looking for in a cabinet partner."
                    rows="5"
                    className="w-full px-4 py-3 border border-placeholder rounded-sm bg-background focus:outline-none focus:border-gold transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Agreement */}
              <div className="mb-12">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    className="mt-1 w-5 h-5 cursor-pointer accent-gold"
                  />
                  <span className="text-sm leading-relaxed text-muted pt-1">
                    I agree to the terms and conditions and would like to receive updates about PK Cabinets trade program opportunities.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button type="submit" className="btn-primary px-12 py-4 mb-6">
                  Submit Application
                </button>
                <p className="text-xs text-muted">
                  By submitting this form, you agree to be contacted by our team about your application.
                </p>
              </div>
            </form>
          </div>

          {/* Sidebar — right, sticky */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-8">
              <div className="border-l-2 border-gold pl-6">
                <h3 className="font-heading text-xl font-normal mb-6">What you'll get</h3>

                <div className="space-y-5">
                  {benefits.map(({ icon: Icon, text }, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-gold" />
                      </div>
                      <span className="text-sm text-text font-semibold">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pl-6">
                <p className="text-sm text-muted italic leading-relaxed">
                  "Joining the PK Cabinets trade program cut our material costs by 20% and gave us a dedicated rep who actually picks up the phone."
                </p>
                <p className="text-xs text-muted mt-3 font-semibold">
                  — David Park, Park Remodeling Co.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
