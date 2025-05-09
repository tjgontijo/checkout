import { IPaymentGatewayService } from '../interfaces/IPaymentGatewayService';
// Importação via arquivo de índice
import { MercadoPagoService } from '../gateways/mercadopago';
// import { StripeService } from '../gateways/stripe/StripeService'; // Exemplo futuro

export type PaymentGatewayType = 'mercadopago'; // | 'stripe' etc

export class PaymentGatewayFactory {
  static getGateway(gateway: PaymentGatewayType): IPaymentGatewayService {
    switch (gateway) {
      case 'mercadopago':
        return new MercadoPagoService();
      // case 'stripe':
      //   return new StripeService();
      default:
        throw new Error('Gateway não suportado');
    }
  }
}
