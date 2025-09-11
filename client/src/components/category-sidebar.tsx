import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Crown } from "lucide-react";
import type { Category } from "@shared/schema";

export default function CategorySidebar() {
  const [location] = useLocation();
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <aside className="w-64 bg-card border-r border-border hidden lg:block sticky top-20 h-screen overflow-y-auto">
      <div className="p-6">
        <h3 className="font-semibold text-foreground mb-4" data-testid="sidebar-title">
          Categorias
        </h3>
        <nav className="space-y-2">
          <Link href="/">
            <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              location === "/" ? "bg-muted" : "hover:bg-muted"
            }`} data-testid="link-category-all">
              <i className="fas fa-th-large text-secondary"></i>
              <span>Todos os Produtos</span>
            </a>
          </Link>
          
          {categories?.map((category) => (
            <Link key={category.id} href={`/?category=${category.slug}`}>
              <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                location.includes(`category=${category.slug}`) ? "bg-muted" : "hover:bg-muted"
              }`} data-testid={`link-category-${category.slug}`}>
                <i className={`${category.icon} text-secondary`}></i>
                <span>{category.name}</span>
              </a>
            </Link>
          ))}
        </nav>
        
        {/* Premium Subscription CTA */}
        <Card className="mt-8 bg-accent text-accent-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Assinatura Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              Acesse modelos exclusivos e tenha descontos especiais!
            </p>
            <Link href="/premium">
              <Button 
                className="w-full bg-card text-accent font-medium hover:bg-muted transition-colors"
                data-testid="button-premium-cta"
              >
                Saiba Mais
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
