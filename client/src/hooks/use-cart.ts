import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem("cart_session_id");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", id);
    }
    setSessionId(id);
  }, []);

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      return apiRequest("POST", "/api/cart", {
        sessionId,
        productId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Produto adicionado ao carrinho",
        description: "Item adicionado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao adicionar produto ao carrinho. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const addToCart = (productId: string, quantity = 1) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return {
    sessionId,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    isAddingToCart: addToCartMutation.isPending,
  };
}