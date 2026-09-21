import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileWhatsAppButton } from "@/components/layout/MobileWhatsAppButton";
import { getSiteSettings } from "@/lib/public-queries";

/** Shared chrome for every public page: same header, footer and WhatsApp button as the homepage. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();

  return (
    <>
      <AnnouncementBar />
      <Header site={site} />
      <main>{children}</main>
      <Footer site={site} />
      <MobileWhatsAppButton site={site} />
    </>
  );
}
