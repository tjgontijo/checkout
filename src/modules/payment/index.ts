// Exportações principais do módulo de pagamento
import { PaymentService } from './services/PaymentService';
import { PaymentGatewayFactory } from './factories/PaymentGatewayFactory';
import type { PaymentGatewayType } from './factories/PaymentGatewayFactory';
import type { CreatePaymentParams, PaymentResult, IPaymentGatewayService } from './interfaces/IPaymentGatewayService';

export {
  PaymentService,
  PaymentGatewayFactory,
  IPaymentGatewayService
};

export type {
  PaymentGatewayType,
  CreatePaymentParams,
  PaymentResult
};
