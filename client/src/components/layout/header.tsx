import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, Phone, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Search for:", searchQuery);
    }
  };

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-2" data-testid="link-home">
                <h1 className="text-2xl font-bold text-primary">CYGLABS 3D</h1>
                <span className="text-sm text-muted-foreground hidden md:block">
                  Impressões 3D Premium
                </span>
              </div>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Buscar figuras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={openCart}
              className="flex items-center space-x-2"
              data-testid="button-open-cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Carrinho</span>
            </Button>
            
            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <span className="text-muted-foreground">Contato:</span>
              <a 
                href="tel:11920566022" 
                className="text-primary hover:underline flex items-center"
                data-testid="link-phone-1"
              >
                <Phone className="h-4 w-4 mr-1" />
                (11) 92056-6022
              </a>
              <a 
                href="tel:21966535862" 
                className="text-primary hover:underline flex items-center"
                data-testid="link-phone-2"
              >
                <Phone className="h-4 w-4 mr-1" />
                (21) 96653-5862
              </a>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Buscar figuras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
              data-testid="input-search-mobile"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden border-t pt-4">
            <div className="space-y-2">
              <Link href="/premium">
                <a className="block py-2 text-primary hover:underline" data-testid="link-premium-mobile">
                  Assinatura Premium
                </a>
              </Link>
              <Link href="/admin">
                <a className="block py-2 text-primary hover:underline" data-testid="link-admin-mobile">
                  Área Administrativa
                </a>
              </Link>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-2">Contatos:</p>
                <a href="tel:11920566022" className="block py-1 text-primary">(11) 92056-6022</a>
                <a href="tel:21966535862" className="block py-1 text-primary">(21) 96653-5862</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
