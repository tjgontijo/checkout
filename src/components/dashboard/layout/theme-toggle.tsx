'use client';

import * as React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-2 border-gray-200 bg-white transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 text-gray-900 transition-transform duration-200 dark:-rotate-90 dark:scale-0 dark:text-gray-400" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 text-gray-900 transition-transform duration-200 dark:rotate-0 dark:scale-100 dark:text-gray-400" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-2 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Sun className="mr-2 h-4 w-4 text-gray-900 dark:text-gray-400" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Moon className="mr-2 h-4 w-4 text-gray-900 dark:text-gray-400" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Laptop className="mr-2 h-4 w-4 text-gray-900 dark:text-gray-400" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
