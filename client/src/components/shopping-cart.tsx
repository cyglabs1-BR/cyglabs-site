import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CartItem, Product } from "@shared/schema";

interface CartWithProducts extends CartItem {
  product: Product;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export default function ShoppingCartComponent({ isOpen, onClose, sessionId }: ShoppingCartProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery<CartWithProducts[]>({
    queryKey: ["/api/cart", sessionId],
    enabled: isOpen,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar quantidade do item.",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Item removido",
        description: "O item foi removido do carrinho.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover item do carrinho.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/cart/clear", { sessionId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Carrinho limpo",
        description: "Todos os itens foram removidos do carrinho.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao limpar carrinho.",
        variant: "destructive",
      });
    },
  });

  const total = cartItems?.reduce((sum, item) => 
    sum + parseFloat(item.product.price) * item.quantity, 0
  ) || 0;

  const itemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-card w-full max-w-md h-full overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho de Compras
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-cart"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando carrinho...</p>
            </div>
          ) : cartItems && cartItems.length > 0 ? (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant={item.product.printType === 'resin' ? 'default' : 'secondary'}>
                            {item.product.printType === 'resin' ? 'Resina' : 'Filamento'}
                          </Badge>
                          <span className="font-bold text-primary">
                            R$ {item.product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantityMutation.mutate({ 
                            id: item.id, 
                            quantity: Math.max(1, item.quantity - 1) 
                          })}
                          disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantityMutation.mutate({ 
                            id: item.id, 
                            quantity: item.quantity + 1 
                          })}
                          disabled={updateQuantityMutation.isPending}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItemMutation.mutate(item.id)}
                        disabled={removeItemMutation.isPending}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Itens no carrinho:</span>
                  <span data-testid="cart-item-count">{itemCount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span data-testid="cart-total">R$ {total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    data-testid="button-checkout"
                  >
                    Finalizar Compra
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => clearCartMutation.mutate()}
                    disabled={clearCartMutation.isPending}
                    data-testid="button-clear-cart"
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione alguns produtos incríveis!
              </p>
              <Button onClick={onClose} data-testid="button-continue-shopping">
                Continuar Comprando
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}