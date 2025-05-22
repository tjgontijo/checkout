'use client';

import { useState, useMemo, useEffect } from 'react';
import { Role, Permission, Resource, Action } from '@prisma/client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PermissionCategory } from './PermissionCategory';
import { toast } from 'sonner';

// Tipagem forte para as props
interface RoleWithPermissions extends Role {
  permissions: Array<{
    permission: Permission & {
      resource: Resource | null;
      action: Action | null;
    };
  }>;
}

interface PermissionPanelProps {
  role: RoleWithPermissions;
  permissionsByResource: Record<
    string,
    Array<
      Permission & {
        resource: Resource | null;
        action: Action | null;
      }
    >
  >;
}

export function PermissionPanel({ role, permissionsByResource }: PermissionPanelProps) {
  // Estado para filtro de busca
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para controlar as permissões modificadas
  // Usamos o id da role como chave de dependência para resetar o estado quando a role mudar
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>(() => {
    // Inicializa com as permissões atuais da role
    const initialState: Record<string, boolean> = {};
    role.permissions.forEach(({ permission }) => {
      initialState[permission.id] = true;
    });
    return initialState;
  });

  // Resetar o estado quando a role mudar
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    role.permissions.forEach(({ permission }) => {
      initialState[permission.id] = true;
    });
    setSelectedPermissions(initialState);
  }, [role.id, role.permissions]); // Adicionando role.permissions como dependência

  // Verifica se houve alterações nas permissões
  const hasChanges = useMemo(() => {
    // Verifica se alguma permissão foi adicionada ou removida
    const currentPermissionIds = role.permissions.map((p) => p.permission.id);
    const selectedPermissionIds = Object.entries(selectedPermissions)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    // Se o número de permissões é diferente, houve alteração
    if (currentPermissionIds.length !== selectedPermissionIds.length) {
      return true;
    }

    // Verifica se todas as permissões selecionadas estão nas permissões atuais
    return !selectedPermissionIds.every((id) => currentPermissionIds.includes(id));
  }, [role.permissions, selectedPermissions]);

  // Filtra as categorias e permissões com base na busca
  const filteredPermissionsByResource = useMemo(() => {
    if (!searchQuery) return permissionsByResource;

    const filtered: typeof permissionsByResource = {};

    Object.entries(permissionsByResource).forEach(([resourceName, permissions]) => {
      const matchingPermissions = permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resourceName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingPermissions.length > 0) {
        filtered[resourceName] = matchingPermissions;
      }
    });

    return filtered;
  }, [permissionsByResource, searchQuery]);

  // Função para alternar uma permissão
  const togglePermission = (permissionId: string, isChecked: boolean) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: isChecked,
    }));
  };

  // Função para alternar todas as permissões de uma categoria
  const toggleCategory = (resourceName: string, isChecked: boolean) => {
    const permissionsInCategory = permissionsByResource[resourceName] || [];

    const updates: Record<string, boolean> = {};
    permissionsInCategory.forEach((permission) => {
      updates[permission.id] = isChecked;
    });

    setSelectedPermissions((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Função para salvar as alterações
  const saveChanges = async () => {
    try {
      // Preparar os dados para enviar à Server Action
      const permissionIds = Object.entries(selectedPermissions)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);

      // Importa a Server Action dinamicamente
      // Caminho absoluto para evitar erros de importação
      const { updateRolePermissions } = await import('@/app/(private)/settings/roles/actions');

      // Chama a Server Action
      const formData = new FormData();
      formData.append('roleId', role.id);
      formData.append('permissionIds', JSON.stringify(permissionIds));

      const result = await updateRolePermissions(formData);

      // Usar setTimeout para garantir que o toast seja exibido após a renderização
      setTimeout(() => {
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      }, 0);
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      // Usar setTimeout para garantir que o toast seja exibido após a renderização
      setTimeout(() => {
        toast.error('Ocorreu um erro ao atualizar as permissões');
      }, 0);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Cabeçalho com informações da role */}
      <div className="border-b bg-muted/30 p-4">
        <h2 className="text-xl font-semibold">{role.name}</h2>
        <p className="text-sm text-muted-foreground">{role.description}</p>
      </div>

      {/* Barra de busca e ações */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar permissões..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={saveChanges} disabled={!hasChanges}>
            {hasChanges
              ? `Salvar alterações (${Object.values(selectedPermissions).filter(Boolean).length})`
              : 'Sem alterações'}
          </Button>
        </div>
      </div>

      {/* Lista de categorias e permissões */}
      <div className="flex-1 overflow-auto p-4">
        {Object.keys(filteredPermissionsByResource).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(filteredPermissionsByResource).map(([resourceName, permissions]) => (
              <PermissionCategory
                key={resourceName}
                resourceName={resourceName}
                permissions={permissions}
                selectedPermissions={selectedPermissions}
                onTogglePermission={togglePermission}
                onToggleCategory={toggleCategory}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery
              ? 'Nenhuma permissão encontrada para esta busca'
              : 'Nenhuma permissão disponível'}
          </div>
        )}
      </div>
    </div>
  );
}
