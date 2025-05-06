"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Role, Permission, Resource, Action } from "@prisma/client";
import { Search, Plus, Edit, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateRoleDialog } from "./CreateRoleDialog";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { EditRoleDialog } from "./EditRoleDialog";

// Tipagem forte para as props
interface RoleWithPermissions extends Role {
  permissions: Array<{
    permission: Permission & {
      resource: Resource | null;
      action: Action | null;
    }
  }>;
}

interface RoleSidebarProps {
  roles: RoleWithPermissions[];
  selectedRoleId: string | null;
  onSelectRole: (roleId: string) => void;
}

export function RoleSidebar({ roles, selectedRoleId, onSelectRole }: RoleSidebarProps) {
  // Estado para filtro de busca
  const [searchQuery, setSearchQuery] = useState("");
  // Estado para feedback - usado para exibir mensagens de sucesso/erro


  // Estado dos Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleWithPermissions | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<RoleWithPermissions | null>(null);

  // Atualiza a página ao criar/excluir/editar role
  function handleRoleCreated() {
    toast({
      title: "Perfil criado com sucesso!",
      variant: "default"
    });
  }
  function handleRoleDeleted() {
    toast({
      title: "Perfil excluído com sucesso!",
      variant: "default"
    });
  }
  function handleRoleUpdated() {
    toast({
      title: "Perfil atualizado com sucesso!",
      variant: "default"
    });
  }

  // Filtra as roles com base na busca
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho com busca e botão de adicionar */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-semibold">Perfis</h2>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Adicionar perfil</span>
              </Button>
            </DialogTrigger>
            <CreateRoleDialog 
              onRoleCreated={handleRoleCreated} 
              setErrorMsg={(msg: string | null) => {
                if (msg) {
                  toast({
                    title: "Erro ao criar perfil",
                    description: msg,
                    variant: "destructive"
                  });
                }
              }} 
              setOpen={setCreateDialogOpen} 
            />
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar perfis..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de roles */}
      <div className="flex-1 overflow-auto">
        {filteredRoles.length > 0 ? (
          <ul className="divide-y">
            {filteredRoles.map((role) => (
              <li 
                key={role.id}
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/50 transition-colors relative group",
                  selectedRoleId === role.id && "bg-muted"
                )}
                onClick={() => onSelectRole(role.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{role.description}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {role.permissions.length} permissões
                    </div>
                  </div>
                  
                  {/* Ações (visíveis apenas no hover) */}
                  <div className="hidden group-hover:flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoleToEdit(role);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoleToDelete(role);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Nenhum perfil encontrado
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DeleteRoleDialog 
          roleToDelete={roleToDelete} 
          onRoleDeleted={() => {
            handleRoleDeleted();
            setDeleteDialogOpen(false);
          }} 
          setErrorMsg={(msg: string | null) => {
            if (msg) {
              toast({
                title: "Erro ao excluir perfil",
                description: msg,
                variant: "destructive"
              });
            }
          }} 
          setOpen={setDeleteDialogOpen} 
        />
      </Dialog>

      {/* Modal de edição de role */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditRoleDialog 
          roleToEdit={roleToEdit} 
          onRoleUpdated={() => {
            handleRoleUpdated();
            setEditDialogOpen(false);
          }} 
          setErrorMsg={(msg: string | null) => {
            if (msg) {
              toast({
                title: "Erro ao editar perfil",
                description: msg,
                variant: "destructive"
              });
            }
          }} 
          setOpen={setEditDialogOpen} 
        />
      </Dialog>
    </div>
  );
}
