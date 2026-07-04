import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";

async function proxyRequest(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");

    // We do NOT proxy nextauth callback/session requests since they are handled locally by [...nextauth]
    if (pathStr.startsWith("auth/") && pathStr !== "auth/register" && pathStr !== "auth/login") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
    const targetUrl = `${backendUrl}/api/${pathStr}${queryString ? "?" + queryString : ""}`;

    const headers = new Headers();
    req.headers.forEach((value, key) => {
      // Forward standard headers, but ignore host and connection to prevent issues
      const lowerKey = key.toLowerCase();
      if (
        lowerKey !== "host" &&
        lowerKey !== "connection" &&
        lowerKey !== "content-length" &&
        lowerKey !== "transfer-encoding"
      ) {
        headers.set(key, value);
      }
    });

    headers.set("x-gateway-secret", process.env.GATEWAY_SECRET || "purple-beans-gateway-jwt-signature-secret-key-2026");

    // Add session/auth headers if user is logged in
    if (session?.user) {
      headers.set("x-user-id", (session.user as any).id || "");
      headers.set("x-user-role", (session.user as any).role || "");
      headers.set("x-user-email", session.user.email || "");
      headers.set("x-user-name", session.user.name || "");
    }

    let body: any = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.arrayBuffer();
    }

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const data = await backendRes.arrayBuffer();
    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== "transfer-encoding" && lowerKey !== "content-encoding") {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(data, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return NextResponse.json({ success: false, error: "Backend server connection failed" }, { status: 502 });
  }
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PATCH,
  proxyRequest as PUT,
  proxyRequest as DELETE,
};
