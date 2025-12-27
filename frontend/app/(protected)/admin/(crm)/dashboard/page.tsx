"use client";

import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  Plus,
  Calendar,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

import { useLayoutContext } from "../_context/layout-context";
import { PageLoader } from "../_components/loading-spinner";

import StaggeredFadeInList from "@/components/ui/animations/staggered-fade-in-list";

const DashboardPage = () => {
  const { setBreadcrumbs, setActiveMenuItem, isLoading, setIsLoading } =
    useLayoutContext();

  const stats = [
    {
      label: "Critical Equipment Issues",
      value: "1",
      subtitle: "Urgent Follow-up Required",
      icon: <Users />,
      color: "bg-danger-500/10",
      colorContrast: "bg-danger-500/70",
      borderColor: "border-danger",
    },
    {
      label: "Technician Availability",
      value: "15",
      subtitle: "Closing This Week",
      icon: <DollarSign />,
      color: "bg-primary-500/10",
      colorContrast: "bg-primary-500/70",
      borderColor: "border-warning",
    },
    {
      label: "Open Maintenance Requests",
      value: "3",
      subtitle: "In Progress",
      icon: <BarChart3 />,
      color: "bg-success-500/10",
      colorContrast: "bg-success-500/70",
      borderColor: "border-success",
      trend: "up",
      change: "12%",
    },
  ];

  const activities = [
    {
      title: "New contact added",
      subtitle: "Sarah Johnson",
      time: "2 minutes ago",
      type: "contact",
      avatar: "SJ",
    },
    {
      title: "Deal updated",
      subtitle: "Enterprise Solution - Rs25,000",
      time: "15 minutes ago",
      type: "deal",
      avatar: "ES",
    },
    {
      title: "Follow-up scheduled",
      subtitle: "Meeting with Tech Corp",
      time: "1 hour ago",
      type: "task",
      avatar: "TC",
    },
    {
      title: "Email campaign sent",
      subtitle: "Monthly Newsletter",
      time: "2 hours ago",
      type: "email",
      avatar: "MN",
    },
  ];

  const quickActions = [
    { icon: Plus, label: "Add New Contact", color: "primary" },
    { icon: DollarSign, label: "Create New Deal", color: "success" },
    { icon: Calendar, label: "Schedule Follow-up", color: "warning" },
    { icon: FileText, label: "Generate Report", color: "secondary" },
  ];

  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay (remove in production)
    setTimeout(() => {
      setBreadcrumbs([
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Overview" },
      ]);
      setActiveMenuItem("dashboard");
      setIsLoading(false);
    }, 500);
  }, [setBreadcrumbs, setActiveMenuItem, setIsLoading]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
        <StaggeredFadeInList>
          {stats.map((stat, index) => {
            const trendColor =
              stat.trend === "up" ? "text-success" : "text-danger";
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

            return (
              <Card
                key={index}
                className="transition-shadow duration-200 bg-content1 hover:shadow-md"
                shadow="sm"
              >
                <CardBody className={`p-4 sm:p-6  ${stat.color} `}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-sm font-medium truncate text-foreground/60">
                        {stat.label}
                      </p>
                      <h3 className="mb-2 text-2xl font-bold sm:text-3xl text-foreground">
                        {stat.value}
                      </h3>
                      <div className="flex items-center gap-1">
                        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                        <span className={`text-sm font-medium ${trendColor}`}>
                          {stat.change}
                        </span>
                        <span className="ml-1 text-xs text-foreground/50">
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg sm:p-3  ${stat.colorContrast} `}>{stat.icon}</div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </StaggeredFadeInList>
      </div>

      {/* Chart and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Chart Section */}
        <Card className="bg-content1 lg:col-span-2" shadow="sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold sm:text-xl text-foreground">
                  Performance Overview
                </h3>
                <p className="mt-1 text-sm text-foreground/60">
                  Monthly revenue and deal tracking
                </p>
              </div>
              <div className="flex gap-2">
                <Button color="primary" size="sm" variant="flat">
                  This Month
                </Button>
                <Button size="sm" variant="light">
                  Last 3 Months
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {/* Chart Placeholder */}
            <div className="flex items-center justify-center h-64 rounded-lg sm:h-80 bg-content2">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-foreground/40" />
                <p className="font-medium text-foreground/60">
                  Chart visualization
                </p>
                <p className="text-sm text-foreground/50">
                  Revenue trends and analytics
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-bold text-foreground">
                Recent Activity
              </h3>
              <Button color="primary" size="sm" variant="light">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar
                  className="bg-primary text-primary-foreground"
                  name={activity.avatar}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm truncate text-foreground/60">
                    {activity.subtitle}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}

            <Divider className="my-4" />

            {/* Quick Actions */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Quick Actions
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <Button
                      key={index}
                      className="justify-start h-auto p-3"
                      startContent={<Icon className="w-4 h-4" />}
                      variant="light"
                    >
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {/* Recent Deals */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-bold text-foreground">Recent Deals</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              { name: "Tech Corp", value: "Rs25,000", status: "In Progress" },
              { name: "StartupXYZ", value: "Rs15,000", status: "Negotiation" },
              {
                name: "Enterprise Ltd",
                value: "Rs45,000",
                status: "Closed Won",
              },
            ].map((deal, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {deal.name}
                  </p>
                  <p className="text-sm text-foreground/60">{deal.value}</p>
                </div>
                <Chip
                  color={deal.status === "Closed Won" ? "success" : "primary"}
                  size="sm"
                  variant="flat"
                >
                  {deal.status}
                </Chip>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-bold text-foreground">
              Upcoming Tasks
            </h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              {
                task: "Follow up with Sarah",
                time: "Today 2:00 PM",
                type: "call",
              },
              {
                task: "Send proposal to Tech Corp",
                time: "Tomorrow 10:00 AM",
                type: "email",
              },
              { task: "Team meeting", time: "Friday 3:00 PM", type: "meeting" },
            ].map((task, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {task.type === "call" && (
                    <Phone className="w-4 h-4 text-primary" />
                  )}
                  {task.type === "email" && (
                    <Mail className="w-4 h-4 text-primary" />
                  )}
                  {task.type === "meeting" && (
                    <Calendar className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {task.task}
                  </p>
                  <p className="text-sm text-foreground/60">{task.time}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Performance Summary */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-bold text-foreground">This Month</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Contacts Added</span>
              <span className="text-sm font-medium text-foreground">127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Deals Created</span>
              <span className="text-sm font-medium text-foreground">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Calls Made</span>
              <span className="text-sm font-medium text-foreground">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Emails Sent</span>
              <span className="text-sm font-medium text-foreground">456</span>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Goal Progress
              </span>
              <Chip color="success" size="sm" variant="flat">
                78%
              </Chip>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
