'use client';

import { useState } from 'react';
import { Role } from '@prisma/client';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteRole } from '@/app/(private)/settings/roles/actions/deleteRole';

interface DeleteRoleDialogProps {
  roleToDelete: Role | null;
  onRoleDeleted: () => void;
  setErrorMsg: (msg: string | null) => void;
  setOpen: (open: boolean) => void;
}

export function DeleteRoleDialog({
  roleToDelete,
  onRoleDeleted,
  setErrorMsg,
  setOpen,
}: DeleteRoleDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteRole() {
    if (!roleToDelete) return;
    setLoading(true);
    // Limpa mensagens de erro anteriores
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('roleId', roleToDelete.id);
    const res = await deleteRole(formData);
    setLoading(false);

    if (res.success) {
      setOpen(false);
      onRoleDeleted();
    } else {
      // Usa o setErrorMsg recebido via props
      setErrorMsg(res.error || 'Erro ao excluir perfil');
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Excluir perfil</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        Tem certeza que deseja excluir o perfil <b>{roleToDelete?.name}</b>? Esta ação não pode ser
        desfeita.
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleDeleteRole} disabled={loading}>
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
