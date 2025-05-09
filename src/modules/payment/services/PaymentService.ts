import { CreatePaymentParams, PaymentResult } from '../interfaces/IPaymentGatewayService';
import { PaymentGatewayFactory, PaymentGatewayType } from '../factories/PaymentGatewayFactory';

export class PaymentService {
  private gatewayType: PaymentGatewayType;

  constructor(gatewayType: PaymentGatewayType = 'mercadopago') {
    this.gatewayType = gatewayType;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    try {
      const gatewayService = PaymentGatewayFactory.getGateway(this.gatewayType);
      return await gatewayService.createPayment(params);
    } catch (error) {
      console.error(`Erro ao processar pagamento com gateway ${this.gatewayType}:`, error);
      throw error;
    }
  }

  // Métodos futuros: refund, consultar status, etc.
}
