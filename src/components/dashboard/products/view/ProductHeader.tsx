'use client';

import { CreateProductDialog } from '../create/CreateProductDialog';

interface ProductHeaderProps {
  title: string;
  description: string;
}

export function ProductHeader({ title, description }: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <CreateProductDialog />
    </div>
  );
}
