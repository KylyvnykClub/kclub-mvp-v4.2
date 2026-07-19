import { ContactFormSection } from '../../features/home/components/ContactFormSection';
import { Cta } from '../../features/home/components/Cta';
import { Faq } from '../../features/home/components/Faq';
import { Footer } from '../../features/home/components/Footer';
import { Header } from '../../features/home/components/Header';
import { Hero } from '../../features/home/components/Hero';
import { Offerings } from '../../features/home/components/Offerings';
import { Outcomes } from '../../features/home/components/Outcomes';
import { StatsTimeline } from '../../features/home/components/StatsTimeline';
import { Steps } from '../../features/home/components/Steps';
import { Stewards } from '../../features/home/components/Stewards';
import { Testimonials } from '../../features/home/components/Testimonials';
import { TrustMarks } from '../../features/home/components/TrustMarks';
import { Values } from '../../features/home/components/Values';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Values />
        <Offerings />
        <Outcomes />
        <Steps />
        <Stewards />
        <TrustMarks />
        <StatsTimeline />
        <Testimonials />
        <Faq />
        <Cta />
        <ContactFormSection />
      </main>
      <Footer />
    </>
  );
}
