"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    onloadTurnstileCallback?: () => void;
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Keep a stable ref to the latest onVerify callback so the effects never
  // need to list `onVerify` as a dependency (which would cause the widget to
  // destroy and re-render on every keystroke in the parent form).
  const onVerifyRef = useRef(onVerify);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep the ref up-to-date without triggering effects
  useEffect(() => {
    onVerifyRef.current = onVerify;
  });

  // Load the Turnstile script exactly once
  useEffect(() => {
    // Bypass on localhost – call onVerify immediately so the form isn't blocked
    const isDev = window.location.hostname === "localhost";
    if (isDev) {
      onVerifyRef.current("dev-mock-token");
      return;
    }

    const scriptId = "cloudflare-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Poll until the Turnstile global is available
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        setIsLoaded(true);
        clearInterval(checkTurnstile);
      }
    }, 100);

    return () => {
      clearInterval(checkTurnstile);
    };
    // Empty deps → run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render the widget once the script has loaded; clean up on unmount
  useEffect(() => {
    if (isLoaded && containerRef.current && !widgetIdRef.current) {
      try {
        const sitekey =
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
        const widgetId = window.turnstile!.render(containerRef.current, {
          sitekey,
          callback: (token: string) => {
            onVerifyRef.current(token);
          },
          "expired-callback": () => {
            onVerifyRef.current("");
          },
          "error-callback": () => {
            onVerifyRef.current("");
          },
          theme: "light",
        });
        widgetIdRef.current = widgetId;
      } catch (err) {
        console.error("Turnstile render error:", err);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // Only depend on `isLoaded` – never on the callback
  }, [isLoaded]);

  return <div ref={containerRef} className="my-4 min-h-[65px] flex justify-center" />;
}
