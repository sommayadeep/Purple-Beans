"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
}

const POSTS: BlogPost[] = [
  {
    id: "anaerobic-chemistry",
    title: "The Chemistry of Anaerobic Fermentation in Specialty Coffee",
    category: "Roastery Chemistry",
    date: "May 28, 2026",
    readTime: "6 min read",
    excerpt: "Explore how sealing hand-picked coffee cherries in pressurized nitrogen chambers triggers organic chemical conversions, synthesizing rare jasmine and wild blueberry volatiles.",
    image: "/purple-beans/Designer.png",
  },
  {
    id: "extraction-calibration",
    title: "Refining Your Pour-Over: Navigating Micro-Extraction Rates",
    category: "Brewing Science",
    date: "May 15, 2026",
    readTime: "8 min read",
    excerpt: "Calibration logs tracking dissolved solids (TDS) and thermal drift. Discover how water chemistry, mineral composition, and pour rate dictate taste clarity.",
    image: "/purple-beans/coffee2.png",
  },
  {
    id: "geisha-origins",
    title: "The Geisha Legacy: From Ethiopian Highlands to Volcanic Nectar",
    category: "Origin Reports",
    date: "April 29, 2026",
    readTime: "11 min read",
    excerpt: "A deep dive into the botanical migration of the Geisha varietal. How high-altitude wind patterns and rich basalt soils yield a floral, honey-like complexity.",
    image: "/purple-beans/Designer.png",
  },
];

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 px-6 md:px-12 space-y-12">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <Skeleton className="w-24 h-4 mx-auto" />
          <Skeleton className="w-2/3 h-12 mx-auto" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="space-y-4 p-4 border border-[#EADFCC] rounded-sm bg-[#FFFFFF]/50">
              <Skeleton className="w-full h-48 rounded-sm" />
              <Skeleton className="w-1/4 h-4" />
              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-full h-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.4em] font-semibold text-[#6B4B7D] block">
            Purple Beans Journal
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-[#1C120D] tracking-tight">
            Coffee Chronicles
          </h1>
          <p className="text-sm text-[#5A3825]/85 leading-relaxed">
            Our lab notebooks, research logs, and essays surrounding origin sourcing, roasting curves, and sensory sciences.
          </p>
        </div>

        {/* Featured Post (First entry) */}
        {POSTS.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 border border-[#EADFCC] rounded-sm bg-[#FFFFFF]/60 overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300"
          >
            {/* Featured Image */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto bg-[#EADFCC]">
              <Image
                src={POSTS[0].image}
                alt={POSTS[0].title}
                fill
                className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              <div className="absolute top-4 left-4 bg-[#6B4B7D] text-[#FFFFFF] text-[9px] uppercase tracking-widest py-1 px-3 font-semibold rounded-sm">
                {POSTS[0].category}
              </div>
            </div>

            {/* Featured Info */}
            <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] text-[#5A3825]/70 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {POSTS[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {POSTS[0].readTime}
                  </span>
                </div>

                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1C120D] group-hover:text-[#6B4B7D] transition-colors leading-tight">
                  {POSTS[0].title}
                </h2>

                <p className="text-xs md:text-sm text-[#5A3825] leading-relaxed">
                  {POSTS[0].excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EADFCC]/50">
                <button
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#5A3825] group-hover:text-[#6B4B7D] transition-colors"
                >
                  Read full entry
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Remaining Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {POSTS.slice(1).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="border border-[#EADFCC] rounded-sm bg-[#FFFFFF]/60 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] bg-[#EADFCC]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute top-4 left-4 bg-[#5A3825] text-[#FFFFFF] text-[9px] uppercase tracking-widest py-1 px-3 font-semibold rounded-sm">
                  {post.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[10px] text-[#5A3825]/70 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-playfair text-xl font-bold text-[#1C120D] group-hover:text-[#6B4B7D] transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#5A3825] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EADFCC]/50 mt-6">
                  <button
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#5A3825] group-hover:text-[#6B4B7D] transition-colors"
                  >
                    Read entry
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
