import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-gateway-secret": process.env.GATEWAY_SECRET || "purple-beans-gateway-jwt-signature-secret-key-2026",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            cache: "no-store",
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.error || "Invalid email or password");
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image || null,
            role: data.user.role,
          };
        } catch (err: any) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      // In OAuth flow, we return true here. The user sync is handled in the jwt callback.
      return true;
    },
    async jwt({ token, user, account }) {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";

      if (user) {
        if (account?.provider === "google") {
          try {
            const res = await fetch(`${backendUrl}/api/auth/google-login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-gateway-secret": process.env.GATEWAY_SECRET || "purple-beans-gateway-jwt-signature-secret-key-2026",
              },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user.image,
              }),
              cache: "no-store",
            });

            const data = await res.json();
            if (res.ok && data.success) {
              token.role = data.user.role;
              token.userId = data.user.id;
            } else {
              token.role = "customer";
            }
          } catch (err) {
            console.error("Error syncing Google user with backend:", err);
            token.role = "customer";
          }
        } else {
          token.role = (user as any).role;
          token.userId = (user as any).id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
