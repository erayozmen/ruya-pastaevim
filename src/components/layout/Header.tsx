"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/site-data";
import { BrandMark } from "./BrandMark";
import { buildWhatsappHref } from "@/lib/whatsapp";

const navLinks = [
  { href: "/pastalar", label: "Pastalar" },
  { href: "/borek-hamur-isleri", label: "Börek & Hamur İşleri" },
  { href: "/hakkimizda", label: "Hikayemiz" },
  { href: "/galeri", label: "En Sevilenler" },
];

export function Header({ site }: { site: SiteSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappHref = buildWhatsappHref(
    "Merhaba, özel günümüz için pasta tasarımı hakkında bilgi almak istiyorum.",
    site.whatsappNumber,
  );

  return (
    <header className="sticky top-0 z-50 bg-vanilla/90 backdrop-blur-md border-b border-powder-pink/30 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex flex-col" aria-label={site.brandName}>
          <BrandMark name={site.brandName} variant="header" />
          <span className="font-script text-lg text-gold mt-0.5 tracking-wider">{site.tagline}</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-chocolate/80">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold transition-colors duration-200">
              {link.label}
            </Link>
          ))}
          <Link
            href="/#tasarla"
            className="hover:text-gold transition-colors duration-200 flex items-center gap-1.5 text-chocolate font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-peach animate-ping"></span> Pastanı Tasarla
          </Link>
          <Link href="/#yorumlar" className="hover:text-gold transition-colors duration-200">
            Mutlu Anlar
          </Link>
          <Link href="/iletisim" className="hover:text-gold transition-colors duration-200">
            İletişim
          </Link>
        </div>

        {/* Header CTA Button */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 sm:px-5 py-2.5 rounded-full font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <i className="fa-brands fa-whatsapp text-base"></i>
            <span className="hidden sm:inline">WhatsApp&apos;tan</span> Sipariş Ver
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden p-2 text-chocolate hover:text-gold focus:outline-none"
            aria-label="Menüyü Aç"
          >
            <i className="fa-solid fa-bars text-2xl"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden bg-vanilla border-b border-powder-pink/30 px-6 py-5 space-y-4 shadow-xl ${
          mobileMenuOpen ? "" : "hidden"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-chocolate font-medium hover:text-gold py-1"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/#tasarla"
          onClick={() => setMobileMenuOpen(false)}
          className="block text-peach font-semibold hover:text-gold py-1"
        >
          ✨ Pastanı Tasarla
        </Link>
        <Link
          href="/#yorumlar"
          onClick={() => setMobileMenuOpen(false)}
          className="block text-chocolate font-medium hover:text-gold py-1"
        >
          Mutlu Anlar
        </Link>
        <Link
          href="/iletisim"
          onClick={() => setMobileMenuOpen(false)}
          className="block text-chocolate font-medium hover:text-gold py-1"
        >
          İletişim
        </Link>
      </div>
    </header>
  );
}
