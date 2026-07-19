import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import TgLudico from "@/components/TgLudico";
import LatestNews from "@/components/LatestNews";
import CrowdfundingRadar from "@/components/CrowdfundingRadar";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Hero />
      <TgLudico />
      <LatestNews />
      <CrowdfundingRadar />
      <FeatureCards />
      <Footer />
    </main>
  );
  
}