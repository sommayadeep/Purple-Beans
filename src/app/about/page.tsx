"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const imageGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (imageGridRef.current) {
      gsap.fromTo(
        imageGridRef.current.querySelectorAll(".parallax-img"),
        { y: 30, scale: 0.98 },
        {
          y: -30,
          scale: 1.02,
          stagger: 0.1,
          scrollTrigger: {
            trigger: imageGridRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 px-6 md:px-12 space-y-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="w-24 h-4 mx-auto" />
          <Skeleton className="w-3/4 h-16 mx-auto" />
          <Skeleton className="w-full h-32 mx-auto" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[400px]" />
          <Skeleton className="w-full h-[400px]" />
        </div>
      </div>
    );
  }

  const values = [
    {
      Icon: Compass,
      title: "Direct Sourcing",
      desc: "We bypass middle auctions, negotiating directly with estate farmers across Panama, Ethiopia, and Colombia. This guarantees pristine raw bean quality and ensures our partners earn on average 40% higher wages.",
    },
    {
      Icon: Coffee,
      title: "AI Thermodynamic Profiling",
      desc: "Our master roasters employ custom machine learning heat curves during roasting. By modeling convective air expansion and chemical crack telemetry, we roast with mathematical precision to capture delicate origin traits.",
    },
    {
      Icon: HeartHandshake,
      title: "Radical Transparency",
      desc: "Every package has a cryptographic batch ID. Scanning it reveals the complete green bean analysis, moisture levels, sensory score, direct-trade pricing contract, and precise roasting curve profile.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Page Hero Header */}
        <div ref={headerRef} className="text-center space-y-6 max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.4em] font-semibold text-[#6B4B7D] block">
            Our Heritage
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-[#1C120D] tracking-tight leading-tight">
            Crafting the Future of Premium Coffee
          </h1>
          <p className="text-base md:text-xl text-[#5A3825] leading-relaxed font-light max-w-2xl mx-auto">
            Purple Beans Agro Industries Pvt Ltd is a premium sensory roastery committed to reshaping how the world perceives coffee.
          </p>
        </div>

        {/* Editorial Split Grid with companylogo.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1C120D]">
              Beyond Fair Trade
            </h2>
            <p className="text-sm md:text-base text-[#5A3825]/85 leading-relaxed">
              Founded in 2021, Purple Beans emerged from a singular obsession: to find the most expressive coffee varieties on earth and preserve their flavors in transit. 
            </p>
            <p className="text-sm md:text-base text-[#5A3825]/85 leading-relaxed">
              We realized standard supply networks over-roasted beans to mask transit defects. We rebuilt the model from scratch. By designing bespoke nitrogen-sealed grain boxes, we ship raw beans under vacuum, maintaining cell integrity from crop to roastery.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] bg-[#EADFCC] rounded-sm overflow-hidden shadow-xl border border-[#EADFCC]">
              <Image
                src="/purple-beans/companylogo.png"
                alt="Purple Beans logo and branding campaign"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Brand Values Columns */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4B7D]">
              Our Core Pillars
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1C120D]">
              Roasting Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const IconComponent = val.Icon;
              return (
                <div
                  key={idx}
                  className="p-8 border border-[#EADFCC] bg-[#FFFFFF]/40 rounded-sm space-y-4 hover:bg-[#FFFFFF] hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#EADFCC] flex items-center justify-center text-[#6B4B7D]">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-[#1C120D]">
                    {val.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#5A3825]/80 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cinematic Parallax Dual Image Grid */}
        <div ref={imageGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-[#EADFCC]">
            <Image
              src="/purple-beans/Designer.png"
              alt="Harvesting coffee cherries"
              fill
              className="object-cover parallax-img"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-[#1C120D]/20" />
            <div className="absolute bottom-6 left-6 text-[#FFFFFF]">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#EADFCC]">Phase 01</span>
              <h4 className="font-playfair text-lg font-bold">Altitude Cultivation</h4>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-[#EADFCC]">
            <Image
              src="/purple-beans/coffee2.png"
              alt="Anaerobic fermentation process"
              fill
              className="object-cover parallax-img"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-[#1C120D]/20" />
            <div className="absolute bottom-6 left-6 text-[#FFFFFF]">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#EADFCC]">Phase 02</span>
              <h4 className="font-playfair text-lg font-bold">Anaerobic Control</h4>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <section className="bg-[#1C120D] text-[#F7F3EE] p-12 md:p-16 rounded-sm text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B4B7D]/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#EADFCC]">
              Experience the Curvature
            </h2>
            <p className="text-xs md:text-sm text-[#F7F3EE]/80 leading-relaxed">
              Order your first micro-lot catalog today and receive complimentary access to our sensory mapping tool.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#EADFCC] hover:bg-[#F7F3EE] text-[#1C120D] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 inline-block shadow-md"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
