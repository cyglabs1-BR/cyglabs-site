import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroCarousel from "@/components/hero-carousel";
import CategorySidebar from "@/components/category-sidebar";
import ProductCatalog from "@/components/product-catalog";
import SubscriptionCta from "@/components/subscription-cta";
import InfoSection from "@/components/info-section";
import ShoppingCartComponent from "@/components/shopping-cart";
import { useCart } from "@/hooks/use-cart";

export default function Home() {
  const { isCartOpen, closeCart, sessionId } = useCart();

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
      
      {/* Shopping Cart */}
      <ShoppingCartComponent 
        isOpen={isCartOpen}
        onClose={closeCart}
        sessionId={sessionId}
      />
    </div>
  );
}
