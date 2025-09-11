import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SubscriptionCta() {
  return (
    <section className="bg-gradient-to-r from-primary to-accent py-16">
      <div className="container mx-auto px-4 text-center text-primary-foreground">
        <h2 className="text-4xl font-bold mb-4" data-testid="cta-title">
          Torne-se um Assinante Premium
        </h2>
        <p className="text-xl mb-8" data-testid="cta-description">
          Acesso exclusivo a novos modelos, descontos especiais e muito mais!
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <Link href="/premium">
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              data-testid="button-monthly-plan"
            >
              Plano Mensal - R$ 29,90
            </Button>
          </Link>
          <Link href="/premium">
            <Button 
              className="bg-card text-primary hover:bg-muted font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              data-testid="button-yearly-plan"
            >
              Plano Anual - R$ 299,90
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
