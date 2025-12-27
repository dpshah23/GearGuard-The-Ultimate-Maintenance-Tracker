"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type StaggeredFadeInListProps = {
  children: ReactNode[];
  className?: string; // optional className for additional styling
  delayStep?: number; // delay increment per item
};

export default function StaggeredFadeInList({
  children,
  className,
  delayStep = 0.15,
}: StaggeredFadeInListProps) {
  return (
    <>
      {children.map((child, i) => (
        <motion.div
          key={i}
          className={`${className || ""} h-full`}
          initial={{ opacity: 0, y: 20 }}
          style={{ willChange: "transform, opacity" }}
          transition={{ delay: i * delayStep, type: "spring", stiffness: 80 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
