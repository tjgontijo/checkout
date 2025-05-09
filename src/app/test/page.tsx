'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  const router = useRouter();

  const handleStartCheckout = () => {
    // Dados de exemplo para o teste
    const testData = {
      productId: 1,
      productName: 'Produto de Teste',
      price: 10.99,
      currency: 'BRL',
    };

    // Armazenar os dados no localStorage para uso na página de checkout
    localStorage.setItem('checkoutTestData', JSON.stringify(testData));
    
    // Redirecionar para a página de checkout
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Página de Teste - Integração Mercado Pago</h1>
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Produto de Teste</CardTitle>
          <CardDescription>
            Clique no botão abaixo para testar o fluxo de pagamento com o Mercado Pago
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Produto:</span>
              <span>Produto de Teste</span>
            </div>
            <div className="flex justify-between">
              <span>Preço:</span>
              <span>R$ 10,99</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleStartCheckout} 
            className="w-full"
          >
            Ir para Pagamento
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
