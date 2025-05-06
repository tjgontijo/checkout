"use client";

import { useState, useEffect } from "react";
import { Role } from "@prisma/client";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateRole } from "@/app/dashboard/settings/roles/actions/updateRole";

interface EditRoleDialogProps {
  roleToEdit: Role | null;
  onRoleUpdated: () => void;
  setErrorMsg: (msg: string | null) => void;
  setOpen: (open: boolean) => void;
}

export function EditRoleDialog({ 
  roleToEdit, 
  onRoleUpdated, 
  setErrorMsg, 
  setOpen 
}: EditRoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Carrega os dados da role quando o componente é montado ou quando roleToEdit muda
  useEffect(() => {
    if (roleToEdit) {
      setName(roleToEdit.name);
      setDescription(roleToEdit.description);
    }
  }, [roleToEdit]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!roleToEdit) return;
    
    setLoading(true);
    setErrorMsg(null);
    
    const formData = new FormData();
    formData.append("roleId", roleToEdit.id);
    formData.append("name", name);
    formData.append("description", description);
    
    const res = await updateRole(formData);
    setLoading(false);
    
    if (res.success) {
      setOpen(false);
      onRoleUpdated();
    } else {
      setErrorMsg(res.error || "Erro ao atualizar perfil");
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar perfil</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="role-name" className="block text-sm font-medium">Nome</label>
          <Input
            id="role-name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            minLength={2}
            maxLength={50}
            autoFocus
            placeholder="Nome do perfil"
          />
        </div>
        <div>
          <label htmlFor="role-description" className="block text-sm font-medium">Descrição</label>
          <Input
            id="role-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            minLength={2}
            maxLength={255}
            placeholder="Descrição do perfil"
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
