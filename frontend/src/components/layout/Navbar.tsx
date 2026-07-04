"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Compass, Bean, BookOpen, User, LogOut, LayoutDashboard, History } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const { data: session } = useSession();
  const { setIsOpen: setCartOpen, getTotalItems } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close dropdown on navigate
  useEffect(() => {
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-4 rounded-full bg-[#F7F3EE]/80 backdrop-blur-md border border-[#EADFCC] shadow-lg pointer-events-auto transition-shadow hover:shadow-xl">
          
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-playfair text-xl font-bold tracking-wider text-[#1C120D] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B4B7D] inline-block animate-pulse" />
              PURPLE BEANS
            </span>
          </Link>

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

            {/* Auth UI */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-[#EADFCC] hover:bg-[#EADFCC] transition-colors duration-300 cursor-pointer"
                >
                  {(session.user as any).image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(session.user as any).image}
                      alt={(session.user as any).name || "User"}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-[#1C120D]" />
                  )}
                  <span className="hidden lg:inline text-xs font-semibold tracking-wider uppercase text-[#1C120D] pr-1">
                    {(session.user as any).name?.split(" ")[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-48 rounded-md bg-[#F7F3EE] border border-[#EADFCC] shadow-lg py-1 z-50 origin-top-right overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-[#EADFCC]/50">
                        <p className="text-xs font-semibold text-[#1C120D] truncate">{(session.user as any).name}</p>
                        <p className="text-[10px] text-[#1C120D]/60 truncate font-mono">{(session.user as any).email}</p>
                      </div>

                      {(session.user as any).role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1C120D] hover:bg-[#6B4B7D] hover:text-[#FFFFFF] transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Admin Portal
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1C120D] hover:bg-[#6B4B7D] hover:text-[#FFFFFF] transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                        My Orders
                      </Link>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider uppercase bg-[#1C120D] text-[#F7F3EE] hover:bg-[#6B4B7D] rounded-full transition-colors duration-300"
              >
                <User className="w-3.5 h-3.5" />
                Login
              </Link>
            )}

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

              {session ? (
                <>
                  {(session.user as any).role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 py-3 border-b border-[#EADFCC]/50 text-[#1C120D] text-lg font-medium hover:text-[#6B4B7D] transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5 text-[#6B4B7D]" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-3 border-b border-[#EADFCC]/50 text-[#1C120D] text-lg font-medium hover:text-[#6B4B7D] transition-colors"
                  >
                    <History className="w-5 h-5 text-[#6B4B7D]" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-4 py-3 border-b border-[#EADFCC]/50 text-[#dc2626] text-lg font-medium hover:text-[#dc2626]/80 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 text-[#dc2626]" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 py-3 border-b border-[#EADFCC]/50 text-[#1C120D] text-lg font-medium hover:text-[#6B4B7D] transition-colors"
                >
                  <User className="w-5 h-5 text-[#6B4B7D]" />
                  <span>Login / Sign Up</span>
                </Link>
              )}
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
