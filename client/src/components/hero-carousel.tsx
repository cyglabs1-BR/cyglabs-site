import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "Especial Dia das Crianças! 🎨",
    subtitle: "Assine agora e ganhe 4 miniaturas para pintar!",
    buttonText: "Assinar Agora",
    bgClass: "bg-gradient-to-r from-primary to-accent",
    duration: 5000, // 5 segundos
  },
  {
    id: 2,
    title: "Coleção Halloween 🎃",
    subtitle: "Figuras assombradas em alta qualidade",
    buttonText: "Ver Coleção",
    bgClass: "bg-gradient-to-r from-orange-600 to-purple-800",
    duration: 5000,
  },
  {
    id: 3,
    title: "Aprenda a Pintar! 🎨",
    subtitle: "Tutoriais completos para suas figuras 3D",
    buttonText: "Ver Tutoriais",
    bgClass: "bg-gradient-to-r from-green-600 to-blue-600",
    duration: 5000,
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slides[currentSlide].duration);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-96 overflow-hidden">
      <div 
        className={`absolute inset-0 ${currentSlideData.bgClass} flex items-center justify-center text-center text-primary-foreground transition-all duration-1000`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-4" data-testid="carousel-title">
            {currentSlideData.title}
          </h2>
          <p className="text-xl md:text-2xl mb-6" data-testid="carousel-subtitle">
            {currentSlideData.subtitle}
          </p>
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            data-testid={`button-carousel-${currentSlideData.id}`}
          >
            {currentSlideData.buttonText}
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-primary-foreground' 
                : 'bg-primary-foreground/50'
            }`}
            data-testid={`carousel-indicator-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
