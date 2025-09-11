import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StlViewer from "./stl-viewer";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface ProductCatalogProps {
  categorySlug?: string;
  searchQuery?: string;
  featuredOnly?: boolean;
}

export default function ProductCatalog({ 
  categorySlug, 
  searchQuery, 
  featuredOnly = false 
}: ProductCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart, isAddingToCart } = useCart();

  // Construir a query string manualmente para evitar [object Object]
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (categorySlug) params.append('category', categorySlug);
    if (searchQuery) params.append('search', searchQuery);
    if (featuredOnly) params.append('featured', 'true');
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", categorySlug, searchQuery, featuredOnly],
    queryFn: async () => {
      const response = await fetch(`/api/products${buildQueryString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando produtos...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8" data-testid="catalog-title">
        {featuredOnly ? "Figuras em Destaque" : "Catálogo de Produtos"}
      </h2>
      
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer hover-lift"
              onClick={() => setSelectedProduct(product)}
              data-testid={`card-product-${product.id}`}
            >
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  data-testid={`img-product-${product.id}`}
                />
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-product-description-${product.id}`}>
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-secondary font-bold text-lg" data-testid={`text-product-price-${product.id}`}>
                    R$ {product.price}
                  </span>
                  <Badge variant={product.printType === 'resin' ? 'default' : 'outline'} className="text-accent">
                    {product.printType === 'resin' ? 'Resina' : 'Filamento'}
                  </Badge>
                </div>
                <Button 
                  variant="secondary"
                  className="w-full hover-lift" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  disabled={isAddingToCart}
                  data-testid={`button-buy-${product.id}`}
                >
                  {isAddingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {searchQuery 
              ? `Nenhum produto encontrado para "${searchQuery}"`
              : "Nenhum produto disponível nesta categoria"
            }
          </p>
        </div>
      )}

      {/* 3D Viewer Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="product-viewer">
          <div className="bg-card rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
              <Button 
                variant="outline" 
                onClick={() => setSelectedProduct(null)}
                data-testid="button-close-viewer"
              >
                Fechar
              </Button>
            </div>
            <div className="h-96 mb-4">
              {selectedProduct.stlFileUrl ? (
                <StlViewer stlUrl={selectedProduct.stlFileUrl} />
              ) : (
                <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Visualização 3D em breve</p>
                </div>
              )}
            </div>
            <p className="text-muted-foreground mb-4">{selectedProduct.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-secondary">R$ {selectedProduct.price}</span>
              <Button 
                variant="secondary"
                className="hover-lift"
                onClick={() => addToCart(selectedProduct.id)}
                disabled={isAddingToCart}
                data-testid="button-buy-from-viewer"
              >
                {isAddingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
