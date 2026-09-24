import { createClient } from "@/lib/supabase/server";
import { HomepageSettingsForm } from "./HomepageSettingsForm";
import { updateHomepageSettings } from "./actions";

export default async function AdminSettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  const { instagram } = await searchParams;
  const supabase = await createClient();
  const { data: settings, error } = await supabase.from("site_settings").select("*").eq("id", true).single();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Ayarlar</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Ayarlar yüklenemedi: {error.message}
        </div>
      )}

      {instagram === "connected" && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Instagram hesabı başarıyla bağlandı.
        </div>
      )}
      {instagram === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Instagram hesabı bağlanamadı. Lütfen tekrar deneyin.
        </div>
      )}

      {settings && (
        <section className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Ana Sayfa</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Hero görseli, Hikayemiz başlığı, metni ve görseli buradan yönetilir.
            </p>
          </div>
          <HomepageSettingsForm action={updateHomepageSettings} settings={settings} />
        </section>
      )}

      <section className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Instagram Bağlantısı</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Ana sayfadaki Instagram bölümünün @ruyapastaevim hesabından gerçek gönderileri
            gösterebilmesi için hesabı Instagram Business Login ile bağlayın.
          </p>
        </div>
        <a
          href="/api/instagram/authorize"
          className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Instagram Hesabını Bağla
        </a>
      </section>
    </div>
  );
}
