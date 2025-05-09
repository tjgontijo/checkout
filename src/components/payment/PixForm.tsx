'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';
import { Button } from '@/components/ui/button';
import { QrCodeIcon, ArrowRight } from 'lucide-react';
import { createPixPreference } from '@/modules/payment/gateways/mercadopago/actions/createPreference';
import type { PixPaymentResult } from '@/modules/payment/gateways/mercadopago/types';

interface PixFormProps {
  amount: number;
  customer: {
    name: string;
    email: string;
    whatsapp: string;
  };
  onPaymentCreate?: (paymentData: PixPaymentData) => Promise<void>;
  publicKey: string;
}

export interface PixPaymentData {
  paymentMethod: string;
}

export function PixForm({ amount, customer, onPaymentCreate, publicKey }: PixFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Inicializar o SDK do Mercado Pago
  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey);
    }
  }, [publicKey]);

  const handleGeneratePix = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setPreferenceId(null);
    try {
      // Usar a server action para criar a preferência
      const newPreferenceId = await createPixPreference(amount, customer);
      setPreferenceId(newPreferenceId);
      
      // Simular os dados de retorno para o onPaymentCreate
      if (onPaymentCreate) {
        const paymentData: PixPaymentData = {
          paymentMethod: 'pix',
        };
        await onPaymentCreate(paymentData);
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao gerar o QR Code PIX');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!preferenceId && (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
          <QrCodeIcon className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Pagamento instantâneo via PIX</h3>
          <p className="text-center text-sm text-muted-foreground mb-4">
            Pague com PIX e tenha seu produto liberado instantaneamente após a confirmação do pagamento.
          </p>
          <Button 
            onClick={handleGeneratePix} 
            className="w-full md:w-auto" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Gerando QR Code...</>
            ) : (
              <>Gerar QR Code PIX <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      
      {preferenceId && (
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-center">Seu QR Code PIX</h4>
          <Wallet initialization={{ preferenceId }} />
        </div>
      )}
      <div className="rounded-lg border p-4">
        <h4 className="font-medium mb-2">Como funciona o pagamento via PIX</h4>
        <ol className="list-decimal list-inside text-sm space-y-2 text-muted-foreground">
          <li>Clique no botão acima para gerar o QR Code</li>
          <li>Abra o aplicativo do seu banco</li>
          <li>Escaneie o QR Code ou copie o código</li>
          <li>Confirme o pagamento no aplicativo do seu banco</li>
          <li>Após a confirmação, seu produto será liberado automaticamente</li>
        </ol>
      </div>
    </div>
  );
}
