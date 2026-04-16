export default function Testimonials() {
  const testimonials = [
    {
      quote: 'PK Cabinets transformed how I manage kitchen projects. The trade pricing and dedicated support have significantly improved our margins and client satisfaction.',
      author: 'Sarah Chen',
      role: 'Kitchen Designer',
    },
    {
      quote: 'The design support is invaluable. Having expert guidance on every project gives me confidence and reduces back-and-forth with clients.',
      author: 'Marcus Williams',
      role: 'Remodeling Contractor',
    },
    {
      quote: 'Fast turnaround, reliable delivery, and a team that genuinely cares about our success. This is the partnership I\'ve been looking for.',
      author: 'Jessica Rodriguez',
      role: 'Licensed Installer',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-center mb-12">What contractors are saying</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((item, idx) => (
            <div key={idx} className="bg-background rounded-lg p-8">
              <div className="text-gold text-lg font-semibold tracking-widest mb-4">★★★★★</div>
              <blockquote className="text-sm text-muted italic leading-relaxed mb-6">
                "{item.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="img-placeholder w-12 h-12 rounded-full"></div>
                <div>
                  <strong className="block font-body font-semibold text-sm">{item.author}</strong>
                  <span className="text-xs text-muted">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
