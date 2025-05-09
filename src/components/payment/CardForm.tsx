'use client';

import React, { useEffect, useState } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { useForm } from 'react-hook-form';

interface PaymentData {
  token: string;
  issuerId?: string;
  paymentMethodId: string;
  installments: number;
  identificationNumber: string;
  identificationType: string;
  email: string;
}

interface CardFormProps {
  publicKey: string;
  onPaymentCreate: (paymentData: PaymentData) => Promise<void>;
}

interface CardFormData {
  cardholderName: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
  email: string;
  amount: number;
}

export function CardForm({ publicKey, onPaymentCreate }: CardFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [identificationTypes, setIdentificationTypes] = useState<Array<{ id: string; name: string }>>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CardFormData>();

  useEffect(() => {
    const initMercadoPago = async (): Promise<void> => {
      try {
        if (!publicKey) {
          throw new Error('Chave pública do Mercado Pago não configurada');
        }

        console.log('Inicializando Mercado Pago com a chave:', publicKey);
        
        // Carregar a SDK do Mercado Pago
        await loadMercadoPago();
        
        // Verificar se o objeto MercadoPago foi carregado corretamente
        if (!window.MercadoPago) {
          throw new Error('SDK do Mercado Pago não foi carregada corretamente');
        }
        
        // Inicializar o objeto MercadoPago
        const mp = new window.MercadoPago(publicKey);
        
        // Carregar tipos de documento
        const types = await mp.getIdentificationTypes();
        console.log('Tipos de documento carregados:', types);
        setIdentificationTypes(types || []);
      } catch (error) {
        console.error('Erro ao inicializar Mercado Pago:', error);
        setError('Não foi possível carregar o formulário de pagamento.');
      }
    };

    initMercadoPago();
  }, [publicKey]);

  const onSubmit = async (data: CardFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Inicializar o Mercado Pago
      const mp = new window.MercadoPago(publicKey);
      
      // Extrair mês e ano da data de expiração (MM/YY)
      const [expirationMonth, expirationYear] = data.expirationDate.split('/');
      
      // Criar token de cartão
      const cardToken = await mp.createCardToken({
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        cardholderName: data.cardholderName,
        expirationMonth,
        expirationYear: `20${expirationYear}`, // Converter YY para YYYY
        securityCode: data.securityCode,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber
      });
      
      // Enviar dados para processamento
      await onPaymentCreate({
        token: cardToken.id,
        paymentMethodId: cardToken.payment_method.id,
        issuerId: cardToken.issuer.id,
        installments: 1,
        payer: {
          email: data.email,
          identification: {
            type: data.identificationType,
            number: data.identificationNumber
          }
        },
        amount: data.amount
      });
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError('Ocorreu um erro ao processar o pagamento. Verifique os dados do cartão.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium">
          Nome no cartão
        </label>
        <input
          id="cardholderName"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Nome como está no cartão"
          {...register('cardholderName', { required: 'Nome é obrigatório' })}
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardholderName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium">
          Número do cartão
        </label>
        <input
          id="cardNumber"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="0000 0000 0000 0000"
          {...register('cardNumber', { 
            required: 'Número do cartão é obrigatório',
            pattern: {
              value: /^[\d\s]{16,19}$/,
              message: 'Número de cartão inválido'
            }
          })}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium">
            Data de expiração
          </label>
          <input
            id="expirationDate"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="MM/YY"
            {...register('expirationDate', { 
              required: 'Data de expiração é obrigatória',
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: 'Formato inválido. Use MM/YY'
              }
            })}
          />
          {errors.expirationDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expirationDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="securityCode" className="block text-sm font-medium">
            Código de segurança
          </label>
          <input
            id="securityCode"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="CVV"
            {...register('securityCode', { 
              required: 'CVV é obrigatório',
              pattern: {
                value: /^\d{3,4}$/,
                message: 'CVV inválido'
              }
            })}
          />
          {errors.securityCode && (
            <p className="text-red-500 text-xs mt-1">{errors.securityCode.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="identificationType" className="block text-sm font-medium">
          Tipo de documento
        </label>
        <select
          id="identificationType"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          {...register('identificationType', { required: 'Tipo de documento é obrigatório' })}
        >
          <option value="">Selecione</option>
          {identificationTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.identificationType && (
          <p className="text-red-500 text-xs mt-1">{errors.identificationType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="identificationNumber" className="block text-sm font-medium">
          Número do documento
        </label>
        <input
          id="identificationNumber"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          {...register('identificationNumber', { required: 'Número do documento é obrigatório' })}
        />
        {errors.identificationNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.identificationNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          {...register('email', { 
            required: 'E-mail é obrigatório',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'E-mail inválido'
            }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Valor (R$)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          {...register('amount', { 
            required: 'Valor é obrigatório',
            min: {
              value: 1,
              message: 'Valor mínimo é R$ 1,00'
            }
          })}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Processando...' : 'Pagar'}
        </button>
      </div>
    </form>
  );
}
