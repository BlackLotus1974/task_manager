"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    title: "My work",
    href: "/dashboard/tasks",
    icon: "💼",
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: "⭐",
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: "📁",
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: "👥",
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav">
      <ul>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <li key={item.href} className={isActive ? "active" : ""}>
              <Link href={item.href}>
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Keep the old export for backward compatibility
export const DashboardNav = Nav; 