import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Tipagem forte local, alinhada ao schema do Prisma
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  salesPageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

interface OrderSummaryProps {
  products: Product[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ products }) => {
  const [coupon, setCoupon] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [discount, setDiscount] = React.useState(0);
  const [error, setError] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(() => products.length <= 1);

  if (!products || products.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-center">
        <h2 className="text-lg font-semibold text-red-600">Nenhum produto selecionado para pagamento.</h2>
      </div>
    );
  }

  const currency = products[0].priceCurrency;
  const subtotal = products.reduce((acc, p) => acc + p.price, 0);
  const total = subtotal - discount;

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (coupon.trim().toUpperCase() === 'DESCONTO10') {
      const discountValue = subtotal * 0.1;
      setDiscount(discountValue);
      setAppliedCoupon('DESCONTO10');
      setError('');
    } else {
      setDiscount(0);
      setAppliedCoupon(null);
      setError('Cupom inválido ou não encontrado.');
    }
  }

  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(total);
  
  return (
    <Card className="shadow-md sticky top-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 border-b cursor-pointer hover:bg-gray-50 transition-colors rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <CardTitle>
                  {isOpen ? 'Resumo do Pedido' : (
                    <div className="flex flex-col">
                      <span>Resumo ({products.length})</span>
                      <span className="text-xs text-muted-foreground">Informações da sua compra</span>
                    </div>
                  )}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {!isOpen && <span className="font-medium">{formattedTotal}</span>}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            {/* Lista de produtos */}
            <div className="space-y-4 mb-4">
              {products.map(product => (
                <div key={product.id} className="flex items-center gap-3 pb-2">
                  <div className="w-14 h-14 rounded bg-gray-100 overflow-hidden flex-shrink-0 relative">
                    <Image src={product.salesPageUrl} alt={product.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-sm sm:text-base text-gray-900 truncate">{product.name}</span>
                    <span className="text-sm text-gray-600 mt-0.5">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Linha divisória para cupom */}
            <Separator className="my-4 w-2/3 mx-auto border border-muted opacity-80" />
            {/* Cupom de desconto */}
            <div className="mb-3">
              <span className="block text-sm text-muted-foreground mb-1">Tem cupom?</span>
              <form className="flex gap-2" onSubmit={handleApplyCoupon} autoComplete="off">
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Cupom de desconto"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  disabled={!!appliedCoupon}
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded text-sm font-medium border border-primary text-primary bg-transparent hover:bg-primary/10 transition disabled:opacity-60"
                  disabled={!!appliedCoupon}
                >
                  Adicionar
                </button>
              </form>
              {error && <span className="text-xs text-red-500 block mt-1">{error}</span>}
              {appliedCoupon && (
                <div className="flex items-center justify-between mt-2 text-sm text-green-600">
                  <span>Cupom {appliedCoupon} aplicado!</span>
                  <button 
                    className="text-xs underline"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setDiscount(0);
                      setCoupon('');
                    }}
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            {/* Resumo de valores */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto</span>
                  <span>-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(total)}</span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};