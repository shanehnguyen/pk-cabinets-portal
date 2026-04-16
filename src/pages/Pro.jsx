import { Users } from 'lucide-react'
import Header from '../components/pro/Header'
import Hero from '../components/pro/Hero'
import WhoItFor from '../components/pro/WhoItFor'
import HowItWorks from '../components/pro/HowItWorks'
import Benefits from '../components/pro/Benefits'
import WhyClients from '../components/pro/WhyClients'
import Testimonials from '../components/pro/Testimonials'
import CTABanner from '../components/pro/CTABanner'
import Footer from '../components/pro/Footer'

export default function Pro() {
  return (
    <>
      <Header />
      <Hero />
      {/* Social Proof Bar */}
      <div className="bg-[#ede9e3] py-3">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-2">
          <Users size={16} className="text-muted shrink-0" />
          <span className="text-sm text-muted font-body">Join 500+ contractors who trust PK Cabinets for their projects</span>
        </div>
      </div>
      <WhoItFor />
      <HowItWorks />
      <Benefits />
      <WhyClients />
      <Testimonials />
      <CTABanner />
      <Footer />
    </>
  )
}
