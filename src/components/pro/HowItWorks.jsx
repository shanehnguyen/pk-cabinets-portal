export default function HowItWorks() {
  const steps = [
    { num: '01', title: 'Project Kickoff', desc: 'Submit your project details and get paired with our team.' },
    { num: '02', title: 'Designer Assignment', desc: 'Your dedicated designer begins concept work with your vision.' },
    { num: '03', title: 'Design Conception', desc: 'Receive 3D renderings and detailed specifications for review.' },
    { num: '04', title: 'Final Approval', desc: 'Finalize designs and confirm order details with your rep.' },
    { num: '05', title: 'Order & Delivery', desc: 'Secure your cabinets with order tracking and delivery coordination.' },
  ]

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="mb-12">How it works</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Step 1 - tall left card */}
          <div className="row-span-4 relative overflow-hidden rounded-sm group">
            <div className="img-placeholder min-h-96 lg:min-h-full"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-semibold tracking-wide opacity-85 mb-1">{steps[0].num}</span>
              <h3 className="font-heading text-2xl font-normal mb-2">{steps[0].title}</h3>
              <p className="text-sm opacity-85 leading-snug max-w-xs">{steps[0].desc}</p>
            </div>
          </div>

          {/* Steps 2-5 - stacked right */}
          {steps.slice(1).map((step, idx) => (
            <div key={idx + 1} className="relative overflow-hidden rounded-sm">
              <div className="img-placeholder min-h-32"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-xs font-semibold tracking-wide opacity-85 mb-1">{step.num}</span>
                <h3 className="font-heading text-lg font-normal leading-snug">{step.title}</h3>
                <p className="text-xs opacity-85 leading-snug mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
