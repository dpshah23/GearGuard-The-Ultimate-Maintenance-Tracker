"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StaggeredFadeInItemProps {
  children: ReactNode;
  index?: number;
  delayStep?: number;
  className?: string;
}

export default function StaggeredFadeInItem({
  children,
  index = 0,
  delayStep = 0.15,
  className = "",
}: StaggeredFadeInItemProps) {
  return (
    <motion.div
      className={`${className || ""} h-full`}
      initial={{ opacity: 0, y: 20 }}
      style={{ willChange: "transform, opacity" }}
      transition={{ delay: index * delayStep, duration: 0.5 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
