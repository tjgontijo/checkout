export function cleanCEP(cep: string): string {
  return cep.replace(/[^\d]+/g, '');
}

export function formatCEP(cep: string): string {
  const cleaned = cleanCEP(cep);
  if (cleaned.length !== 8) return cleaned;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

export function unMaskCEP(cep: string): string {
  return cleanCEP(cep);
}
