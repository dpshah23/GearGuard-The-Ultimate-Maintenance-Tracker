"use client";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  commas?: "ind" | "int";
  className?: string;
};

function formatNumber(
  num: number,
  decimals: number,
  commas?: "ind" | "int",
): string {
  const fixed = num.toFixed(decimals);

  if (!commas) return fixed;

  if (commas === "ind") {
    // Indian numbering system (12,34,567)
    const [intPart, decPart] = fixed.split(".");
    const last3 = intPart.slice(-3);
    const other = intPart.slice(0, -3);
    const formatted =
      other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (other ? "," : "") + last3;

    return decPart ? `${formatted}.${decPart}` : formatted;
  } else {
    // International (123,456,789)
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }
}

export const CountUp = ({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  commas,
  className,
}: CountUpProps) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const unsubscribe = springValue.onChange((latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [springValue]);

  useEffect(() => {
    if (isInView) {
      motionValue.set(to);
    }
  }, [isInView, motionValue, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(displayValue, decimals, commas)}
      {suffix}
    </span>
  );
};
