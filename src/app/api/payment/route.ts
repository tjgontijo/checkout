import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/modules/payment';
import { CreatePaymentParams } from '@/modules/payment/interfaces/IPaymentGatewayService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica dos dados de entrada
    if (!body.amount || !body.paymentMethod || !body.payer) {
      return NextResponse.json(
        { error: 'Dados incompletos para processamento do pagamento' },
        { status: 400 }
      );
    }

    // Preparar os parâmetros para o serviço de pagamento
    const paymentParams: CreatePaymentParams = {
      amount: body.amount,
      currency: body.currency || 'BRL',
      paymentMethod: body.paymentMethod,
      description: body.description,
      payer: {
        name: body.payer.name,
        email: body.payer.email,
        identification: body.payer.identification
      }
    };

    // Processar o pagamento usando o serviço
    const paymentService = new PaymentService('mercadopago');
    const result = await paymentService.createPayment(paymentParams);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    
    return NextResponse.json(
      { error: 'Erro ao processar pagamento', details: (error as Error).message },
      { status: 500 }
    );
  }
}
