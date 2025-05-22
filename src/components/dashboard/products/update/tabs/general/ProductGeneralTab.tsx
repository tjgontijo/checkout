'use client';

import { Control } from 'react-hook-form';
import { ProductFormValues } from '../../ProductForm';
import { ProductPriceSection } from './ProductPriceSection';
import { ProductDetailsSection } from './ProductDetailsSection'; // Novo import

// Tipo para as props do componente
interface ProductGeneralTabProps {
  control: Control<ProductFormValues>;
}

export function ProductGeneralTab({ control }: ProductGeneralTabProps) {
  return (
    <div className="space-y-8">
      {/* Seção Detalhes do Produto */}
      <ProductDetailsSection control={control} />

      {/* Seção Preços */}
      <ProductPriceSection control={control} />
    </div>
  );
}
