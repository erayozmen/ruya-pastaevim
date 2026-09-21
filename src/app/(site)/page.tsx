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
import { getHomePageData } from "@/lib/public-queries";

export default async function Home() {
  const [{ options, error: customizerError }, home] = await Promise.all([
    getCustomizerOptions(),
    getHomePageData(),
  ]);
  const { site, categories, heroCake, galleryItems, reviews } = home;

  const initialState = {
    portion: options.portions[0]?.value ?? "",
    theme: options.themes[0]?.value ?? "",
    color: options.colors[0]?.value ?? "",
    flavor: options.flavors[0]?.value ?? "",
    note: "",
  };

  return (
    <>
        <Hero site={site} heroCake={heroCake} featuredReview={reviews[0] ?? null} />
        <StorySection site={site} />

        <CustomizerProvider initialState={initialState}>
          <CategoriesSection categories={categories} />
          <GallerySection items={galleryItems} site={site} />
          <CakeCustomizer options={options} error={customizerError} site={site} />
        </CustomizerProvider>

        <ReviewsSection reviews={reviews} />
        <InstagramSection site={site} />
        <FinalCTA site={site} />
    </>
  );
}
