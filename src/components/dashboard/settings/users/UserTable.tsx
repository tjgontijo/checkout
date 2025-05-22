'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { DeleteUserDialog } from './DeleteUserDialog';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { User, Role } from '@prisma/client';

// Componentes de tabela existentes
import { DataTablePagination } from '@/components/dashboard/data-table/pagination';
import { DataTableColumnHeader } from '@/components/dashboard/data-table/column-header';

// Componentes UI
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserRolePopover } from './UserRolePopover';

// Tipagem forte para as props
interface UserWithRoles extends User {
  roles: Role[];
}

interface UserTableProps {
  users: UserWithRoles[];
  roles: Role[];
}

export function UserTable({ users, roles }: UserTableProps) {
  // Estados para filtros, ordenação e visibilidade
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Definição das colunas
  const columns: ColumnDef<UserWithRoles>[] = [
    {
      accessorKey: 'fullName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
      cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="E-mail" />,
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Telefone" />,
      cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    },
    {
      id: 'roles',
      header: 'Perfil',
      cell: ({ row }) => <UserRolePopover user={row.original} roles={roles} />,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Data de Cadastro" />,
      cell: ({ row }) => (
        <div>{new Date(row.getValue('createdAt')).toLocaleDateString('pt-BR')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-3">
            <button
              className="rounded-full p-1 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-800"
              onClick={() => console.log('Editar', row.original.id)}
              title="Editar usuário"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <DeleteUserDialog
              userId={row.original.id}
              userName={row.original.fullName}
              userEmail={row.original.email}
            />
          </div>
        );
      },
    },
  ];

  // Configuração da tabela
  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      {/* Filtro de busca */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar usuários..."
          value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('fullName')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <DataTablePagination table={table} />
    </div>
  );
}
