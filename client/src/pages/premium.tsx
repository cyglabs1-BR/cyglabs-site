import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star } from "lucide-react";
import type { Subscription } from "@shared/schema";

export default function Premium() {
  const { data: subscriptions, isLoading } = useQuery<Subscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando planos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-accent mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Assinatura Premium
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesse modelos exclusivos, receba descontos especiais e faça parte de uma comunidade premium de entusiastas da impressão 3D.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-secondary mx-auto mb-4" />
              <CardTitle>Modelos Exclusivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Acesso a uma biblioteca crescente de modelos únicos criados especialmente para assinantes premium.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl mb-4">💰</div>
              <CardTitle>Descontos Especiais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                20% de desconto em todas as compras e acesso antecipado a lançamentos e promoções.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl mb-4">🎨</div>
              <CardTitle>Tutoriais Avançados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vídeos exclusivos sobre técnicas avançadas de pintura e finishing para suas miniaturas.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subscriptions?.map((subscription) => (
            <Card key={subscription.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-sm font-medium">
                Mais Popular
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{subscription.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">
                    R$ {subscription.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ou R$ {subscription.yearlyPrice} por ano (2 meses grátis)
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    data-testid="button-subscribe-monthly"
                  >
                    Assinar Plano Mensal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    data-testid="button-subscribe-yearly"
                  >
                    Assinar Plano Anual
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento. 
                  Você manterá o acesso aos benefícios até o final do período pago.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Os modelos ficam disponíveis para sempre?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Todos os modelos baixados durante sua assinatura ficam seus para sempre. 
                  Mesmo após o cancelamento, você poderá imprimir os arquivos já baixados.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Existe limite de downloads?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Não! Com a assinatura premium você tem downloads ilimitados de todos os modelos disponíveis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
