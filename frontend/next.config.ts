import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Explicitly expose env vars to the browser bundle at build time.
  // This ensures NEXT_PUBLIC_* values are always available even when
  // the app is started with `npm start` (production mode).
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID:
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T5LPZwTGIxizFn",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  },
};

export default nextConfig;
