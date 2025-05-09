/**
 * Utilitários para integração com o Mercado Pago
 */

/**
 * Converte o status do Mercado Pago para o formato interno da aplicação
 * @param mpStatus Status retornado pelo Mercado Pago
 * @returns Status padronizado para a aplicação
 */
export function normalizePaymentStatus(mpStatus: string): string {
  const statusMap: Record<string, string> = {
    'approved': 'APPROVED',
    'authorized': 'APPROVED',
    'in_process': 'PENDING',
    'in_mediation': 'PENDING',
    'rejected': 'CANCELLED',
    'cancelled': 'CANCELLED',
    'refunded': 'REFUNDED',
    'charged_back': 'REFUNDED'
  };

  return statusMap[mpStatus] || 'PENDING';
}

/**
 * Formata o nome completo para o formato esperado pelo Mercado Pago
 * @param fullName Nome completo
 * @returns Objeto com firstName e lastName
 */
export function formatName(fullName: string): { firstName: string; lastName: string } {
  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      lastName: ''
    };
  }

  return {
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' ')
  };
}
