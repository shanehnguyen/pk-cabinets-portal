import { BadgePercent, UserCheck, BookOpen, Truck, Users, DoorOpen } from 'lucide-react'

const benefits = [
  { icon: BadgePercent, title: 'Exclusive Discounts', desc: 'Trade-only pricing on every cabinet line, updated quarterly to stay competitive.' },
  { icon: UserCheck, title: 'Dedicated Account Manager', desc: 'A single point of contact who knows your projects and preferences.' },
  { icon: BookOpen, title: 'Showroom Resources', desc: 'Access to product samples, spec sheets, and marketing collateral for your clients.' },
  { icon: Truck, title: 'Branded Dropshipping', desc: 'Ship directly to your job site with your branding on the packing slip.' },
  { icon: Users, title: 'Free Local Customer Referrals', desc: 'We send homeowners in your area directly to you as a preferred installer.' },
  { icon: DoorOpen, title: 'Complimentary Sample Doors', desc: 'Request free finish samples and door styles to show clients in person.' },
]

export default function Benefits() {
  return (
    <section className="relative py-24 bg-[#1a1a1a] overflow-hidden">
      {/* Dark overlay pattern for texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      <div className="relative max-w-6xl mx-auto px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-normal text-white mb-4">Contractor Benefits</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto"></div>
        </div>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
          {benefits.map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="flex items-start gap-5">
              <div className="shrink-0 w-12 h-12 border border-gold rounded-sm flex items-center justify-center">
                <Icon size={22} className="text-gold" />
              </div>
              <div>
                <h3 className="font-body font-bold text-white text-base mb-1.5">{title}</h3>
                <p className="text-sm text-[#cccccc] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
