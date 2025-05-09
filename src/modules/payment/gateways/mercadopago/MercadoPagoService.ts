import { IPaymentGatewayService, CreatePaymentParams, PaymentResult } from '../../interfaces/IPaymentGatewayService';
import { MercadoPagoConfig, MercadoPagoPaymentResponse } from './types';
import { normalizePaymentStatus, formatName } from './utils';
import { randomUUID } from 'crypto';

export class MercadoPagoService implements IPaymentGatewayService {
  private accessToken: string;
  private publicKey: string;
  private apiBaseUrl = 'https://api.mercadopago.com/v1';

  constructor(config?: MercadoPagoConfig) {
    // Usar variáveis de ambiente como fallback se não for fornecido na instanciação
    this.accessToken = config?.accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    this.publicKey = config?.publicKey || process.env.MERCADOPAGO_PUBLIC_KEY || '';

    if (!this.accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado');
    }
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    try {
      const { firstName, lastName } = formatName(params.payer.name);
      const idempotencyKey = randomUUID();
      
      // Preparar os dados para o Mercado Pago
      const paymentData = {
        transaction_amount: params.amount,
        description: params.description || 'Compra',
        payment_method_id: params.paymentMethod,
        installments: 1, // Padrão: pagamento à vista
        payer: {
          email: params.payer.email,
          identification: params.payer.identification,
          first_name: firstName,
          last_name: lastName
        }
      };

      // Criar o pagamento usando fetch diretamente
      const response = await fetch(`${this.apiBaseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar pagamento: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json() as MercadoPagoPaymentResponse;
      
      // Normalizar o status para o formato interno da aplicação
      const normalizedStatus = normalizePaymentStatus(data.status);

      return {
        id: data.id.toString(),
        status: normalizedStatus,
        raw: data
      };
    } catch (error) {
      console.error('Erro ao processar pagamento com Mercado Pago:', error);
      throw error;
    }
  }
}
