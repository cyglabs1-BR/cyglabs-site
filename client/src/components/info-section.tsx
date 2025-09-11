import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Box, Check } from "lucide-react";

export default function InfoSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12" data-testid="info-title">
        Impressão em Resina vs Filamento
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Droplets className="h-6 w-6 text-secondary mr-3" />
              Impressão em Resina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Alta resolução e detalhamento excepcional</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Superfície lisa e acabamento profissional</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Ideal para miniaturas e peças pequenas</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Perfeito para pintura detalhada</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Box className="h-6 w-6 text-secondary mr-3" />
              Impressão em Filamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Maior resistência e durabilidade</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Ideal para objetos funcionais e utilitários</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Variedade de materiais e cores</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Custo-benefício para peças grandes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
