import { cleanPhone } from '@/lib/masks/phone';

export function validateBrazilianPhone(phone: string): boolean {
  // Validar se é String
  if (typeof phone !== 'string') return false;

  // Limpar telefone
  const cleanedPhone = cleanPhone(phone);

  // Limitar para no máximo 11 dígitos
  const limitedPhone = cleanedPhone.slice(0, 11);

  // Validar se tem tamanho correto (10 para fixo, 11 para celular)
  if (![10, 11].includes(limitedPhone.length)) return false;

  // Validar DDD (primeiro par de dígitos)
  const ddd = limitedPhone.slice(0, 2);
  const validDDD = [
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19', // SP
    '21',
    '22',
    '24',
    '25', // RJ
    '31',
    '32',
    '33',
    '34',
    '35',
    '37',
    '38', // MG
    '41',
    '42',
    '43',
    '44',
    '45',
    '46', // PR
    '47',
    '48',
    '49', // SC
    '51',
    '53',
    '54',
    '55', // RS
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69', // Centro-Oeste e TO
    '71',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79', // BA e SE
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89', // NE
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99', // Norte
  ];

  if (!validDDD.includes(ddd)) return false;

  // Verificar se não é uma sequência repetida
  const isRepeatedSequence = /^(\d)\1+$/.test(limitedPhone);
  if (isRepeatedSequence) return false;

  return true;
}
