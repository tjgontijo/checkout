'use client';

import React, { useEffect } from 'react';
import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react';

interface CardFormProps {
  publicKey: string;
  amount: number;
  customer: {
    email: string;
  };
  onPaymentCreate: (paymentData: any) => Promise<void>;
}

export function CardForm({ publicKey, amount, customer, onPaymentCreate }: CardFormProps) {
  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey);
    }
  }, [publicKey]);

  return (
    <div>
      <CardPayment
        initialization={{
          amount,
          payer: { email: customer.email },
        }}
        onSubmit={async (paymentData: any) => {
          await onPaymentCreate(paymentData);
        }}
      />
    </div>
  );
}

     