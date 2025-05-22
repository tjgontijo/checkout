import { ProductTableWrapper } from '@/components/dashboard/products/view/ProductTableWrapper';
import { ProductHeader } from '@/components/dashboard/products/view/ProductHeader';
import { fetchProducts } from './actions/fetchProducts';

export const metadata = {
  title: 'Produtos',
  description: 'Gerencie os produtos disponíveis para venda',
};

export default async function ProductsPage() {
  // Buscar produtos usando a action
  const { data: products } = await fetchProducts({
    limit: 10,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div className="space-y-6">
      <ProductHeader
        title="Produtos"
        description="Gerencie os produtos disponíveis para venda na sua loja."
      />

      <ProductTableWrapper products={products} />
    </div>
  );
}
