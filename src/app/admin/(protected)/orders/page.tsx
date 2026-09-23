import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  QUOTED: "Teklif Verildi",
  CONFIRMED: "Onaylandı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  QUOTED: "bg-purple-50 text-purple-700",
  CONFIRMED: "bg-green-50 text-green-700",
  COMPLETED: "bg-neutral-100 text-neutral-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("order_requests")
    .select("id, customer_name, phone, portion_label, theme_label, color_label, flavor_label, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Sipariş Talepleri</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Müşterilerin &quot;Pastanı Tasarla&quot; üzerinden gönderdiği talepler.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Sipariş talepleri yüklenemedi: {error.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Özet</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id} className="border-b border-neutral-100 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                  {dateFormatter.format(new Date(order.created_at))}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{order.customer_name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{order.phone}</td>
                <td className="max-w-xs truncate px-4 py-3 text-neutral-500">
                  {order.portion_label} · {order.theme_label} · {order.color_label} · {order.flavor_label}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[order.status] ?? "bg-neutral-100 text-neutral-700"}`}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-neutral-700 hover:underline">
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && !error && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Henüz sipariş talebi yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
