import React from "react";
import {
  Wrench,
  Calendar,
  LayoutDashboard,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Users,
  Laptop,
  Bell,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar, AvatarGroup } from "@heroui/avatar";

import AnimatedBackground from "@/components/animated-background";
import { Navbar } from "@/components/navbar";

export default function GearGuardLanding() {
  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: "Kanban Workflow",
      description:
        "Drag-and-drop interface for seamless request management across stages",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description:
        "Visual calendar for preventive maintenance with automated reminders",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Auto-Assignment",
      description:
        "Intelligent routing based on equipment type and team expertise",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description:
        "Track performance metrics and identify maintenance patterns",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Asset Protection",
      description:
        "Complete tracking with warranty info and maintenance history",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Management",
      description:
        "Organize specialized teams for mechanics, IT, and electricians",
    },
  ];

  const stats = [
    { value: "10x", label: "Faster Response" },
    { value: "85%", label: "Less Downtime" },
    { value: "100+", label: "Assets Tracked" },
    { value: "24/7", label: "Monitoring" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <AnimatedBackground />

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <Chip
              className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300"
              startContent={<Sparkles className="w-4 h-4" />}
            >
              The Ultimate Maintenance Tracker
            </Chip>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Keep Your Assets
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Running Flawlessly
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Seamlessly connect equipment, teams, and maintenance requests.
              Transform reactive repairs into proactive maintenance management.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg px-8 py-6 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
                endContent={<ArrowRight className="w-5 h-5" />}
                size="lg"
              >
                Start Free Trial
              </Button>
              <Button
                className="border-white/20 text-white font-semibold text-lg px-8 py-6 hover:bg-white/5"
                size="lg"
                startContent={<Laptop className="w-5 h-5" />}
                variant="bordered"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <Card
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
              >
                <CardBody className="text-center py-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 mt-2">{stat.label}</div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Chip className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 mb-4">
              POWERFUL FEATURES
            </Chip>
            <h2 className="text-5xl font-bold mb-4">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Master Maintenance
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                isPressable
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
              >
                <CardBody className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-blue-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Streamlined Workflow</h2>
            <p className="text-xl text-slate-300">
              From breakdown to repair in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Request",
                description:
                  "Auto-fill equipment details and assign to the right team instantly",
                icon: <Bell className="w-8 h-8" />,
              },
              {
                step: "02",
                title: "Track Progress",
                description:
                  "Drag tasks through Kanban stages with real-time updates",
                icon: <TrendingUp className="w-8 h-8" />,
              },
              {
                step: "03",
                title: "Complete & Analyze",
                description:
                  "Record duration, close tickets, and view performance insights",
                icon: <CheckCircle2 className="w-8 h-8" />,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <CardBody className="p-8">
                    <div className="text-6xl font-bold text-white/10 mb-4">
                      {item.step}
                    </div>
                    <div className="text-blue-400 mb-4">{item.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </CardBody>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-blue-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-none shadow-2xl">
            <CardBody className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform Your Maintenance?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join hundreds of companies managing their assets smarter
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  className="bg-white text-blue-600 font-semibold text-lg px-8 py-6 hover:bg-blue-50"
                  endContent={<ArrowRight className="w-5 h-5" />}
                  size="lg"
                >
                  Get Started Free
                </Button>
                <Button
                  className="border-white text-white font-semibold text-lg px-8 py-6 hover:bg-white/10"
                  size="lg"
                  variant="bordered"
                >
                  Contact Sales
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4">
                <AvatarGroup isBordered max={4} size="sm">
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                </AvatarGroup>
                <p className="text-white/90 text-sm">
                  <span className="font-semibold">2,500+</span> teams trust
                  GearGuard
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">GearGuard</span>
          </div>
          <p>© 2025 GearGuard. The Ultimate Maintenance Tracker.</p>
        </div>
      </footer>
    </div>
  );
}
