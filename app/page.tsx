import Hero from "@/components/Hero";
import TgLudico from "@/components/TgLudico";
import Settimanale from "@/components/Settimanale";
import CrowdfundingRadar from "@/components/CrowdfundingRadar";
import Recensioni from "@/components/Recensioni";
import FeatureCards from "@/components/FeatureCards";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <Hero />
      <TgLudico />
      <Settimanale />
      <CrowdfundingRadar />
      <Recensioni />
      <FeatureCards />
    </main>
  );
}