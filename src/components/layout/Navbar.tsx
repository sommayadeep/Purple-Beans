"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Compass, Bean, BookOpen, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsOpen: setCartOpen, getTotalItems } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the very top
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "/shop", label: "Shop Collections", icon: Bean },
    { href: "/about", label: "Our Story", icon: Compass },
    { href: "/blog", label: "Coffee Journal", icon: BookOpen },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -110 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 px-4 py-4 md:px-8 pointer-events-none"
      >
        {/* Floating Navbar Container */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-4 rounded-full bg-[#F7F3EE]/80 backdrop-blur-md border border-[#EADFCC] shadow-lg pointer-events-auto transition-shadow hover:shadow-xl">
          
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-playfair text-xl font-bold tracking-wider text-[#1C120D] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B4B7D] inline-block animate-pulse" />
              PURPLE BEANS
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-1 text-sm font-medium tracking-wide text-[#1C120D] hover:text-[#6B4B7D] transition-colors duration-300"
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6B4B7D] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart, User Profile, Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#EADFCC] text-[#1C120D] hover:text-[#6B4B7D] transition-all duration-300 group cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-[#6B4B7D] text-[#FFFFFF] rounded-full flex items-center justify-center text-[9px] font-bold"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#EADFCC] text-[#1C120D] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 md:hidden bg-[#F7F3EE] pt-24 px-6 flex flex-col justify-between pb-12"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-3 border-b border-[#EADFCC]/50 text-[#1C120D] text-lg font-medium hover:text-[#6B4B7D] transition-colors"
                  >
                    <IconComponent className="w-5 h-5 text-[#6B4B7D]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCartOpen(true);
                }}
                className="w-full py-4 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-sm uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({getTotalItems()})</span>
              </button>
              <p className="text-center text-xs text-[#5A3825] font-playfair">
                Purple Beans • Crafted Beyond Coffee
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
