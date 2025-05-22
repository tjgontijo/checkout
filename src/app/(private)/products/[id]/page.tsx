import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/dashboard/products/update/ProductForm';
import { fetchProduct } from '../actions/fetchProduct';

export const metadata = {
  title: 'Editar Produto',
  description: 'Configure os detalhes do produto',
};

export default async function ProductPage({
  params,
  searchParams: _searchParams
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // _searchParams is intentionally unused but typed for PageProps compatibility
}) {
  try {
    // Extrair o ID do produto de forma segura
    const { id } = params;

    // Buscar o produto pelo ID
    const product = await fetchProduct(id);

    // Preparar os dados para o formulário
    const formData = {
      ...product,
      cardRedirectUrl: product.thankYouRedirect?.cardRedirectUrl || null,
      pixRedirectUrl: product.thankYouRedirect?.pixRedirectUrl || null,
    };

    return (
      <div className="space-y-0">
        <ProductForm product={formData} productId={id} />
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar página do produto:', error);
    notFound();
  }
}
