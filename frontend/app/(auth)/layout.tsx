// layout.tsx
import { ReactNode } from "react";

import Footer from "@/components/footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex justify-center flex-1 pb-20 md:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
