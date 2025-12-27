// File: app\(protected)\admin\(crm)\layout.tsx (THEME FIX)
"use client";

import { useState } from "react";

import { DashboardHeader } from "./_components/dashboard-header";
import { Sidebar } from "./_components/sidebar";
import { useLayoutContext } from "./_context/layout-context";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { breadcrumbs, activeMenuItem, setActiveMenuItem } = useLayoutContext();

  const handleMenuToggle = () => setSidebarOpen(!sidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleItemClick = (id: string) => {
    setActiveMenuItem(id);
    setSidebarOpen(false);
  };
  // const { user, isPending } = useUser(); //TODO: Fix user context
  const user = "kavan";
  const isPending = false;

  return (
    // FIXED: Removed fixed background gradient - let theme handle it
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeItemId={activeMenuItem}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        onItemClick={handleItemClick}
      />

      <div className="flex flex-col flex-1 min-h-0">
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          isPending={isPending}
          user={user}
          onMenuToggle={handleMenuToggle}
        />

        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="w-full mx-auto max-w-7xl p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
