import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroCarousel from "@/components/hero-carousel";
import CategorySidebar from "@/components/category-sidebar";
import ProductCatalog from "@/components/product-catalog";
import SubscriptionCta from "@/components/subscription-cta";
import InfoSection from "@/components/info-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <CategorySidebar />
        
        <main className="flex-1">
          <HeroCarousel />
          <ProductCatalog />
          <SubscriptionCta />
          <InfoSection />
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
