import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Mission from "@/components/Mission";
import Symptoms from "@/components/Symptoms";
import Process from "@/components/Process";
import Roots from "@/components/Roots";
import Founder from "@/components/Founder";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Quiz from "@/components/Quiz";
import Faq from "@/components/Faq";
import Closing from "@/components/Closing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Mission />
        <Symptoms />
        <Process />
        <Roots />
        <Founder />
        <Services />
        <Pricing />
        <Quiz />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
