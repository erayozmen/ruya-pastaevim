import type { SiteSettings } from "@/lib/site-data";

/**
 * No Instagram feed integration exists, so this section deliberately shows
 * no photo grid: presenting stock or unrelated images as if they were real
 * Instagram posts would be misleading. It links to the real account instead.
 */
export function InstagramSection({ site }: { site: SiteSettings }) {
  return (
    <section className="py-16 bg-vanilla">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="font-script text-2xl sm:text-3xl text-gold font-semibold">
          Canlı Mutfak Günlüğü
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate mb-2">
          Mutfağımızdan Çıkan Güzellikler
        </h2>
        <p className="text-chocolate/70 text-sm mb-8">
          Güncel çalışmalarımızı Instagram sayfamızda paylaşıyoruz.
        </p>

        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-chocolate hover:text-gold font-semibold text-sm transition-colors"
        >
          <i className="fa-brands fa-instagram text-lg"></i>
          <span>{site.instagramHandle} - Instagram&apos;da Daha Fazlasını Gör</span>
          <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </section>
  );
}
