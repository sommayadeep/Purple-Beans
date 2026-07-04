"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1C120D",
            color: "#F7F3EE",
            borderRadius: "2px",
            fontSize: "13px",
            fontFamily: "var(--font-inter-sans), sans-serif",
          },
          success: {
            iconTheme: { primary: "#6B4B7D", secondary: "#F7F3EE" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#F7F3EE" },
          },
        }}
      />
    </SessionProvider>
  );
}
