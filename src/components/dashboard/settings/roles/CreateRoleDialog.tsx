'use client';

import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createRole } from '@/app/(private)/settings/roles/actions/createRole';

interface CreateRoleDialogProps {
  onRoleCreated: () => void;
  setErrorMsg: (msg: string | null) => void;
  setOpen: (open: boolean) => void;
}

export function CreateRoleDialog({ onRoleCreated, setErrorMsg, setOpen }: CreateRoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    const res = await createRole(formData);
    setLoading(false);
    if (res.success) {
      setName('');
      setDescription('');
      setOpen(false);
      onRoleCreated();
    } else {
      setErrorMsg(res.error || 'Erro ao criar perfil');
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar novo perfil</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="role-name" className="block text-sm font-medium">
            Nome
          </label>
          <Input
            id="role-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={50}
            autoFocus
            placeholder="Nome do perfil"
          />
        </div>
        <div>
          <label htmlFor="role-description" className="block text-sm font-medium">
            Descrição
          </label>
          <Input
            id="role-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={2}
            maxLength={255}
            placeholder="Descrição do perfil"
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar perfil'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
