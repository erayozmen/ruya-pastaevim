import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusForm } from "./OrderStatusForm";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminOrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from("order_requests").select("*").eq("id", id).single();

  if (!order) notFound();

  const whatsappDigits = order.phone.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Sipariş Detayı</h1>
          <p className="mt-1 text-sm text-neutral-500">{dateFormatter.format(new Date(order.created_at))}</p>
        </div>
        <Link href="/admin/orders" className="text-sm text-neutral-600 hover:text-neutral-900">
          ← Listeye Dön
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Müşteri Bilgileri</h2>
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <dt className="text-neutral-500">Ad Soyad</dt>
              <dd className="font-medium text-neutral-900">{order.customer_name}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Telefon</dt>
              <dd className="font-medium text-neutral-900">{order.phone}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">WhatsApp</dt>
              <dd>
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline"
                >
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp&apos;tan Yaz
                </a>
              </dd>
            </div>
            {order.event_date && (
              <div>
                <dt className="text-neutral-500">Etkinlik Tarihi</dt>
                <dd className="font-medium text-neutral-900">{order.event_date}</dd>
              </div>
            )}
          </dl>

          <h2 className="mt-2 text-sm font-semibold text-neutral-900">Customizer Seçimleri</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-neutral-500">Porsiyon</dt>
              <dd className="font-medium text-neutral-900">{order.portion_label}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Tema</dt>
              <dd className="font-medium text-neutral-900">{order.theme_label}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Renk</dt>
              <dd className="font-medium text-neutral-900">{order.color_label}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Lezzet</dt>
              <dd className="font-medium text-neutral-900">{order.flavor_label}</dd>
            </div>
          </dl>

          {order.note && (
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Not</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-neutral-700">{order.note}</p>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Durum &amp; Fiyat</h2>
          <OrderStatusForm order={order} />
        </section>
      </div>
    </div>
  );
}
