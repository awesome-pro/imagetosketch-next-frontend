import Hero from "@/components/hero";
import Stats from "@/components/stats";
import Features from "@/components/features";
import BeforeAfter from "@/components/before-after";
import Testimonial from "@/components/testimonial";
import CTA from "@/components/cta";

export default function Home() {

  return (
    <main className="min-h-screen">
      <Hero />
      <Stats />
      <BeforeAfter />
      <Features />
      <Testimonial />
    </main>
  );
}