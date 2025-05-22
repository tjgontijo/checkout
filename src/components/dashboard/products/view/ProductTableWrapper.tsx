'use client';

import { useRouter } from 'next/navigation';
import { ProductTable, Product } from './ProductTable';

interface ProductTableWrapperProps {
  products: Product[];
}

export function ProductTableWrapper({ products }: ProductTableWrapperProps) {
  const router = useRouter();

  const handleEdit = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleDelete = () => {
    // A função de exclusão é tratada pelo componente DeleteProductDialog
    // que já está integrado no ProductTable
    router.refresh();
  };

  return <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />;
}
