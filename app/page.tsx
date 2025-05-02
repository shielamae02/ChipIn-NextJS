import { FAQ } from "@/components/landing/FAQ";
import { Hero } from "@/components/landing/Hero";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Contact } from "@/components/landing/Contact";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { CallToAction } from "@/components/landing/CallToAction";
import { FadeIn } from "@/components/shared/FadeIn";

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col w-full'>
      {/* Header */}
      <Header />

      <main className='flex-1'>
        {/* Hero Section */}
        <FadeIn duration={200}>
          <Hero />
        </FadeIn>

        {/* Features Section */}
        <FadeIn duration={400}>
          <Features />
        </FadeIn>

        {/* How It Works Section */}
        <FadeIn duration={400}>
          <HowItWorks />
        </FadeIn>

        {/* Testimonials Section */}
        <FadeIn duration={400}>
          <Testimonials />
        </FadeIn>

        {/* CTA Section */}
        <FadeIn duration={400}>
          <CallToAction />
        </FadeIn>

        {/* FAQ Section */}
        <FadeIn duration={400}>
          <FAQ />
        </FadeIn>

        {/* Contact Section */}
        <FadeIn duration={400}>
          <Contact />
        </FadeIn>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
