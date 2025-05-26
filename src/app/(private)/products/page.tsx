import { ProductTableWrapper } from '@/components/dashboard/products/view/ProductTableWrapper';
import { ProductHeader } from '@/components/dashboard/products/view/ProductHeader';

export const metadata = {
  title: 'Produtos',
  description: 'Gerencie os produtos disponíveis para venda',
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  salesPageUrl: string;
  isActive: boolean;
  storeId: string;
  store: {
    id: string;
    name: string;
  };
  productAsset?: {
    id: string;
    bucket: string;
    objectKey: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    expiryDays: number;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

type ApiResponse = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

async function fetchProducts() {
  const url = new URL('/api/products', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
  url.searchParams.append('page', '1');
  url.searchParams.append('limit', '10');
  url.searchParams.append('sortBy', 'createdAt');
  url.searchParams.append('sortOrder', 'desc');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Falha ao carregar produtos');
  }

  return response.json() as Promise<ApiResponse>;
}

export default async function ProductsPage() {
  const { data: products } = await fetchProducts();

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
