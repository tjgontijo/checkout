export interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
}

export interface MercadoPagoPaymentResponse {
  id: string;
  status: string;
  status_detail: string;
  payment_method_id: string;
  payment_type_id: string;
  transaction_amount: number;
  date_created: string;
  date_approved?: string;
  date_last_updated: string;
  currency_id: string;
  description: string;
  payer: {
    id?: string;
    email: string;
    identification: {
      type: string;
      number: string;
    };
    first_name?: string;
    last_name?: string;
  };
  additional_info?: {
    items?: Array<{
      id: string;
      title: string;
      description?: string;
      picture_url?: string;
      category_id?: string;
      quantity: number;
      unit_price: number;
    }>;
    payer?: {
      first_name?: string;
      last_name?: string;
      phone?: {
        area_code?: string;
        number?: string;
      };
      address?: {
        zip_code?: string;
        street_name?: string;
        street_number?: number;
      };
    };
    shipments?: {
      receiver_address?: {
        zip_code?: string;
        street_name?: string;
        street_number?: number;
        floor?: string;
        apartment?: string;
      };
    };
  };
  external_reference?: string;
  transaction_details: {
    net_received_amount: number;
    total_paid_amount: number;
    installment_amount?: number;
  };
  fee_details?: Array<{
    type: string;
    amount: number;
  }>;
  installments: number;
  statement_descriptor?: string;
  notification_url?: string;
}

/**
 * Tipagem da resposta de pagamento Pix do Mercado Pago
 * https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix#editor_8
 */
export interface PixPaymentResult {
  id: number;
  status: string;
  status_detail: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string; // Código copia e cola
      qr_code_base64?: string; // Imagem base64 do QR Code
      ticket_url?: string; // Link para boleto/qr code
    };
  };
  [key: string]: unknown;
}

/**
 * Parâmetros para criar preferência de checkout (PIX) no Mercado Pago
 */
export interface CreatePreferenceParams {
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  payment_methods?: {
    default_payment_method_id?: string;
    installments?: number;
  };
  external_reference?: string;
  statement_descriptor?: string;
}
