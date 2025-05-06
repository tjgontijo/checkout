import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MenuToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
}

export function MenuToolbar({ searchQuery, onSearchChange, onCreate }: MenuToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar itens de menu..."
          className="pl-8"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onCreate} className="ml-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Item
      </Button>
    </div>
  );
}
