import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { TickerBar } from "@/components/site/TickerBar";
import { Services } from "@/components/site/Services";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Stats } from "@/components/site/Stats";
import { PartnerCTA } from "@/components/site/PartnerCTA";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { DownloadCTA } from "@/components/site/DownloadCTA";
import { Footer } from "@/components/site/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <TickerBar />
      <Services />
      <HowItWorks />
      <Stats />
      <PartnerCTA />
      <Testimonials />
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
};

export default Index;
