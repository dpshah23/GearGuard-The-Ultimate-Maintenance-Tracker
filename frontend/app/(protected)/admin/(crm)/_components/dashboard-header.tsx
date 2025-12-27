import { Button } from "@heroui/button";
import { Bell, Calendar, Menu, Search } from "lucide-react";
import { Input } from "@heroui/input";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";

import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";

import { ThemeSwitch } from "@/components/theme-switch";
// import { User } from "@/app/generated/prisma";
// TODO: Fix user context
type User = any;
export const DashboardHeader = ({
  user,
  onMenuToggle,
  breadcrumbs = [],
  isPending,
}: {
  user?: User | null;
  onMenuToggle: () => void;
  breadcrumbs?: BreadcrumbItem[] | null;
  isPending: boolean;
}) => {
  const router = useRouter();
  const handleSignOut = async () => {
    console.log("Sign out clicked");
    // await signOutAction();
    // TODO: Invalidate user context or session here
    router.push("/sign-in");
  };

  return (
    <header className="px-3 py-3 border-b sm:px-6 sm:py-4 border-divider bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* Left section - Menu and greeting */}
        <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-4">
          <Button
            isIconOnly
            className="flex-shrink-0 lg:hidden"
            variant="ghost"
            onPress={onMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 min-w-0">
            {/* Dynamic greeting based on time of day */}
            {(() => {
              const now = new Date();
              const hour = now.getHours();
              let greeting = "Good Morning";

              if (hour >= 5 && hour < 12) greeting = "Good Morning";
              else if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
              else if (hour >= 17 && hour < 21) greeting = "Good Evening";
              else greeting = "Good Night";

              return user?.name ? (
                <h1 className="text-lg font-bold truncate sm:text-2xl">
                  {greeting}, <span className="text-primary">{user.name}</span>
                </h1>
              ) : (
                <h1 className="text-lg font-bold sm:text-2xl">{greeting}</h1>
              );
            })()}
            <p className="hidden mt-1 text-xs sm:text-sm text-foreground/60 sm:block">
              Your performance summary this week
            </p>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mt-1 sm:mt-2">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center flex-shrink-0 gap-1 sm:gap-2 md:gap-4">
          {/* Search - Hidden on mobile, compact on tablet */}
          <div className="hidden md:block">
            <Input
              className="w-60 lg:w-80"
              placeholder="Search..."
              startContent={<Search className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
          </div>

          {/* Mobile search button */}
          <Button isIconOnly className="md:hidden" size="sm" variant="ghost">
            <Search className="w-4 h-4" />
          </Button>

          {/* Notification icons with responsive sizing */}
          <Badge color="danger" content="3" variant="solid">
            <Button isIconOnly className="relative" size="sm" variant="flat">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Badge>

          <Badge color="danger" variant="solid">
            <Button isIconOnly size="sm" variant="flat">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Badge>

          {/* Theme switch - hidden on small mobile */}
          <div className="hidden sm:block">
            <ThemeSwitch />
          </div>

          {/* User avatar */}
          {isPending ? (
            <Spinner size="sm" />
          ) : (
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  showFallback
                  className="sm:w-8 sm:h-8"
                  size="sm"
                  src={user?.image as string}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile menu" variant="flat">
                <DropdownItem key="profile" href="/profile">
                  Profile
                </DropdownItem>
                <DropdownItem key="theme" className="sm:hidden">
                  <div className="flex items-center gap-2">
                    <span>Theme</span>
                    <ThemeSwitch />
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="sign-out"
                  className="text-danger"
                  color="danger"
                  onPress={handleSignOut}
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
};
