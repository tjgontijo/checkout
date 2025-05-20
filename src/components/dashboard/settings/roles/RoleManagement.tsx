"use client";

import { useState, useEffect } from "react";
import { Role, Permission, Resource, Action } from "@prisma/client";
import { RoleSidebar } from "./RoleSidebar";
import { PermissionPanel } from "./PermissionPanel";

// Tipagem forte para as props
interface RoleWithPermissions extends Role {
  permissions: Array<{
    permission: Permission & {
      resource: Resource | null;
      action: Action | null;
    }
  }>;
}

interface RoleManagementProps {
  roles: RoleWithPermissions[];
  permissionsByResource: Record<string, Array<Permission & {
    resource: Resource | null;
    action: Action | null;
  }>>;
}

export function RoleManagement({ roles, permissionsByResource }: RoleManagementProps) {
  // Estado para controlar a role selecionada
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    roles.length > 0 ? roles[0].id : null
  );
  
  // Efeito para garantir que selectedRoleId seja válido quando os roles mudarem
  useEffect(() => {
    if (roles.length > 0 && (!selectedRoleId || !roles.some(role => role.id === selectedRoleId))) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);
  


  // Encontra a role selecionada
  const selectedRole = roles.find(role => role.id === selectedRoleId) || null;
  


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar com lista de roles (1/4 da largura em desktop) */}
      <div className="md:col-span-1 border rounded-lg overflow-hidden">
        <RoleSidebar 
          roles={roles} 
          selectedRoleId={selectedRoleId} 
          onSelectRole={setSelectedRoleId} 
        />
      </div>

      {/* Painel principal com permissões (3/4 da largura em desktop) */}
      <div className="md:col-span-3 border rounded-lg overflow-hidden">
        {selectedRole ? (
          <PermissionPanel 
            role={selectedRole} 
            permissionsByResource={permissionsByResource} 
          />
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Selecione um perfil para gerenciar suas permissões
          </div>
        )}
      </div>
    </div>
  );
}
