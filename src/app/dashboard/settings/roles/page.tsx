import { RoleManagement } from "@/components/dashboard/settings/roles/RoleManagement";
import { getRolesAndPermissions } from "./actions/getRolesAndPermissions";

export default async function RolesPage() {
  // Busca todas as roles e permissões usando a action
  const { roles, permissionsByResource } = await getRolesAndPermissions();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfis e Permissões</h1>
      <RoleManagement 
        roles={roles} 
        permissionsByResource={permissionsByResource} 
      />
    </main>
  );
}
