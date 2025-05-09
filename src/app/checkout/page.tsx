'use client';

import React from 'react';
import { CheckoutHeader } from '@/components/payment/CheckoutHeader';
import { CustomerForm } from '@/components/payment/CustomerForm';
import { OrderSummary } from '@/components/payment/OrderSummary';
import { CheckoutFooter } from '@/components/payment/CheckoutFooter';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CreditCard, Lock } from 'lucide-react';
import type { PixPaymentResult } from '@/modules/payment/gateways/mercadopago/types';

// Tipagem forte baseada no schema do Prisma
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


export default function CheckoutPage(): React.ReactNode {
  // Simulação de dois produtos reais conforme o schema do Prisma
  const products: Product[] = [
    {
      id: 1,
      name: 'Curso de Desenvolvimento Web',
      description: 'Curso completo de desenvolvimento web com certificado.',
      price: 297.0,
      priceCurrency: 'BRL',
      salesPageUrl: 'https://images.yampi.me/assets/stores/prof-didatica/uploads/images/missao-literaria-6816b39652f7c-thumb.jpg',
      isActive: true,
      createdAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: 2,
      name: 'Mentoria Full Stack',
      description: 'Mentoria individual para desenvolvimento full stack.',
      price: 497.0,
      priceCurrency: 'BRL',
      salesPageUrl: 'https://images.yampi.me/assets/stores/prof-didatica/uploads/images/missao-literaria-6816b39652f7c-thumb.jpg',
      isActive: true,
      createdAt: new Date('2024-02-01T10:00:00Z'),
    },
  ];

  // Estado para armazenar os dados do cliente
  const [customerData, setCustomerData] = React.useState<{
    name: string;
    email: string;
    whatsapp: string;
  } | null>(null);
  const [showPayment, setShowPayment] = React.useState(false);

  // Calcular valor total
  const total = products.reduce((acc, p) => acc + p.price, 0);

  // Chave pública Mercado Pago (ajuste conforme necessário)
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '';
  
  function handleContinue(formData: { name: string; email: string; whatsapp: string }) {
    setCustomerData(formData);
    setShowPayment(true);
  }

  // Handlers de pagamento (pode ser expandido para lidar com resposta)
  async function handleCardPaymentCreate(paymentData: PixPaymentResult) {
    // Aqui você pode integrar com o backend ou exibir feedback
    console.log('Pagamento cartão:', paymentData);
  }
async function handlePixPaymentCreate(paymentData: PixPaymentResult) {
  // Aqui você pode integrar com o backend ou exibir feedback
  console.log('Pagamento PIX:', paymentData);
}

  return (
    <div>
      <div className="mb-4">
        <CheckoutHeader />
      </div>      
      <div className="container">
        <div className="max-w-md mx-auto pb-4 px-2" >
          <OrderSummary products={products} />
        </div>
        <div className="max-w-md mx-auto pb-4 px-2" >
          <CustomerForm
            onContinue={handleContinue}
          />
        </div>
        {/* Card de pagamento - sempre visível, mas bloqueado até validar dados */}
        <div className="max-w-md mx-auto pb-4 px-2">
          <Card className="shadow-md">
            <Collapsible open={showPayment && !!customerData}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 border-b cursor-pointer hover:bg-gray-50 transition-colors rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <CardTitle>
                        <div className="flex flex-col">
                          <span>Pagamento</span>
                          <span className="text-xs text-muted-foreground">
                            {showPayment && customerData 
                              ? 'Escolha sua forma de pagamento' 
                              : 'Preencha seus dados pessoais primeiro'}
                          </span>
                        </div>
                      </CardTitle>
                    </div>
                    {!showPayment && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-4">
                  {customerData && (
                    <PaymentMethodSelector
                      publicKey={publicKey}
                      amount={total}
                      customer={customerData}
                      onCardPaymentCreate={handleCardPaymentCreate}
                      onPixPaymentCreate={handlePixPaymentCreate}
                    />
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div> 
      <div className="mx-auto px-2" >
        <CheckoutFooter />
      </div>     
    </div>
  );
}