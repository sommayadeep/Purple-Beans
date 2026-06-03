"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ArrowLeft, Plus, Minus, Check, Sparkles, Coffee } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import Skeleton from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface Params {
  id: string;
}

export default function ProductDetailsPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  
  // Find product
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const [isLoading, setIsLoading] = useState(true);
  const [selectedGrind, setSelectedGrind] = useState("Whole Bean");
  const [selectedWeight, setSelectedWeight] = useState("250g");
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transform: "scale(1)" });

  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setIsOpen);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Price calculations based on weight selection
  const getWeightMultiplier = (w: string) => {
    switch (w) {
      case "500g":
        return 1.8;
      case "1kg":
        return 3.2;
      default:
        return 1.0;
    }
  };

  const finalPrice = product.price * getWeightMultiplier(selectedWeight);

  const handleAddToCart = () => {
    // Create copy product with updated price representing the select size
    const adjustedProduct = {
      ...product,
      price: finalPrice,
    };
    addItem(adjustedProduct, quantity, selectedGrind, selectedWeight);
    setCartOpen(true);
  };

  // Image Zoom Interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      transform: "scale(2)",
      transformOrigin: `${x}% ${y}%`,
    } as any);
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", transform: "scale(1)" });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="w-24 h-5" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Skeleton className="w-full aspect-[4/3] rounded-sm" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Skeleton className="w-1/3 h-6" />
              <Skeleton className="w-3/4 h-12" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-1/2 h-8" />
              <Skeleton className="w-full h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb Back Nav */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#6B4B7D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Selection
        </Link>

        {/* Product Spec Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Cinematic Zoom Image Container */}
          <div className="lg:col-span-7 space-y-6">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[4/3] w-full rounded-sm overflow-hidden border border-[#EADFCC] bg-[#EADFCC] cursor-zoom-in group shadow-md"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              {/* Zoom lens overlay */}
              <div
                style={zoomStyle as any}
                className="absolute inset-0 bg-no-repeat pointer-events-none transition-transform duration-75"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover scale-150 origin-center pointer-events-none"
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-4 right-4 bg-[#1C120D]/60 backdrop-blur-sm text-[#F7F3EE] text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-full font-medium">
                Hover to magnify
              </div>
            </div>

            {/* Product Taste Notes Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.notes.map((note) => (
                <span
                  key={note}
                  className="px-4 py-2 rounded-full border border-[#EADFCC] bg-[#FFFFFF] text-xs font-medium text-[#5A3825] shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#6B4B7D]" />
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Sticky Purchase Details Panel */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4B7D]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-[#6B4B7D] text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-[#5A3825]/60 text-xs">({product.reviews.length} reviews)</span>
                </div>
              </div>

              <h1 className="font-playfair text-3xl md:text-5xl font-bold text-[#1C120D] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#1C120D]">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-[#5A3825]/60">Complimentary Global Air shipping</span>
              </div>

              <p className="text-sm text-[#5A3825]/85 leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            {/* Selection parameters */}
            <div className="space-y-6 pt-4 border-t border-[#EADFCC]">
              
              {/* Grind Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#1C120D] block">
                  Select Grind Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Whole Bean", "French Press", "Espresso", "Filter Drip"].map((grind) => (
                    <button
                      key={grind}
                      onClick={() => setSelectedGrind(grind)}
                      className={`py-3 px-4 rounded-sm border text-xs font-semibold tracking-wider transition-all duration-300 text-left flex justify-between items-center cursor-pointer ${
                        selectedGrind === grind
                          ? "bg-[#6B4B7D] border-[#6B4B7D] text-[#FFFFFF] shadow-md"
                          : "bg-[#FFFFFF] border-[#EADFCC] text-[#1C120D] hover:border-[#6B4B7D]"
                      }`}
                    >
                      <span>{grind}</span>
                      {selectedGrind === grind && <Check className="w-4 h-4 text-[#FFFFFF]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#1C120D] block">
                  Bag Weight
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["250g", "500g", "1kg"].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`py-3 px-2 rounded-sm border text-xs font-semibold tracking-wider transition-all duration-300 text-center flex flex-col justify-center cursor-pointer ${
                        selectedWeight === weight
                          ? "bg-[#6B4B7D] border-[#6B4B7D] text-[#FFFFFF] shadow-md"
                          : "bg-[#FFFFFF] border-[#EADFCC] text-[#1C120D] hover:border-[#6B4B7D]"
                      }`}
                    >
                      <span className="font-bold">{weight}</span>
                      <span className={`text-[10px] mt-0.5 ${selectedWeight === weight ? "text-[#EADFCC]" : "text-[#5A3825]/60"}`}>
                        {weight === "250g" ? "Standard" : weight === "500g" ? "-10% Vol" : "-20% Vol"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#1C120D] block">
                  Quantity
                </label>
                <div className="flex items-center border border-[#EADFCC] rounded-sm bg-[#FFFFFF] w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-[#F7F3EE] text-[#5A3825] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 text-sm font-semibold text-[#1C120D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-[#F7F3EE] text-[#5A3825] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cart CTA */}
            <div className="pt-4 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-sm uppercase tracking-wider font-semibold rounded-sm transition-all duration-300 shadow-md text-center cursor-pointer"
              >
                Add To Selection
              </button>
            </div>

            {/* Accordion Specs */}
            <div className="border-t border-b border-[#EADFCC] py-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#6B4B7D]" />
                  Roastery Specifications
                </h4>
                <div className="grid grid-cols-2 gap-y-2 pt-2 text-xs text-[#5A3825] border-t border-[#EADFCC]/40">
                  <div>Origin</div>
                  <div className="font-semibold text-[#1C120D]">{product.origin}</div>
                  <div>Roast Level</div>
                  <div className="font-semibold text-[#1C120D]">{product.roastLevel}</div>
                  <div>Elevation</div>
                  <div className="font-semibold text-[#1C120D]">1,950m - 2,200m</div>
                  <div>Process</div>
                  <div className="font-semibold text-[#1C120D]">Anaerobic Fermented</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="pt-16 border-t border-[#EADFCC] space-y-8">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1C120D]">
            Roaster Impressions ({product.reviews.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((rev, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 border border-[#EADFCC] bg-[#FFFFFF]/60 rounded-sm space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#1C120D]">{rev.author}</h4>
                    <span className="text-[10px] text-[#5A3825]/60">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-[#6B4B7D]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-current" : "text-[#EADFCC]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-[#5A3825] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
