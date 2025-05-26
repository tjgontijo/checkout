import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/dashboard/products/update/ProductForm';
import { Metadata } from 'next';

// Definindo o tipo para os parâmetros conforme Next.js 15
export type paramsType = Promise<{ id: string }>;

// Função para gerar metadados dinâmicos
export async function generateMetadata(props: { params: paramsType }): Promise<Metadata> {
  try {
    const { id } = await props.params;
    const productData = await getProductData(id);

    if (!productData) {
      return {
        title: 'Produto não encontrado',
        description: 'O produto solicitado não foi encontrado',
      };
    }

    return {
      title: `Editar Produto - ${productData.name}`,
      description: productData.description,
    };
  } catch (error) {
    console.error('Erro ao gerar metadados:', error);
    return {
      title: 'Editar Produto',
      description: 'Configure os detalhes do produto',
    };
  }
}

// Interface para o produto retornado pela API
interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  salesPageUrl: string;
  isActive: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productAsset?: {
    id: string;
    bucket: string;
    objectKey: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    expiryDays: number;
    productId: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  store: {
    id: string;
    name: string;
  };
}

// Função para buscar os dados do produto da API
async function getProductData(id: string): Promise<ProductData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erro ao buscar produto: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      return null;
    }
    
    // Retorna os dados do produto
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}



// Componente principal da página
export default async function ProductPage(props: { params: paramsType }) {
  try {
    const { id } = await props.params;
    
    // Buscar o produto pelo ID usando a nova função
    const productData = await getProductData(id);

    if (!productData) {
      notFound();
    }

    // Preparar os dados para o formulário
    const formData = {
      ...productData,
      // Campos adicionais que podem ser necessários para o formulário
      cardRedirectUrl: null,
      pixRedirectUrl: null,
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
