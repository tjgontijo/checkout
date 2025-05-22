'use client';

import { useMemo, useState } from 'react';
import { Permission, Resource, Action } from '@prisma/client';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PermissionCategoryProps {
  resourceName: string;
  permissions: Array<
    Permission & {
      resource: Resource | null;
      action: Action | null;
    }
  >;
  selectedPermissions: Record<string, boolean>;
  onTogglePermission: (permissionId: string, isChecked: boolean) => void;
  onToggleCategory: (resourceName: string, isChecked: boolean) => void;
}

export function PermissionCategory({
  resourceName,
  permissions,
  selectedPermissions,
  onTogglePermission,
  onToggleCategory,
}: PermissionCategoryProps) {
  // Determinar o estado do checkbox da categoria
  const categoryState = useMemo(() => {
    const permissionCount = permissions.length;
    const selectedCount = permissions.filter((p) => selectedPermissions[p.id]).length;

    if (selectedCount === 0) return false;
    if (selectedCount === permissionCount) return true;
    return 'indeterminate';
  }, [permissions, selectedPermissions]);

  // Função para alternar todas as permissões da categoria
  const handleCategoryToggle = () => {
    // Se todas ou algumas estão selecionadas, desmarca todas
    // Se nenhuma está selecionada, marca todas
    const newState = categoryState === false;
    onToggleCategory(resourceName, newState);
  };

  // Obter a descrição do recurso (resource)
  const resourceDescription = permissions[0]?.resource?.description || resourceName;

  // Estado para controlar a expansão da categoria
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2 overflow-hidden rounded-md border">
      <div className="flex w-full items-center px-4 py-2 hover:bg-muted/50">
        <div className="relative mr-2 flex items-center justify-center">
          <Checkbox
            id={`category-${resourceName}`}
            checked={categoryState === true}
            onCheckedChange={handleCategoryToggle}
            className={cn(
              'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
              categoryState === 'indeterminate' && 'bg-primary text-primary-foreground opacity-80'
            )}
          />
          {categoryState === 'indeterminate' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[2px] w-[8px] bg-current" />
            </div>
          )}
        </div>

        <div
          className="flex-1 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleCategoryToggle();
          }}
        >
          <label
            htmlFor={`category-${resourceName}`}
            className="block cursor-pointer text-sm font-medium"
          >
            {resourceDescription}
          </label>
        </div>

        <div className="flex items-center">
          <span className="mr-4 text-xs text-muted-foreground">
            {permissions.filter((p) => selectedPermissions[p.id]).length} / {permissions.length}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t px-4 py-2">
          <div className="ml-6 space-y-2">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions[permission.id] || false}
                  onCheckedChange={(checked) => onTogglePermission(permission.id, checked === true)}
                />
                <div className="flex items-center">
                  <label htmlFor={`permission-${permission.id}`} className="cursor-pointer text-sm">
                    {permission.description || permission.name}
                  </label>

                  {permission.description && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3.5 w-3.5 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80 text-sm">{permission.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            ))}

            {permissions.length === 0 && (
              <div className="py-2 text-sm text-muted-foreground">
                Nenhuma permissão nesta categoria
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
