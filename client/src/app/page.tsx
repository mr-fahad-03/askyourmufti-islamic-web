import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { TopicsMarquee } from "@/components/home/TopicsMarquee";
import { RecentSessions } from "@/components/home/RecentSessions";
import { MostViewedQuestions } from "@/components/home/MostViewedQuestions";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { Footer } from "@/components/Footer";

export default function HomePage() {
    return (
        <div className="bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            <Hero />

            <section className="relative z-10 -mt-12 container mx-auto px-4 md:px-8">
                <StatsBar />
            </section>

            <TopicsMarquee />

            <RecentSessions />

            <MostViewedQuestions />

            <AboutSnippet />

            <Footer />
        </div>
    );
}
