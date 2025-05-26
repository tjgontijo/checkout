'use client';

import { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// Função para deletar um produto via API
async function deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao excluir produto');
  }

  return data;
}

interface DeleteProductDialogProps {
  productId: string | number;
  productName: string;
  onSuccess?: () => void;
}

export function DeleteProductDialog({
  productId,
  productName,
  onSuccess,
}: DeleteProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteProduct(productId.toString());
      
      toast.success('Produto excluído com sucesso!');
      setIsOpen(false);

      // Chamar callback de sucesso, se fornecido
      if (onSuccess) {
        onSuccess();
      } else {
        // Recarregar a página para atualizar a lista
        window.location.reload();
      }
    } catch (error) {
      toast.error('Erro ao excluir produto');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription>
              Você está prestes a excluir o produto <strong>{productName}</strong>. Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              O produto será marcado como excluído e não aparecerá mais nas listagens. No entanto,
              os dados históricos relacionados a este produto serão mantidos.
            </p>
          </div>

          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir produto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
