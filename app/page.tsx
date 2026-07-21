import Hero from "@/components/Hero";
import TgLudico from "@/components/TgLudico";
import Settimanale from "@/components/Settimanale";
import CrowdfundingRadar from "@/components/CrowdfundingRadar";
import Recensioni from "@/components/Recensioni";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Lo Spacca Dadi: recensioni, tutorial, unboxing, TG Ludico e Crowdfunding Radar dedicati al mondo dei giochi da tavolo.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <Hero />
      <TgLudico />
      <Settimanale />
      <CrowdfundingRadar />
      <Recensioni />
     {/* <FeatureCards /> */}
    </main>
  );
}