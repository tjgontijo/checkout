declare module '@mercadopago/sdk-js' {
  export function loadMercadoPago(): Promise<void>;
  
  declare global {
    interface Window {
      MercadoPago: {
        new (publicKey: string): MercadoPagoInstance;
      };
    }
  }
  
  interface MercadoPagoInstance {
    getIdentificationTypes(): Promise<Array<{ id: string; name: string }>>;
    createCardToken(cardData: CardData): Promise<CardToken>;
  }
  
  interface CardData {
    cardNumber: string;
    cardholderName: string;
    expirationMonth: string;
    expirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }
  
  interface CardToken {
    id: string;
    public_key: string;
    card_id: string;
    luhn_validation: boolean;
    status: string;
    used_date?: string;
    card_number_length: number;
    date_created: string;
    first_six_digits: string;
    last_four_digits: string;
    security_code_length: number;
    expiration_month: number;
    expiration_year: number;
    date_last_updated: string;
    date_due: string;
    live_mode: boolean;
    cardholder: {
      identification: {
        number: string;
        type: string;
      };
      name: string;
    };
    payment_method: {
      id: string;
      name: string;
      payment_type_id: string;
      thumbnail: string;
      secure_thumbnail: string;
    };
    issuer: {
      id: string;
      name: string;
    };
  }
}
