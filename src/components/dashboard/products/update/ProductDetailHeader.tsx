'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductDetailHeaderProps {
  title?: string;
  description: string;
  isActive: boolean;
  productId?: string;
  onSave?: () => void;
  isSaving?: boolean;
}

export function ProductDetailHeader({
  description,
  isActive,
  onSave,
  isSaving = false,
}: ProductDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="z-50 flex flex-col gap-3 border-b bg-background/95 pb-4 pt-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/products')}
            className="h-9 w-9 rounded-full transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium tracking-tight">Editar Produto</h1>
          <Badge
            variant={isActive ? 'default' : 'destructive'}
            className={`ml-1 px-2 py-0 text-xs font-medium ${isActive ? 'border-emerald-500/20 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20' : 'border-red-500/20 bg-red-500/15 text-red-600 hover:bg-red-500/20'}`}
          >
            {isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        <p className="ml-12 text-sm text-muted-foreground">{description}</p>
      </div>

      {onSave && (
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="shrink-0 bg-primary shadow-sm transition-colors hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Salvando
            </>
          ) : (
            <>
              Salvar
              <Save className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
