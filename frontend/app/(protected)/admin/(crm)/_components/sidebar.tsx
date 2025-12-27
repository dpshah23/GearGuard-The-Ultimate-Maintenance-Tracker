"use client";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Cog,
  Calendar,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { LiveClock } from "@/components/live-clock";
import { useUser } from "@/hooks/useUser";

// Types
type SidebarItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
  children?: SidebarItem[];
};

// Sidebar Components
export const SidebarTitle = ({
  title,
  isCollapsed,
}: {
  title: string;
  isCollapsed: boolean;
}) =>
  !isCollapsed && (
    <div className="px-3 mb-2 text-xs font-semibold tracking-wider uppercase text-foreground/50">
      {title}
    </div>
  );

const SidebarItem = ({
  item,
  isActive = false,
  onClick,
  href,
  isCollapsed,
}: {
  item: SidebarItem;
  isActive?: boolean;
  onClick?: () => void;
  href: string;
  isCollapsed: boolean;
}) => {
  const Icon = item.icon;
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isActive && itemRef.current) {
      const navContainer = itemRef.current.closest(".overflow-y-auto");

      if (navContainer) {
        const itemRect = itemRef.current.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();

        // Calculate if item is out of view
        const isAboveView = itemRect.top < containerRect.top;
        const isBelowView = itemRect.bottom > containerRect.bottom;

        if (isAboveView || isBelowView) {
          // Smart positioning: try to place item at 40% from top
          const containerHeight = navContainer.clientHeight;
          const targetPosition = containerHeight * 0.4;
          const itemOffsetTop = itemRef.current.offsetTop;

          navContainer.scrollTo({
            top: itemOffsetTop - targetPosition,
            behavior: "smooth",
          });
        }
      }
    }
  }, [isActive]);

  const buttonContent = (
    <Button
      disableRipple
      as={Link}
      className={`
        justify-start gap-3 w-full h-auto py-3 px-4 
        ${isActive ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground hover:bg-content2"}
        ${isCollapsed ? "px-0 min-w-12 justify-center" : ""}
      `}
      color={isActive ? "primary" : "default"}
      href={href}
      radius="lg"
      variant={isActive ? "solid" : "light"}
      onPress={onClick}
    >
      <Icon
        className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-foreground/60"}`}
      />
      {!isCollapsed && (
        <>
          <span
            className={`flex-1 text-sm font-medium text-left transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
            }`}
          >
            {item.label}
          </span>
          {item.badge && (
            <Chip
              className={`ml-auto ${isActive ? "bg-content2 text-foreground" : "bg-primary text-background"}`}
              color={isActive ? "default" : "primary"}
              size="sm"
              variant="flat"
            >
              {item.badge}
            </Chip>
          )}
        </>
      )}
    </Button>
  );

  return (
    <li ref={itemRef} className={isCollapsed ? "flex justify-center" : ""}>
      {isCollapsed ? (
        <Tooltip
          showArrow
          content={
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <Chip color="primary" size="sm" variant="flat">
                  {item.badge}
                </Chip>
              )}
            </div>
          }
          placement="right"
        >
          {buttonContent}
        </Tooltip>
      ) : (
        buttonContent
      )}
    </li>
  );
};

export const Sidebar = ({
  isOpen,
  onClose,
  activeItemId,
  onItemClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeItemId: string;
  onItemClick: (id: string) => void;
}) => {
  const sidebarSections = [
    {
      title: "MAIN",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/admin/dashboard",
        },
      ],
    },

    {
      title: "MAINTENANCE",
      items: [
        {
          id: "maintenance-dashboard",
          label: "Overview",
          icon: BarChart3,
          href: "/admin/maintenance",
        },
        {
          id: "maintenance-requests",
          label: "Requests",
          icon: ClipboardList,
          href: "/admin/maintenance/requests",
          badge: 12,
        },
        {
          id: "maintenance-calendar",
          label: "Calendar",
          icon: Calendar,
          href: "/admin/maintenance/calendar",
        },
      ],
    },

    {
      title: "EQUIPMENT",
      items: [
        {
          id: "work-center",
          label: "Work Centers",
          icon: Wrench,
          href: "/admin/work-centers",
        },
        {
          id: "machines-tools",
          label: "Machines & Tools",
          icon: Cog,
          href: "/admin/machines-tools",
          badge: 2,
        },
      ],
    },

    {
      title: "REPORTING",
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: BarChart3,
          href: "/admin/reports",
        },
      ],
    },

    {
      title: "TEAMS",
      items: [
        {
          id: "technicians",
          label: "Technicians",
          icon: Users,
          href: "/admin/technicians",
        },
      ],
    },
  ];

  const [isCollapsed, setIsCollapsed] = useState(false);

  const { user } = useUser();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay/50 backdrop-blur-xs lg:hidden"
          role="button"
          tabIndex={0}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-content1 border-r border-divider z-50 transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:z-auto 
          ${isCollapsed ? "w-[88px]" : "w-72"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 p-4 border-b border-divider shrink-0">
            <div className="flex items-center gap-3">
              <Avatar
                showFallback
                className="w-10 h-10 shrink-0"
                src={user?.image || ""}
              />
              {!isCollapsed && (
                <div
                  className={`transition-all duration-300 overflow-hidden min-w-0${
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
                >
                  <h1 className="text-lg font-bold text-foreground text-nowrap">
                    CRM Admin
                  </h1>
                  <LiveClock className="text-sm text-foreground/70" />
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                isIconOnly
                className="hidden lg:flex"
                size="sm"
                variant="light"
                onPress={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
              <Button
                isIconOnly
                className="lg:hidden"
                size="sm"
                variant="light"
                onPress={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto scroll-smooth">
            <div className="space-y-6">
              {sidebarSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <SidebarTitle
                    isCollapsed={isCollapsed}
                    title={section.title}
                  />
                  <ul className="px-3 space-y-1">
                    {section.items.map((item) => (
                      <SidebarItem
                        key={item.id}
                        href={item.href}
                        isActive={activeItemId === item.id}
                        isCollapsed={isCollapsed}
                        item={item}
                        onClick={() => onItemClick(item.id)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* Help Section */}
          <div className="p-4 shrink-0">
            <Card className="bg-content2 border-divider">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    showFallback
                    className="w-8 h-8 bg-primary/10"
                    fallback={<HelpCircle className="w-4 h-4 text-primary" />}
                  />
                  {!isCollapsed && (
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Need Help?
                      </p>
                      <p className="text-xs text-foreground/50">
                        Contact support
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </aside>
    </>
  );
};
