import { About } from '../../features/home/components/About';
import { ContactFormSection } from '../../features/home/components/ContactFormSection';
import { Cta } from '../../features/home/components/Cta';
import { Faq } from '../../features/home/components/Faq';
import { Footer } from '../../features/home/components/Footer';
import { Header } from '../../features/home/components/Header';
import { Hero } from '../../features/home/components/Hero';
import { HowItWorks } from '../../features/home/components/HowItWorks';
import { Plan } from '../../features/home/components/Plan';
import { Stats } from '../../features/home/components/Stats';
import { Steps } from '../../features/home/components/Steps';
import { Testimonials } from '../../features/home/components/Testimonials';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Plan />
        <HowItWorks />
        <Steps />
        <Testimonials />
        <Cta />
        <Faq />
        <ContactFormSection />
      </main>
      <Footer />
    </>
  );
}
