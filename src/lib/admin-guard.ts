import "server-only";
import { createClient } from "@/lib/supabase/server";

/** True only for a signed-in user with the ADMIN role — same check as the admin layout. */
export async function isRequestFromAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  return isAdmin === true;
}
