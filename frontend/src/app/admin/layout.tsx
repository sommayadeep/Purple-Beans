"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Coffee, Users, LogOut, Loader2, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.role !== "admin")) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen bg-[#1C120D] text-[#F7F3EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

  if ((session?.user as any)?.role !== "admin") return null;

  const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders Management", icon: ShoppingCart },
    { href: "/admin/products", label: "Products Catalog", icon: Coffee },
  ];

  return (
    <div className="flex min-h-screen bg-[#120A07] text-[#F7F3EE] font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1C120D] border-r border-[#5A3825]/30 p-6 space-y-8">
        <div>
          <Link href="/" className="font-playfair text-lg font-bold tracking-wider text-[#F7F3EE] block">
            PURPLE BEANS <span className="text-[10px] bg-[#6B4B7D] text-[#FFFFFF] py-0.5 px-2 rounded-full font-sans tracking-normal uppercase ml-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-[#6B4B7D]/20 hover:text-[#FFFFFF] rounded-sm transition-colors"
              >
                <Icon className="w-4 h-4 text-[#6B4B7D]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-[#5A3825]/30">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-[#dc2626]/10 text-[#dc2626] rounded-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#1C120D] border-b border-[#5A3825]/30 md:justify-end">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-[#F7F3EE] hover:bg-[#5A3825]/20 rounded-sm"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Admin Active: {session?.user?.name}</span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-[#120A07] pt-20 px-6 flex flex-col gap-6">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 left-6 p-2 text-[#F7F3EE]"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-4">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-4 py-4 border-b border-[#5A3825]/20 text-lg font-medium hover:text-[#6B4B7D]"
                  >
                    <Icon className="w-5 h-5 text-[#6B4B7D]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/"
                className="flex items-center gap-4 py-4 text-rose-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Exit Admin</span>
              </Link>
            </nav>
          </div>
        )}

        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
