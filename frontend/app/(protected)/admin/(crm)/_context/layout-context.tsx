// app/(crm)/LayoutContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type BreadcrumbItem = { label: string; href?: string };

type LayoutContextType = {
  breadcrumbs: BreadcrumbItem[] | null;
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export const LayoutContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[] | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        activeMenuItem,
        setActiveMenuItem,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const ctx = useContext(LayoutContext);

  if (!ctx)
    throw new Error(
      "useLayoutContext must be used inside LayoutContextProvider",
    );

  return ctx;
};
