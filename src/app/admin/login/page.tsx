import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin) {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <h1 className="text-center text-xl font-semibold text-neutral-900">
          Rüyam Pasta Evim Yönetim Paneli
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
