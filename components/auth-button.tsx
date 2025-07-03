import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getCurrentUser } from "@/lib/database/users";
import { Badge } from "./ui/badge";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const user = await getCurrentUser();
  const displayName = user?.full_name || authUser.email;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Hey, {displayName}!</span>
        {user?.role === 'admin' && (
          <Badge variant="secondary" className="text-xs">
            Admin
          </Badge>
        )}
      </div>
      <LogoutButton />
    </div>
  );
}
