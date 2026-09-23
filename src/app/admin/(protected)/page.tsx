import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h1 className="text-lg font-semibold text-neutral-900">Hoş geldiniz</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Kategorileri, ürünleri, galeriyi ve medya kütüphanesini buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/categories"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Kategoriler</h2>
          <p className="mt-1 text-sm text-neutral-500">Pasta ve börek & hamur işi kategorilerini yönetin.</p>
        </Link>
        <Link
          href="/admin/cakes"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Ürünler</h2>
          <p className="mt-1 text-sm text-neutral-500">Ürünleri oluşturun ve düzenleyin.</p>
        </Link>
        <Link
          href="/admin/gallery"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Galeri</h2>
          <p className="mt-1 text-sm text-neutral-500">Medyadan galeri görselleri yayınlayın.</p>
        </Link>
        <Link
          href="/admin/reviews"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Yorumlar</h2>
          <p className="mt-1 text-sm text-neutral-500">Gerçek müşteri yorumlarını yayınlayın.</p>
        </Link>
        <Link
          href="/admin/customizer"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Customizer</h2>
          <p className="mt-1 text-sm text-neutral-500">Porsiyon, tema, renk ve lezzet seçeneklerini yönetin.</p>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Siparişler</h2>
          <p className="mt-1 text-sm text-neutral-500">Gelen sipariş taleplerini görüntüleyin.</p>
        </Link>
        <Link
          href="/admin/media"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Medya</h2>
          <p className="mt-1 text-sm text-neutral-500">Storage&apos;daki görselleri görüntüleyin ve yönetin.</p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Ayarlar</h2>
          <p className="mt-1 text-sm text-neutral-500">Ana sayfa Hero ve Hikayemiz içeriğini yönetin.</p>
        </Link>
      </div>
    </div>
  );
}
