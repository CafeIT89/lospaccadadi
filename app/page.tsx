import Hero from "@/components/Hero";
import { GamefoundUpdatesSection } from "@/components/gamefound/GamefoundUpdatesSection";
import { GamefoundRankingSidebar } from "@/components/gamefound/GamefoundRankingSidebar";
import TgLudicoSidebar from "@/components/TgLudicoSidebar";
import CheCosaGiochiamoSidebar from "@/components/CheCosaGiochiamoSidebar";
import Settimanale from "@/components/Settimanale";
import CrowdfundingRadar from "@/components/CrowdfundingRadar";
import Recensioni from "@/components/Recensioni";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Lo Spacca Dadi: recensioni, tutorial, unboxing, TG Ludico e Crowdfunding Radar dedicati al mondo dei giochi da tavolo.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6">
        <div className="grid items-start gap-8 xl:grid-cols-[280px_minmax(0,1fr)_280px]">

          {/* SIDEBAR SINISTRA */}
          <div className="space-y-6 py-8">
            <TgLudicoSidebar />
            <CheCosaGiochiamoSidebar />
          </div>

          {/* CONTENUTO CENTRALE */}
          <div className="min-w-0">
            <Hero />
            <GamefoundUpdatesSection />
            <CrowdfundingRadar />
            <Settimanale />
            <Recensioni />
          </div>

          {/* SIDEBAR DESTRA */}
          <div className="py-8">
            <GamefoundRankingSidebar />
          </div>

        </div>
      </div>
    </main>
  );
}