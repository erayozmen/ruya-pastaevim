import Link from "next/link";
import { PageIntro } from "@/components/public/PageIntro";

export default function SiteNotFound() {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <PageIntro
          script="Hay aksi"
          title="Aradığınız sayfa bulunamadı"
          description="Bağlantı hatalı olabilir ya da bu içerik artık yayında değil."
        />
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full bg-chocolate text-vanilla font-semibold text-sm hover:bg-chocolate/90 shadow-md transition-all"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/pastalar"
            className="px-7 py-3.5 rounded-full bg-powder-pink/70 hover:bg-powder-pink text-chocolate font-semibold text-sm border border-powder-pink transition-all"
          >
            Pastalara Göz At
          </Link>
        </div>
      </div>
    </section>
  );
}
