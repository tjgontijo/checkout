'use server';

import { MercadoPagoService } from '../MercadoPagoService';
import type { CreatePreferenceParams } from '../types';

/**
 * Server Action: cria preferência de checkout PIX no Mercado Pago
 * 
 * @param amount Valor da transação
 * @param customer Dados do cliente
 * @returns ID da preferência criada no Mercado Pago
 */
export async function createPixPreference(
  amount: number,
  customer: { name: string; email: string; whatsapp: string }
): Promise<string> {
  try {
    const service = new MercadoPagoService();
    
    const preferenceData: CreatePreferenceParams = {
      items: [
        { 
          title: 'Compra', 
          quantity: 1, 
          unit_price: amount 
        }
      ],
      payer: { 
        email: customer.email 
      },
      payment_methods: { 
        default_payment_method_id: 'pix', 
        installments: 1 
      },
      external_reference: `cliente-${Date.now()}`
    };
    
    const preferenceId = await service.createPreference(preferenceData);
    return preferenceId;
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
}
