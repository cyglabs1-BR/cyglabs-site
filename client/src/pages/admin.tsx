import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Upload, Trash2 } from "lucide-react";
import type { Product, Category } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    printType: "resin" as "resin" | "filament",
    featured: false,
    imageUrl: "",
  });
  const [stlFile, setStlFile] = useState<File | null>(null);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto criado",
        description: "O produto foi adicionado com sucesso.",
      });
      setIsAddingProduct(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      printType: "resin",
      featured: false,
      imageUrl: "",
    });
    setStlFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    
    if (stlFile) {
      data.append("stlFile", stlFile);
    }
    
    createProductMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <Button 
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center gap-2"
            data-testid="button-add-product"
          >
            <Plus className="h-4 w-4" />
            Adicionar Produto
          </Button>
        </div>

        {/* Add Product Form */}
        {isAddingProduct && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-product-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      data-testid="input-product-price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    data-testid="textarea-product-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger data-testid="select-product-category">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="printType">Tipo de Impressão</Label>
                    <Select 
                      value={formData.printType} 
                      onValueChange={(value: "resin" | "filament") => setFormData({ ...formData, printType: value })}
                    >
                      <SelectTrigger data-testid="select-print-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resin">Resina</SelectItem>
                        <SelectItem value="filament">Filamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      data-testid="checkbox-product-featured"
                    />
                    <Label htmlFor="featured">Produto em destaque</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    data-testid="input-image-url"
                  />
                </div>

                <div>
                  <Label htmlFor="stlFile">Arquivo STL</Label>
                  <Input
                    id="stlFile"
                    type="file"
                    accept=".stl"
                    onChange={(e) => setStlFile(e.target.files?.[0] || null)}
                    data-testid="input-stl-file"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    disabled={createProductMutation.isPending}
                    data-testid="button-submit-product"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {createProductMutation.isPending ? "Salvando..." : "Salvar Produto"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddingProduct(false)}
                    data-testid="button-cancel-product"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando produtos...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products?.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-primary font-bold">R$ {product.price}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            product.printType === 'resin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.printType === 'resin' ? 'Resina' : 'Filamento'}
                          </span>
                          {product.featured && (
                            <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                              Destaque
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteProductMutation.isPending}
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {products?.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhum produto cadastrado ainda.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
