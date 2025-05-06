"use client";

import { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/dashboard/settings/users/actions/deleteUser";

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  userEmail: string;
  onSuccess?: () => void;
}

export function DeleteUserDialog({ userId, userName, userEmail, onSuccess }: DeleteUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const formData = new FormData();
      formData.append("userId", userId);
      
      const result = await deleteUser(formData);
      
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        
        // Chamar callback de sucesso, se fornecido
        if (onSuccess) {
          onSuccess();
        } else {
          // Recarregar a página para atualizar a lista
          window.location.reload();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao excluir usuário");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        className="text-red-600 hover:text-red-800 hover:bg-red-100 h-8 w-8 p-0"
        title="Excluir usuário"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Confirmar exclusão
          </DialogTitle>
          <DialogDescription>
            Você está prestes a excluir o usuário <strong>{userName}</strong> ({userEmail}).
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Todos os dados associados a este usuário serão removidos permanentemente do sistema.
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
            {isDeleting ? "Excluindo..." : "Excluir usuário"}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
