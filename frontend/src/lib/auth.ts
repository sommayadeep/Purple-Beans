import { getServerSession as nextAuthGetServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";

export async function getServerSession() {
  return await nextAuthGetServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session || !session.user) {
    return null;
  }
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session || !session.user || (session.user as any).role !== "admin") {
    return null;
  }
  return session;
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}
