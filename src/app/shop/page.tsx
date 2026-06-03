"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import Skeleton from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isFiltering, setIsFiltering] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreCount, setLoadMoreCount] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setIsOpen);

  const categories = ["All", "Single Origin", "Espresso Blends", "Signature", "Cold Brew", "Dark Roasts", "Decaf", "Everyday"];

  // Filter & Sort Logic
  const getFilteredProducts = () => {
    let list = [...PRODUCTS];

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setVisibleProducts(getFilteredProducts());
      setIsFiltering(false);
      setHasMore(true); // Reset infinite scroll states
      setLoadMoreCount(1);
    }, 700); // 700ms micro-loading skeleton delay

    return () => clearTimeout(timer);
  }, [selectedCategory, sortBy]);

  // Simulate loading extra items for Infinite Scroll
  const loadMoreItems = () => {
    if (loadMoreCount >= 3) {
      setHasMore(false);
      return;
    }

    setIsFiltering(true);
    setTimeout(() => {
      // Append duplicate mock products to simulate longer feed
      const currentList = getFilteredProducts();
      const duplicates = currentList.map((p) => ({
        ...p,
        id: `${p.id}-extra-${loadMoreCount}`,
        name: `${p.name} (Lot ${loadMoreCount + 1})`,
      }));

      setVisibleProducts((prev) => [...prev, ...duplicates]);
      setLoadMoreCount((prev) => prev + 1);
      setIsFiltering(false);
    }, 900);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Editorial Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto py-6">
          <span className="text-xs uppercase tracking-[0.4em] font-semibold text-[#6B4B7D]">
            Curated Blends
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-[#1C120D] tracking-tight">
            Reserve Catalog
          </h1>
          <p className="text-sm text-[#5A3825]/85 leading-relaxed font-sans">
            Browse our limited roasted offerings. Each bag is flushed with nitrogen and hand-stamped with its roasting parameters, roast curves, and origin.
          </p>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-b border-[#EADFCC] py-6 gap-6">
          {/* Categories Tab */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#6B4B7D] text-[#FFFFFF] shadow-md"
                    : "bg-[#FFFFFF] text-[#1C120D] border border-[#EADFCC] hover:border-[#6B4B7D]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-[#5A3825]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C120D]">
              Sort By:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#FFFFFF] border border-[#EADFCC] rounded-sm px-4 py-2.5 pr-8 text-xs font-medium text-[#1C120D] tracking-wide focus:outline-none focus:border-[#6B4B7D] cursor-pointer"
              >
                <option value="featured">Featured Roasts</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A3825] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid & Simulated Loading State */}
        <div className="min-h-[500px]">
          {isFiltering ? (
            /* Custom Beige/Cream Shimmer Skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="space-y-4 p-4 border border-[#EADFCC] rounded-sm bg-[#FFFFFF]/50"
                >
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
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="group flex flex-col justify-between p-4 border border-[#EADFCC] rounded-sm bg-[#FFFFFF]/60 hover:bg-[#FFFFFF] hover:shadow-2xl hover:shadow-[#6B4B7D]/5 transition-all duration-500"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${product.id.split("-extra")[0]}`}
                      className="block relative aspect-square overflow-hidden rounded-sm bg-[#EADFCC]"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-all duration-750"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute top-3 left-3 bg-[#6B4B7D] text-[#FFFFFF] text-[9px] uppercase tracking-widest py-1 px-2.5 font-medium rounded-sm">
                        {product.category}
                      </div>
                    </Link>

                    {/* Meta details */}
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

                      <Link href={`/shop/${product.id.split("-extra")[0]}`} className="block">
                        <h3 className="font-playfair text-base font-bold text-[#1C120D] group-hover:text-[#6B4B7D] transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#5A3825]/75 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Cart */}
                    <div className="mt-6 pt-4 border-t border-[#EADFCC]/50 flex items-center justify-between gap-4">
                      <span className="text-base font-bold text-[#1C120D]">
                        ${product.price.toFixed(2)}
                      </span>

                      <button
                        onClick={() => {
                          addItem(product);
                          setCartOpen(true);
                        }}
                        className="px-4 py-2.5 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Infinite Scroll Trigger */}
        {hasMore && visibleProducts.length > 0 && (
          <div className="flex justify-center pt-16">
            <button
              onClick={loadMoreItems}
              disabled={isFiltering}
              className="px-8 py-3.5 border border-[#5A3825] hover:bg-[#5A3825] text-[#5A3825] hover:text-[#FFFFFF] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {isFiltering ? "Loading..." : "Load More Blends"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
