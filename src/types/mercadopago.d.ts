declare module 'mercadopago' {
  interface MercadoPagoConfig {
    access_token: string;
  }

  interface MercadoPagoPaymentResponse {
    body: {
      id: number | string;
      status: string;
      status_detail: string;
      [key: string]: any;
    };
    status: number;
    response?: any;
  }

  interface MercadoPagoPaymentRequest {
    transaction_amount: number;
    description?: string;
    payment_method_id: string;
    installments?: number;
    payer: {
      email: string;
      identification?: {
        type: string;
        number: string;
      };
      first_name?: string;
      last_name?: string;
    };
    [key: string]: any;
  }

  interface MercadoPagoPayment {
    create(data: MercadoPagoPaymentRequest): Promise<MercadoPagoPaymentResponse>;
    get(id: string | number): Promise<MercadoPagoPaymentResponse>;
  }

  const mercadopago: {
    configure(config: MercadoPagoConfig): void;
    payment: MercadoPagoPayment;
  };

  export default mercadopago;
}
