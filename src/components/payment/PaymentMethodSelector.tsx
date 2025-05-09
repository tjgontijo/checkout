'use client';

import React, { useState } from 'react';
import { CardForm } from './CardForm';
import { PixForm, PixPaymentData } from './PixForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PaymentMethodSelectorProps {
  publicKey: string;
  amount: number;
  customer: {
    name: string;
    email: string;
    whatsapp: string;
  };
  onCardPaymentCreate: (paymentData: any) => Promise<void>;
  onPixPaymentCreate: (paymentData: PixPaymentData) => Promise<void>;
}

export function PaymentMethodSelector({
  publicKey,
  amount,
  customer,
  onCardPaymentCreate,
  onPixPaymentCreate
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');

  return (
    <Tabs defaultValue="card" className="w-full" onValueChange={setSelectedMethod}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="card" className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          Cartão de Crédito
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4">
            <path fill="currentColor" d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C351.5 381.5 351.5 401.1 339.5 413.1C327.5 425.1 307.9 425.1 295.9 413.1L242.4 359.6L188.9 413.1C176.9 425.1 157.3 425.1 145.3 413.1C133.3 401.1 133.3 381.5 145.3 369.5L222.4 292.5C227.8 287.1 237.1 287.1 242.4 292.5V292.5zM128 160C128 142.3 142.3 128 160 128H352C369.7 128 384 142.3 384 160C384 177.7 369.7 192 352 192H160C142.3 192 128 177.7 128 160zM128 256C128 238.3 142.3 224 160 224H352C369.7 224 384 238.3 384 256C384 273.7 369.7 288 352 288H160C142.3 288 128 273.7 128 256z"/>
          </svg>
          PIX
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="card">
        <CardForm 
          publicKey={publicKey} 
          amount={amount}
          customer={customer}
          onPaymentCreate={onCardPaymentCreate} 
        />
      </TabsContent>
      
      <TabsContent value="pix">
        <PixForm 
          amount={amount}
          customer={customer}
          onPaymentCreate={onPixPaymentCreate} 
        />
      </TabsContent>
    </Tabs>
  );
}
