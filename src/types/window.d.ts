interface CardData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

interface CardToken {
  id: string;
  status: string;
  card: {
    last_four_digits: string;
    cardholder: {
      name: string;
      identification: {
        type: string;
        number: string;
      };
    };
  };
}

interface Window {
  MercadoPago: {
    new (publicKey: string): {
      getIdentificationTypes(): Promise<Array<{ id: string; name: string }>>;
      createCardToken(cardData: CardData): Promise<CardToken>;
    };
  };
}
