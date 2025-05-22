'use client';

import { useState } from 'react';
import { User, Role } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

// Tipagem forte para as props
interface UserWithRoles extends User {
  roles: Role[];
}

interface UserRolePopoverProps {
  user: UserWithRoles;
  roles: Role[];
}

export function UserRolePopover({ user, roles }: UserRolePopoverProps) {
  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(user.roles[0]?.id || '');

  // Encontra o nome da role atual para exibição
  const currentRoleName = user.roles[0]?.name || 'Sem perfil';

  // Função para atualizar a role do usuário usando Server Action
  const handleUpdateRole = async (roleId: string) => {
    // Se a role selecionada for a mesma, apenas fecha o popover
    if (roleId === user.roles[0]?.id) {
      setOpen(false);
      return;
    }

    // Cria um FormData para enviar à Server Action
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('roleId', roleId);

    try {
      // Importa a Server Action dinamicamente para evitar problemas de SSR
      const { updateUserRole } = await import('@/app/(private)/settings/users/actions');

      // Chama a Server Action
      const result = await updateUserRole(formData);

      if (result.success) {
        toast.success(result.message);
        setSelectedRoleId(roleId); // Atualiza o estado local
        setOpen(false); // Fecha o popover
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Ocorreu um erro ao atualizar o perfil do usuário');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {currentRoleName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar perfil..." />
          <CommandEmpty>Nenhum perfil encontrado.</CommandEmpty>
          <CommandGroup>
            {roles.map((role) => (
              <CommandItem
                key={role.id}
                value={role.id}
                onSelect={() => {
                  handleUpdateRole(role.id);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedRoleId === role.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {role.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
