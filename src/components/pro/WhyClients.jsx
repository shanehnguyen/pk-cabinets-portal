import { Link } from 'react-router-dom'

export default function WhyClients() {
  const points = [
    { title: 'Endless Design Options', desc: 'From modern minimalist to classic traditional, our collections offer something for every aesthetic and budget.' },
    { title: 'Premium Quality Materials', desc: 'Each cabinet is built with durable, sustainably-sourced materials that stand the test of time.' },
    { title: 'Expert Design Guidance', desc: 'Our design team works directly with your clients to create kitchens that exceed their expectations.' },
    { title: 'Competitive Pricing', desc: 'Trade discounts mean better margins for you and exceptional value for your clients.' },
  ]

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="mb-8">Why your clients will love PK Cabinets</h2>

            {points.map((point, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="font-body font-bold text-base mb-2">{point.title}</h3>
                <p className="text-sm text-muted">{point.desc}</p>
              </div>
            ))}

            <div className="flex gap-6 items-center mt-8">
              <Link to="/apply" className="btn-primary">Apply for Trade Access</Link>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>

          <div className="img-placeholder min-h-96"></div>
        </div>
      </div>
    </section>
  )
}
