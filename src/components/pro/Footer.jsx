import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-4 gap-12">
          {/* Column 1 — Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-white mb-1">PK Cabinet</h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">Contractor Portal</p>
            <p className="text-sm text-[#cccccc] leading-relaxed mb-6">
              Exclusive trade pricing, dedicated support, and tools built for professionals.
            </p>
            <a
              href="https://www.pkcabinet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 border border-gold text-gold text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-gold hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to PK Cabinets
            </a>
          </div>

          {/* Column 2 — Portal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">Portal</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-[#cccccc] hover:text-white transition-colors">Pro Landing Page</Link></li>
              <li><Link to="/apply" className="text-sm text-[#cccccc] hover:text-white transition-colors">Apply for Trade Access</Link></li>
              <li><Link to="/login" className="text-sm text-[#cccccc] hover:text-white transition-colors">Contractor Login</Link></li>
              <li><Link to="/dashboard" className="text-sm text-[#cccccc] hover:text-white transition-colors">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3 — Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="https://www.pkcabinet.com/pages/faq" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">FAQ</a></li>
              <li><a href="https://www.pkcabinet.com/pages/shipping" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="https://www.pkcabinet.com/pages/guarantee" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">Guarantee & Warranty</a></li>
              <li><a href="https://www.pkcabinet.com/pages/contact" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4 — Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="https://www.pkcabinet.com/collections/all-product" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">All Products</a></li>
              <li><a href="https://www.pkcabinet.com/pages/collections" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">Collections</a></li>
              <li><a href="https://www.pkcabinet.com/collections/refundable-sample-doors" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">Sample Doors</a></li>
              <li><a href="https://www.pkcabinet.com/pages/design" target="_blank" rel="noopener noreferrer" className="text-sm text-[#cccccc] hover:text-white transition-colors">Design Services</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#333]">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <p className="text-xs text-[#cccccc] uppercase tracking-widest">&copy; 2026 PK Cabinet. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://www.pkcabinet.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-[#cccccc] uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://www.pkcabinet.com/policies/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-xs text-[#cccccc] uppercase tracking-widest hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
