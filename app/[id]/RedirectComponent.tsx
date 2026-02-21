"use client";
import "../redirect.css";
import { useEffect } from "react";

interface Props {
  image: string;
  urlMobile: string;
  urlDesktop?: string;
}

export default function RedirectComponent({
  image,
  urlMobile,
  urlDesktop,
}: Props) {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isFacebookInAppBrowser = /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(ua);
    const target = !isMobile
      ? urlDesktop || urlMobile
      : isFacebookInAppBrowser
        ? urlMobile
        : urlDesktop || urlMobile;

    const normalizeTarget = (raw: string) => {
      const trimmed = (raw || "").trim();
      if (!trimmed) return urlMobile;

      // If we're on HTTPS, some in-app browsers are stricter about navigating
      // to HTTP destinations. Facebook domains support HTTPS, so upgrade them.
      if (
        typeof window !== "undefined" &&
        window.location.protocol === "https:"
      ) {
        try {
          const parsed = new URL(trimmed);
          const isFacebookDomain =
            /(^|\.)facebook\.com$|(^|\.)fb\.me$|(^|\.)m\.me$|(^|\.)facebook\.net$/i.test(
              parsed.hostname,
            );
          if (parsed.protocol === "http:" && isFacebookDomain) {
            parsed.protocol = "https:";
            return parsed.toString();
          }
        } catch {
          // If URL parsing fails, just use the raw value.
        }
      }

      return trimmed;
    };

    const finalTarget = normalizeTarget(target);

    const timer = setTimeout(() => {
      try {
        window.location.replace(finalTarget);
      } catch {
        window.location.href = finalTarget;
      }
    }, 1000000);
    return () => clearTimeout(timer);
  }, [urlMobile, urlDesktop]);
  return (
    <div className="w-full grid place-items-center box-border min-h-[100dvh]">
      <img
        src={image}
        alt="Loading"
        className="block w-full max-w-[800px] h-auto max-h-[80vh] object-contain"
      />
    </div>
  );
}
