import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import TgLudico from "@/components/TgLudico";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Hero />
       <TgLudico />
      <FeatureCards />
       <Footer />
    </main>
  );
  
}