import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Sacramento } from "next/font/google";
import { buildOpenGraph } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
  display: "swap",
});

const defaultTitle = `${siteConfig.brand.name} | Butik Pasta, Özel Günler İçin Hamur İşleri`;
const defaultDescription =
  "Doğum günleri, söz & nişan, baby shower ve en özel kutlamalarınız için size özel tasarlanan butik pastalar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: buildOpenGraph({ title: defaultTitle, description: defaultDescription, path: "/" }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`scroll-smooth ${cormorant.variable} ${jakarta.variable} ${sacramento.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="selection:bg-powder-pink selection:text-chocolate">{children}</body>
    </html>
  );
}
