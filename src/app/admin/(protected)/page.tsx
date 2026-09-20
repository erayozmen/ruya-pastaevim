import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h1 className="text-lg font-semibold text-neutral-900">Hoş geldiniz</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Yönetim paneli hazırlanıyor. Galeri, yorum, özelleştirici ve sipariş yönetimi ilerleyen
          sprintlerde bu alana eklenecek.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/categories"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Kategoriler</h2>
          <p className="mt-1 text-sm text-neutral-500">Pasta kategorilerini yönetin.</p>
        </Link>
        <Link
          href="/admin/cakes"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Pastalar</h2>
          <p className="mt-1 text-sm text-neutral-500">Pastaları oluşturun ve düzenleyin.</p>
        </Link>
        <Link
          href="/admin/media"
          className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400"
        >
          <h2 className="text-sm font-semibold text-neutral-900">Medya</h2>
          <p className="mt-1 text-sm text-neutral-500">Storage&apos;daki görselleri görüntüleyin ve yönetin.</p>
        </Link>
      </div>
    </div>
  );
}
