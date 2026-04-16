import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="py-20 bg-text">
      <div className="container mx-auto px-8 max-w-6xl text-center">
        <h2 className="text-4xl font-heading font-normal text-white mb-4">Ready to get started?</h2>
        <p className="text-lg text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
          Join PK Cabinets' trade program and start saving on every project.
        </p>
        <Link to="/apply" className="btn-primary">
          Apply for Trade Access
        </Link>
      </div>
    </section>
  )
}
