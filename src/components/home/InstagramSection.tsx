import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { siteConfig } from "@/lib/site-config";
import { instagramShots } from "@/lib/instagram-data";

export function InstagramSection() {
  return (
    <section className="py-16 bg-vanilla">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="font-script text-2xl sm:text-3xl text-gold font-semibold">
          Canlı Mutfak Günlüğü
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate mb-2">
          Mutfağımızdan Çıkan Güzellikler
        </h2>
        <p className="text-chocolate/70 text-sm mb-10">
          Her gün fırından yeni çıkan tatları Instagram sayfamızda paylaşıyoruz.
        </p>

        {/* 6 Image Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramShots.map((shot) => (
            <div
              key={shot.image}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm"
            >
              <ImageWithFallback
                src={shot.image}
                alt={shot.alt}
                fallbackSrc="https://placehold.co/400x400/F6C7C9/49352F?text=Instagram"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-chocolate/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <i className="fa-brands fa-instagram text-2xl"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a
            href={siteConfig.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-chocolate hover:text-gold font-semibold text-sm transition-colors"
          >
            <span>Instagram&apos;da Daha Fazlasını Gör</span>
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
