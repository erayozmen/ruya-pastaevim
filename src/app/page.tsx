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
import { getCustomizerOptions } from "@/lib/customizer-queries";

export default async function Home() {
  const { options, error: customizerError } = await getCustomizerOptions();

  const initialState = {
    portion: options.portions[0]?.value ?? "",
    theme: options.themes[0]?.value ?? "",
    color: options.colors[0]?.value ?? "",
    flavor: options.flavors[0]?.value ?? "",
    note: "",
  };

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main>
        <Hero />
        <StorySection />

        <CustomizerProvider initialState={initialState}>
          <CategoriesSection />
          <GallerySection />
          <CakeCustomizer options={options} error={customizerError} />
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
