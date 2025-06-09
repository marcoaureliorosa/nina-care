// Funções de validação centralizadas

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  // Deve ter pelo menos 2 palavras e cada palavra deve ter pelo menos 2 caracteres
  const words = trimmedName.split(' ').filter(word => word.length >= 2);
  return words.length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // Telefone é opcional
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  // Deve ter 10 ou 11 dígitos (com DDD)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

export const validateUrl = (url: string): boolean => {
  if (!url.trim()) return true; // URL é opcional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCNPJ = (cnpj: string): boolean => {
  if (!cnpj.trim()) return false;
  
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Deve ter exatamente 14 dígitos
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se não são todos dígitos iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Algoritmo de validação do CNPJ
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += parseInt(cleanCNPJ[i]) * weights1[i];
  }
  
  const remainder1 = sum1 % 11;
  const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;
  
  if (parseInt(cleanCNPJ[12]) !== digit1) return false;
  
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += parseInt(cleanCNPJ[i]) * weights2[i];
  }
  
  const remainder2 = sum2 % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;
  
  return parseInt(cleanCNPJ[13]) === digit2;
};

export const validateCPF = (cpf: string): boolean => {
  if (!cpf.trim()) return false;
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Deve ter exatamente 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se não são todos dígitos iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Algoritmo de validação do CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  
  return remainder === parseInt(cleanCPF[10]);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
}; 