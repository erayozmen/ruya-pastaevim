import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileWhatsAppButton } from "@/components/layout/MobileWhatsAppButton";
import { Hero } from "@/components/home/Hero";
import { StorySection } from "@/components/home/StorySection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { CakeCustomizer } from "@/components/home/CakeCustomizer";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { CustomizerProvider } from "@/context/customizer-context";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main>
        <Hero />
        <StorySection />

        <CustomizerProvider>
          <CategoriesSection />
          <GallerySection />
          <CakeCustomizer />
        </CustomizerProvider>

        <ReviewsSection />
        <InstagramSection />
        <FinalCTA />
      </main>

      <Footer />
      <MobileWhatsAppButton />
    </>
  );
}
