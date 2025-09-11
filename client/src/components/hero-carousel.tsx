import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroCarousel() {
  return (
    <section className="relative min-h-screen hero-bg">
      <div className="absolute inset-0 hero-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-center min-h-screen">
            {/* Imagem/Visual - 60% */}
            <div className="lg:col-span-6 flex justify-center items-center order-2 lg:order-1">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Impressão 3D de qualidade"
                  className="rounded-lg shadow-2xl max-w-full h-auto"
                  data-testid="hero-image"
                />
                <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg shadow-lg">
                  <p className="font-bold text-lg">Qualidade Premium</p>
                </div>
              </div>
            </div>

            {/* Conteúdo - 30% */}
            <div className="lg:col-span-4 text-center lg:text-left text-white order-1 lg:order-2">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow" data-testid="hero-title">
                CYGLABS IMPRIMINDO A SUA{" "}
                <span className="text-secondary">IMAGINAÇÃO</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200" data-testid="hero-subtitle">
                CYGLABS 3D - Transformamos suas ideias em realidade com impressão 3D de alta qualidade
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#catalogo">
                  <Button 
                    variant="secondary"
                    size="lg"
                    className="text-lg px-8 py-4 hover-lift"
                    data-testid="button-hero-cta"
                  >
                    Explorar Catálogo
                  </Button>
                </a>
                
                <Link href="/premium">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary hover-lift"
                    data-testid="button-hero-premium"
                  >
                    Assinar Premium
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-accent">500+</p>
                  <p className="text-sm text-gray-300">Modelos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">24h</p>
                  <p className="text-sm text-gray-300">Entrega</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">100%</p>
                  <p className="text-sm text-gray-300">Qualidade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
