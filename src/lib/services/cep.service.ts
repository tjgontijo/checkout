import { cleanCEP } from '@/lib/masks/cep'
import { validateCEP } from '@/lib/validations/cep'

export interface CEPInfo {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export async function fetchCEPInfo(cep: string): Promise<CEPInfo | null> {
  const cleanedCEP = cleanCEP(cep)

  if (!validateCEP(cleanedCEP)) {
    return null
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`)
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    // Verificar se a resposta não é um erro da API
    if (data.erro) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Erro ao buscar informações do CEP:', error)
    return null
  }
}
