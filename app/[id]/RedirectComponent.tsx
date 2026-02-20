"use client";

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

    const timer = setTimeout(() => {
      window.location.href = target;
    }, 1000);
    return () => clearTimeout(timer);
  }, [urlMobile, urlDesktop]);
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <img
        src={image}
        alt="Loading"
        className="lg:max-w-[800px] lg:aspect-[4:3] w-full mx-auto"
      />
    </div>
  );
}
