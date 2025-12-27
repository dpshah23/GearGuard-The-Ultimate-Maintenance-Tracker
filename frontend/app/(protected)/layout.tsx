"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useUser } from "@/hooks/useUser";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isPending } = useUser();

  useEffect(() => {
    // TODO: role check
    setTimeout(async () => await new Promise((res) => res()), 500);
  }, []);

  if (isPending) {
    return <div>Loading...</div>; // Add your loading component
  }

  return <>{children}</>;
}
