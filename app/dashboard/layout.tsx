import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/database/users";
import { DashboardNav } from "@/components/dashboard/nav";
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
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Atchalta Task Manager</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <DashboardNav />
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
} 