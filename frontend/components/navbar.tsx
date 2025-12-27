import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

export const Navbar = () => {
  return (
    <HeroUINavbar
      className="backdrop-blur-xl bg-white/5 border-b border-white/10"
      maxWidth="xl"
      position="sticky"
    >
      {/* Left: Brand */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <NextLink className="flex items-center gap-3" href="/">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              GearGuard
            </span>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Center: Desktop Nav Links */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        <NavbarItem>
          <Link
            as={NextLink}
            className="text-white/80 hover:text-white"
            href="#features"
          >
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            as={NextLink}
            className="text-white/80 hover:text-white"
            href="#pricing"
          >
            Pricing
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right: CTA */}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem>
          <Button
            as={NextLink}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold"
            endContent={<ArrowRight className="w-4 h-4" />}
            href="/sign-up"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Toggle */}
      <NavbarContent className="md:hidden" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-black/80 backdrop-blur-xl">
        <NavbarMenuItem>
          <Link as={NextLink} className="text-white text-lg" href="#features">
            Features
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link as={NextLink} className="text-white text-lg" href="#pricing">
            Pricing
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            fullWidth
            as={NextLink}
            className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold"
            endContent={<ArrowRight className="w-4 h-4" />}
            href="/get-started"
          >
            Get Started
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
