import { buildWhatsappHref } from "@/lib/whatsapp";

export function MobileWhatsAppButton() {
  const href = buildWhatsappHref("Merhaba, butik pasta siparişi vermek istiyorum.");

  return (
    <div className="sm:hidden fixed bottom-5 right-5 z-40">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Sipariş"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-3xl shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </div>
  );
}
