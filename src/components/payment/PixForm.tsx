'use client';

import type { PixPaymentResult } from '@/modules/payment/gateways/mercadopago/types';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, QrCodeIcon } from 'lucide-react';

interface PixFormProps {
  amount: number;
  customer: {
    name: string;
    email: string;
    whatsapp: string;
  };
  onPaymentCreate?: (paymentData: PixPaymentData) => Promise<void>;
}

export interface PixPaymentData {
  paymentMethod: string;
}

export function PixForm({ amount, customer, onPaymentCreate }: PixFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PixPaymentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGeneratePix = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      // Chamada para a API de pagamento
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'BRL',
          paymentMethod: 'pix',
          payer: {
            name: customer.name,
            email: customer.email,
          },
        }),
      });
      const body = await response.json();
      const paymentResult: PixPaymentResult = (body.raw ?? body) as PixPaymentResult;
      setResult(paymentResult);
      if (onPaymentCreate) await onPaymentCreate(paymentResult);
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao gerar o QR Code PIX');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.point_of_interaction?.transaction_data?.qr_code) {
      navigator.clipboard.writeText(result.point_of_interaction.transaction_data.qr_code)
        .then(() => setCopied(true))
        .catch(() => setError('Não foi possível copiar o código'));
    }
  };

  return (
    <div className="space-y-6">
      {!result && (
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
              <>Gerar QR Code PIX <ArrowRightIcon className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-white rounded-lg border mb-4">
          <h4 className="font-medium mb-2">Seu QR Code PIX</h4>
          {result.point_of_interaction?.transaction_data?.qr_code_base64 && (
            <img src={`data:image/png;base64,${result.point_of_interaction.transaction_data.qr_code_base64}`} alt="PIX QR Code" className="mx-auto mb-4" />
          )}
          {result.point_of_interaction?.transaction_data?.qr_code && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Código PIX (copia e cola):</label>
                <div className="p-2 bg-gray-100 rounded text-sm break-all">
                  {result.point_of_interaction.transaction_data.qr_code}
                </div>
              </div>
              <Button onClick={handleCopy} size="sm" disabled={copied} className="mb-4">
                {copied ? 'Copiado!' : 'Copiar código PIX'}
              </Button>
            </>
          )}
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
