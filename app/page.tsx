import type { Metadata } from "next";
import { FAQ } from "@/components/landing/FAQ";
import { Hero } from "@/components/landing/Hero";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Contact } from "@/components/landing/Contact";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { CallToAction } from "@/components/landing/CallToAction";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <CallToAction />

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
