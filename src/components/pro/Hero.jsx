import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center bg-placeholder">
      {/* Full-screen background placeholder */}
      <div className="absolute inset-0 bg-placeholder"></div>

      {/* Content overlay */}
      <div className="relative max-w-6xl mx-auto px-8 w-full">
        <div className="max-w-lg">
          <h1 className="mb-6">Build your business with our trade program.</h1>
          <p className="text-base mb-10 max-w-sm">
            Access exclusive pricing, dedicated support, and tools designed to help installers, builders, and designers scale their projects efficiently.
          </p>
          <Link to="/apply" className="btn-primary">Apply for Trade Access</Link>
        </div>
      </div>
    </section>
  )
}
