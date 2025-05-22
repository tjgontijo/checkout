// Funções de máscara para moedas: BRL e USD

export function maskCurrency(value: string | number, currency: 'BRL' | 'USD'): string {
  // Se vier número, converte para string de centavos
  let onlyNums: string;
  if (typeof value === 'number') {
    onlyNums = Math.round(value * 100).toString();
  } else {
    onlyNums = value.replace(/\D/g, '');
  }
  if (!onlyNums) return '';

  // Limita a 10 dígitos para evitar valores absurdos
  onlyNums = onlyNums.slice(0, 10);

  // Aplica a máscara conforme a moeda
  if (currency === 'BRL') {
    // Exemplo: 123456 -> 1.234,56
    let int = onlyNums.slice(0, -2) || '0';
    const dec = onlyNums.slice(-2).padStart(2, '0');
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return int + ',' + dec;
  } else if (currency === 'USD') {
    // Exemplo: 123456 -> 1,234.56
    let int = onlyNums.slice(0, -2) || '0';
    const dec = onlyNums.slice(-2).padStart(2, '0');
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return int + '.' + dec;
  }
  return value;
}

// Função utilitária para desmascarar e converter para número
export function formatCentsToCurrency(value: number, currency: 'BRL' | 'USD'): string {
  // Recebe valor em centavos (ex: 2700) e retorna '27,00' (BRL) ou '27.00' (USD)
  const absValue = Math.abs(value);
  const int = Math.floor(absValue / 100);
  const dec = (absValue % 100).toString().padStart(2, '0');
  if (currency === 'BRL') {
    return `${int.toLocaleString('pt-BR')},${dec}`;
  } else if (currency === 'USD') {
    return `${int.toLocaleString('en-US')}.${dec}`;
  }
  return `${int}.${dec}`;
}

export function unmaskCurrency(masked: string, currency: 'BRL' | 'USD'): number {
  if (currency === 'BRL') {
    // Remove pontos e troca vírgula por ponto
    return parseFloat(masked.replace(/\./g, '').replace(',', '.')) || 0;
  } else {
    // Remove vírgulas
    return parseFloat(masked.replace(/,/g, '')) || 0;
  }
}
