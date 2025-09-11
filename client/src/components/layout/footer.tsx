import { Button } from "@/components/ui/button";
import { Instagram, MessageCircle, Music, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">CYGLABS 3D</h3>
            <p className="text-muted-foreground mb-4">
              Especialistas em impressões 3D de alta qualidade. Transformamos suas ideias em realidade com tecnologia de ponta.
            </p>
            <div className="space-y-2">
              <p className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-secondary mr-2" />
                <a 
                  href="tel:11920566022" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-phone-1"
                >
                  (11) 92056-6022
                </a>
              </p>
              <p className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-secondary mr-2" />
                <a 
                  href="tel:21966535862" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-phone-2"
                >
                  (21) 96653-5862
                </a>
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors" data-testid="footer-link-catalog">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="/premium" className="hover:text-primary transition-colors" data-testid="footer-link-premium">
                  Assinatura Premium
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-tutorials">
                  Tutoriais de Pintura
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-about">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-contact">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Siga-nos</h4>
            <div className="flex space-x-4 mb-4">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all"
              >
                <a 
                  href="https://instagram.com/cyglabs3d" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="social-instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-green-500 hover:text-white transition-all"
              >
                <a 
                  href="https://wa.me/5511920566022" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="social-whatsapp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-black hover:text-white transition-all"
              >
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="social-tiktok"
                >
                  <Music className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-red-500 hover:text-white transition-all"
              >
                <a 
                  href="mailto:contato@cyglabs3d.com"
                  data-testid="social-email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Acompanhe nossos projetos e novidades nas redes sociais!
            </p>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CYGLABS 3D. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
