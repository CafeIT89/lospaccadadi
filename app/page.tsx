import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import TgLudico from "@/components/TgLudico";
import LatestNews from "@/components/LatestNews";
import CrowdfundingRadar from "@/components/CrowdfundingRadar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <Hero />
      <TgLudico />
      <LatestNews />
      <CrowdfundingRadar />
      <FeatureCards />
    </main>
  );
}