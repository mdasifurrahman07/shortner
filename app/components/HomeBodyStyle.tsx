"use client";

import { useEffect } from "react";

export default function HomeBodyStyle() {
  useEffect(() => {
    const body = document.body;
    const previous = {
      background: body.style.background,
      backgroundImage: body.style.backgroundImage,
      color: body.style.color,
    };

    body.style.background = "#ffffff";
    body.style.backgroundImage = "none";
    body.style.color = "#0f172a";

    return () => {
      body.style.background = previous.background;
      body.style.backgroundImage = previous.backgroundImage;
      body.style.color = previous.color;
    };
  }, []);

  return null;
}
