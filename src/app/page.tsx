import React from 'react'
import Navbar from '@/components/landingpage/navbar'
import Section1 from '@/components/landingpage/section1'
import Section2 from '@/components/landingpage/section2'
import Section3 from '@/components/landingpage/section3'
import Footer from '@/components/ui/footer'
import { footerLinkGroups } from '@/app/dashboard/data'

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Section1 />
      <Section2 />
      <Section3 />
      <Footer linkGroups={footerLinkGroups} />
    </main>
  )
}