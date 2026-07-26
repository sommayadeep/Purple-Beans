"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const pathname = usePathname();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 4000);
  };

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#1C120D] text-[#F7F3EE] py-16 px-6 md:px-12 relative overflow-hidden border-t border-[#5A3825]/30">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#6B4B7D]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand Description Column */}
        <div className="space-y-6 md:col-span-2">
          <Link href="/" className="inline-block">
            <h3 className="font-playfair text-2xl font-bold tracking-wider text-[#FFFFFF] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#6B4B7D] inline-block" />
              PURPLE BEANS
            </h3>
          </Link>
          <p className="text-sm text-[#EADFCC]/75 max-w-md leading-relaxed">
            Crafted Beyond Coffee. Purple Beans Agro Industries Pvt Ltd is a premium sensory roastery sourcing rare micro-lots globally to deliver unparalleled luxury in every single bean.
          </p>
          <div className="flex gap-4 pt-2">
            {[
              {
                label: "Instagram",
                href: "https://www.instagram.com/purplebeanagro/",
                svg: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                )
              },
              {
                label: "Facebook",
                href: "https://www.facebook.com/people/Purple-Bean-Caf%C3%A9/61569305440006/?rdid=Q61ZVxBnfbWEuSRG&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1MQUaH1KNB%2F%3Fref%3D1",
                svg: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                )
              },
              {
                label: "Official Website",
                href: "https://www.pbai.in/",
                svg: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                )
              }
            ].map(({ label, href, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#EADFCC]/25 flex items-center justify-center text-[#EADFCC] hover:text-[#6B4B7D] hover:bg-[#F7F3EE] hover:border-[#F7F3EE] transition-all duration-300"
                aria-label={label}
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

        {/* Directory Links */}
        <div className="space-y-4">
          <h4 className="font-playfair text-sm uppercase tracking-widest text-[#FFFFFF] font-semibold">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-[#EADFCC]/75">
            <li>
              <Link href="/shop" className="hover:text-[#6B4B7D] transition-colors">
                Reserve Collection
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#6B4B7D] transition-colors">
                Our Roastery Story
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#6B4B7D] transition-colors">
                Coffee Journal
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup Column */}
        <div className="space-y-4">
          <h4 className="font-playfair text-sm uppercase tracking-widest text-[#FFFFFF] font-semibold">
            Newsletter
          </h4>
          <p className="text-xs text-[#EADFCC]/60 leading-relaxed">
            Subscribe to receive exclusive access to ultra-limited micro-lot coffee releases.
          </p>
          
          <form onSubmit={handleSubscribe} className="relative mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitted}
              className="w-full py-3 pl-4 pr-12 bg-[#5A3825]/20 border border-[#EADFCC]/20 focus:border-[#6B4B7D] rounded-sm text-sm text-[#FFFFFF] placeholder-[#EADFCC]/40 outline-none transition-all"
              required
            />
            <button
              type="submit"
              disabled={isSubmitted}
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#EADFCC] hover:bg-[#F7F3EE] text-[#1C120D] rounded-sm transition-all flex items-center justify-center cursor-pointer"
              aria-label="Subscribe"
            >
              {isSubmitted ? (
                <span className="text-xs text-[#1C120D] font-semibold">Joined</span>
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </form>
          {isSubmitted && (
            <p className="text-[11px] text-[#6B4B7D] font-medium animate-pulse">
              Thank you. You have joined the Purple Beans mailing list.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#5A3825]/20 flex flex-col md:flex-row items-center justify-between text-xs text-[#EADFCC]/40 relative z-10 gap-4">
        <span>© {new Date().getFullYear()} Purple Beans Agro Industries Pvt Ltd. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#6B4B7D]">Privacy Policy</a>
          <a href="#" className="hover:text-[#6B4B7D]">Terms of Craft</a>
        </div>
      </div>
    </footer>
  );
}
