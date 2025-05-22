import { cleanCEP } from '@/lib/masks/cep';

export function validateCEP(cep: string): boolean {
  // Validar se é String
  if (typeof cep !== 'string') return false;

  // Tirar formatação
  const cleanedCEP = cleanCEP(cep);

  // Validar se tem tamanho 8
  return cleanedCEP.length === 8 && /^\d{8}$/.test(cleanedCEP);
}
