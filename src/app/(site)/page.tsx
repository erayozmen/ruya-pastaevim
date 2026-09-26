import { Hero } from "@/components/home/Hero";
import { StorySection } from "@/components/home/StorySection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PastrySection } from "@/components/home/PastrySection";
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
  const {
    site,
    categories,
    pastryCategories,
    pastryProducts,
    heroCake,
    reviews,
    feedbackImages,
    customizerPreviewPool,
  } = home;

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
          <PastrySection products={pastryProducts} categories={pastryCategories} />
          <InstagramSection site={site} />
          <CakeCustomizer
            options={options}
            error={customizerError}
            site={site}
            previewPool={customizerPreviewPool}
          />
        </CustomizerProvider>

        <ReviewsSection reviews={reviews} feedbackImages={feedbackImages} />
        <FinalCTA site={site} />
    </>
  );
}
