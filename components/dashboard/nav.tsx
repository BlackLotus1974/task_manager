"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  CheckSquare, 
  Kanban, 
  FolderOpen, 
  Users, 
  Bell, 
  Settings 
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: CheckSquare,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: Kanban,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 lg:space-x-8">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || 
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              isActive 
                ? "text-primary border-b-2 border-primary pb-2" 
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
} 