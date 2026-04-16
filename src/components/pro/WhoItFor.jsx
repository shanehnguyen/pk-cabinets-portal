export default function WhoItFor() {
  const audiences = [
    { title: 'Installers', desc: 'Complete installations with trade pricing and material support.' },
    { title: 'Builders', desc: 'Source cabinets for new construction and spec homes.' },
    { title: 'Designers', desc: 'Showcase kitchen solutions to your clients with confidence.' },
    { title: 'Remodelers', desc: 'Refresh existing spaces with our full cabinet selection.' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <h2 className="mb-4">Who it's for</h2>
        <p className="text-base text-muted max-w-2xl mx-auto mb-16">
          Whether you're a licensed installer, remodeling contractor, interior designer, or builder—we've built this program for professionals who deliver exceptional kitchens.
        </p>

        <div className="grid grid-cols-4 gap-8">
          {audiences.map((item, idx) => (
            <div key={idx}>
              <div className="img-placeholder rounded-full w-20 h-20 mx-auto mb-4"></div>
              <h3 className="font-body font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
