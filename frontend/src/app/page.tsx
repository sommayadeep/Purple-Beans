"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Flame } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Skeleton from "@/components/ui/Skeleton";
import { motion, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Product {
  productId: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  category: string;
  rating: number;
  roastLevel: string;
  origin: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setIsOpen);

  // Mouse Parallax for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform values for hero parallax layers
  const heroTextX = useTransform(mouseX, [-400, 400], [-15, 15]);
  const heroTextY = useTransform(mouseY, [-400, 400], [-15, 15]);
  const heroBgScale = useTransform(mouseX, [-400, 400], [1.02, 1.05]);

  // Refs for GSAP scroll effects
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const scrollImgRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && data.products) {
          // Limit to 4 featured products
          setProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // GSAP Scroll Parallax on Designer.png section
    if (scrollSectionRef.current && scrollImgRef.current) {
      gsap.fromTo(
        scrollImgRef.current,
        { scale: 1.0, y: -40 },
        {
          scale: 1.25,
          y: 40,
          scrollTrigger: {
            trigger: scrollSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }

    if (scrollSectionRef.current && scrollTextRef.current) {
      gsap.fromTo(
        scrollTextRef.current,
        { opacity: 0.2, y: 80 },
        {
          opacity: 1,
          y: -80,
          scrollTrigger: {
            trigger: scrollSectionRef.current,
            start: "top 85%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        }
      );
    }
  }, [isLoading]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 px-6 space-y-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-2">
          <Skeleton className="w-40 h-8 rounded-full" />
          <div className="flex gap-4">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-24 h-6 rounded-full" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6">
          <div className="space-y-6 flex flex-col justify-center">
            <Skeleton className="w-1/4 h-5" />
            <Skeleton className="w-3/4 h-16" />
            <Skeleton className="w-1/2 h-6" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="w-36 h-12 rounded-sm" />
              <Skeleton className="w-36 h-12 rounded-sm" />
            </div>
          </div>
          <Skeleton className="w-full h-[500px] rounded-lg shadow-sm" />
        </div>

        <div className="max-w-7xl mx-auto space-y-8 pt-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-56 h-8" />
            </div>
            <Skeleton className="w-28 h-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-4 p-4 border border-[#EADFCC] rounded-sm bg-[#FFFFFF]/50">
                <Skeleton className="w-full h-64 rounded-sm" />
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="w-16 h-6" />
                  <Skeleton className="w-24 h-8 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F7F3EE]">
      {/* HERO SECTION */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden bg-[#1C120D]"
      >
        <motion.div
          style={{ scale: heroBgScale }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-65"
          >
            <source src="/purple-beans/transaction.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F3EE] via-transparent to-[#1C120D]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C120D]/40 via-transparent to-[#1C120D]/40" />

        <motion.div
          style={{ x: heroTextX, y: heroTextY }}
          className="relative z-10 text-center px-6 max-w-4xl space-y-6 select-none"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-xs uppercase tracking-[0.4em] font-semibold text-[#EADFCC] block"
          >
            Purple Beans Agro Industries
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#FFFFFF] drop-shadow-xl"
          >
            Crafted Beyond Coffee
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.25, ease: "easeOut" }}
            className="text-sm md:text-lg text-[#F7F3EE]/85 max-w-xl mx-auto leading-relaxed font-sans"
          >
            Experience sensory luxury in every roast. Ethically sourced micro-lots, roasted using AI-driven heat curves to unlock pristine taste dimensions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/shop"
              className="px-8 py-4 bg-[#6B4B7D] hover:bg-[#5A3825] text-[#FFFFFF] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-lg hover:scale-[1.03]"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-[#FFFFFF]/30 hover:border-[#FFFFFF] text-[#FFFFFF] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 backdrop-blur-sm"
            >
              Explore Story
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-55 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#F7F3EE]">Scroll Down</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#F7F3EE] to-transparent" />
        </div>
      </section>

      {/* SECTION 2: IMMERSIVE SCROLL EXPERIENCE */}
      <section
        ref={scrollSectionRef}
        className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden py-24 bg-[#1C120D] text-[#F7F3EE] border-b border-[#5A3825]/20"
      >
        <div
          ref={scrollImgRef}
          className="absolute inset-0 w-full h-[120%] opacity-40 mix-blend-luminosity"
        >
          <Image
            src="/purple-beans/Designer.png"
            alt="Cinematic coffee textures"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#1C120D] via-transparent to-[#1C120D]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-[#5A3825]/40 border border-[#EADFCC]/25 backdrop-blur-sm">
              <Flame className="w-8 h-8 text-[#EADFCC] animate-pulse" />
            </div>
          </div>
          <div ref={scrollTextRef} className="space-y-6">
            <h2 className="font-playfair text-4xl md:text-6xl font-bold tracking-tight text-[#EADFCC]">
              A Sensory Awakening
            </h2>
            <p className="text-base md:text-xl text-[#F7F3EE]/80 leading-relaxed font-light max-w-2xl mx-auto">
              Our beans are sourced from small family-owned boutique farms above 1,800 meters. We micro-roast them in tailored atmospheric gas configurations, capturing natural compounds that define our exquisite sensory profile.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#EADFCC] hover:text-[#FFFFFF] transition-colors group"
              >
                Discover the Roast Parameters
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED COLLECTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4B7D]">
              Exquisite Selection
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#1C120D]">
              Featured Micro-Lots
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#6B4B7D] border-b border-[#5A3825]/30 hover:border-[#6B4B7D] pb-1 transition-all"
          >
            Browse All Blends
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="group flex flex-col justify-between p-4 border border-[#EADFCC] rounded-sm bg-[#FFFFFF]/60 hover:bg-[#FFFFFF] hover:shadow-2xl hover:shadow-[#6B4B7D]/5 transition-all duration-500"
            >
              <Link href={`/shop/${product.productId}`} className="block relative aspect-square overflow-hidden rounded-sm bg-[#EADFCC]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                
                <div className="absolute top-3 left-3 bg-[#6B4B7D] text-[#FFFFFF] text-[9px] uppercase tracking-widest py-1 px-2.5 font-medium rounded-sm">
                  {product.category}
                </div>
              </Link>

              <div className="mt-6 space-y-2 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#5A3825] font-semibold">
                    Roast: {product.roastLevel}
                  </span>
                  <div className="flex items-center gap-1 text-[#6B4B7D] text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                
                <Link href={`/shop/${product.productId}`} className="block">
                  <h3 className="font-playfair text-lg font-bold text-[#1C120D] group-hover:text-[#6B4B7D] transition-colors leading-tight">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-xs text-[#5A3825]/75 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADFCC]/50 flex items-center justify-between gap-4">
                <span className="text-base font-bold text-[#1C120D]">
                  ₹{Math.round(product.price)}
                </span>
                
                <button
                  onClick={() => {
                    addItem({
                      id: product.productId,
                      name: product.name,
                      price: product.price,
                      description: product.description,
                      longDescription: product.longDescription,
                      image: product.image,
                      category: product.category,
                      rating: product.rating,
                      roastLevel: product.roastLevel,
                      origin: product.origin,
                      notes: [],
                      reviews: []
                    });
                    setCartOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-300"
                >
                  Quick Add
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: STORYTELLING SECTION */}
      <section className="py-24 bg-[#EADFCC] border-t border-b border-[#EADFCC]/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] font-semibold text-[#6B4B7D]">
              Artisanal Craftsmanship
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#1C120D] leading-tight">
              Ethically Harvested. AI Perfected.
            </h2>
            <p className="text-sm md:text-base text-[#1C120D]/80 leading-relaxed font-sans">
              Our direct-trade network supports small farms, paying on average 40% above fair-trade thresholds. We match this agricultural devotion with thermodynamic AI roasting profiling. By analyzing airflow, pressure, and ambient humidity in real-time, our roasters capture taste notes that other brands leave behind.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="px-6 py-3.5 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-sm transition-all duration-300 text-center"
              >
                Learn Our Heritage
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border-4 border-[#F7F3EE]"
            >
              <Image
                src="/purple-beans/coffee2.png"
                alt="Roasting processes at Purple Beans"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
