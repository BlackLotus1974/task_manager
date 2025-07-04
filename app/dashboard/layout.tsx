import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/database/users";
import { Nav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("🔍 DashboardLayout: Starting authentication check");
  
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  console.log("🔍 DashboardLayout: Auth user:", authUser ? `${authUser.email} (${authUser.id})` : "null");
  
  if (!authUser) {
    console.log("❌ DashboardLayout: No auth user, redirecting to login");
    redirect("/auth/login");
  }

  console.log("🔍 DashboardLayout: Getting user profile from database");
  const user = await getCurrentUser();
  
  console.log("🔍 DashboardLayout: User profile:", user ? `${user.email} (${user.id})` : "null");
  
  if (!user) {
    console.log("❌ DashboardLayout: No user profile found, redirecting to login");
    redirect("/auth/login");
  }

  console.log("✅ DashboardLayout: Authentication successful, rendering dashboard");

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span style={{fontSize: '24px'}}>📋</span>
            <span>Atchalta Task Manager</span>
          </div>
          <button className="plans-btn">
            See plans
          </button>
        </div>

        <Nav />

        <div className="sidebar-section">
          <div className="section-header">
            <span>My workspaces</span>
            <i style={{transform: 'rotate(90deg)'}}>▶</i>
          </div>
          <ul className="workspace-list">
            <li className="active-workspace">
              <div className="workspace-icon" style={{backgroundColor: '#6c5ce7'}}>
                A
              </div>
              <span>Atchalta Workspace</span>
            </li>
          </ul>
          <button className="add-workspace-btn">
            +
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="main-header">
          <div className="header-icons">
            <i style={{position: 'relative'}}>🔔
              <span className="notification-badge">3</span>
            </i>
            <i>❓</i>
            <i>⚙️</i>
          </div>
          <div className="user-profile">
            <Suspense fallback={<div style={{color: 'var(--text-secondary)'}}>Loading...</div>}>
              <UserNav user={user} />
            </Suspense>
          </div>
        </div>

        <div className="content-body">
          {children}
        </div>
      </div>
    </div>
  );
} 