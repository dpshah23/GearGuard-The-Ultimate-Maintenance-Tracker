"use client";

import { useEffect, useState } from "react";
import React from "react";

const AnimatedBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-1/2 -right-48"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      <div
        className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl bottom-0 left-1/2"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      />
    </div>
  );
};

export default AnimatedBackground;
