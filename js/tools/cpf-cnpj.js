/**
 * Ferramenta: Gerador e Validador de CPF e CNPJ
 * Algoritmo matemático oficial com cálculo de dígitos verificadores
 */

const CPF_CNPJ_TOOL = {
  // Gerar CPF válido
  generateCPF(formatted = true) {
    const randomDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    // 1º Dígito verificador
    let sum1 = 0;
    for (let i = 0; i < 9; i++) {
      sum1 += randomDigits[i] * (10 - i);
    }
    let rest1 = sum1 % 11;
    let d1 = rest1 < 2 ? 0 : 11 - rest1;
    randomDigits.push(d1);

    // 2º Dígito verificador
    let sum2 = 0;
    for (let i = 0; i < 10; i++) {
      sum2 += randomDigits[i] * (11 - i);
    }
    let rest2 = sum2 % 11;
    let d2 = rest2 < 2 ? 0 : 11 - rest2;
    randomDigits.push(d2);

    const raw = randomDigits.join('');
    if (!formatted) return raw;
    return raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  // Validar CPF
  validateCPF(cpf) {
    const clean = String(cpf).replace(/\D/g, '');
    if (clean.length !== 11) return { valid: false, reason: 'Deve conter 11 dígitos numéricos.' };
    
    // Rejeitar sequências iguais conhecidas (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(clean)) {
      return { valid: false, reason: 'Sequência de dígitos repetidos não é um CPF válido.' };
    }

    let sum1 = 0;
    for (let i = 0; i < 9; i++) sum1 += parseInt(clean.charAt(i)) * (10 - i);
    let rest1 = sum1 % 11;
    let d1 = rest1 < 2 ? 0 : 11 - rest1;
    if (d1 !== parseInt(clean.charAt(9))) {
      return { valid: false, reason: 'Primeiro dígito verificador inválido.' };
    }

    let sum2 = 0;
    for (let i = 0; i < 10; i++) sum2 += parseInt(clean.charAt(i)) * (11 - i);
    let rest2 = sum2 % 11;
    let d2 = rest2 < 2 ? 0 : 11 - rest2;
    if (d2 !== parseInt(clean.charAt(10))) {
      return { valid: false, reason: 'Segundo dígito verificador inválido.' };
    }

    // Identificar Região Fiscal com base no 9º dígito
    const ufMap = {
      '1': 'DF, GO, MT, MS e TO',
      '2': 'AC, AM, AP, PA, RO e RR',
      '3': 'CE, MA e PI',
      '4': 'AL, PB, PE e RN',
      '5': 'BA e SE',
      '6': 'MG',
      '7': 'ES e RJ',
      '8': 'SP',
      '9': 'PR e SC',
      '0': 'RS'
    };
    const region = ufMap[clean.charAt(8)] || 'Não identificada';

    return { valid: true, region: `Região de Origem Fiscal: ${region}` };
  },

  // Gerar CNPJ válido
  generateCNPJ(formatted = true) {
    const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
    // Padrão matriz: 0001
    digits.push(0, 0, 0, 1);

    // 1º Dígito
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum1 = 0;
    for (let i = 0; i < 12; i++) sum1 += digits[i] * weights1[i];
    let rest1 = sum1 % 11;
    let d1 = rest1 < 2 ? 0 : 11 - rest1;
    digits.push(d1);

    // 2º Dígito
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    for (let i = 0; i < 13; i++) sum2 += digits[i] * weights2[i];
    let rest2 = sum2 % 11;
    let d2 = rest2 < 2 ? 0 : 11 - rest2;
    digits.push(d2);

    const raw = digits.join('');
    if (!formatted) return raw;
    return raw.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  },

  // Validar CNPJ
  validateCNPJ(cnpj) {
    const clean = String(cnpj).replace(/\D/g, '');
    if (clean.length !== 14) return { valid: false, reason: 'Deve conter 14 dígitos numéricos.' };

    if (/^(\d)\1{13}$/.test(clean)) {
      return { valid: false, reason: 'Sequência de dígitos repetidos não é um CNPJ válido.' };
    }

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum1 = 0;
    for (let i = 0; i < 12; i++) sum1 += parseInt(clean.charAt(i)) * weights1[i];
    let rest1 = sum1 % 11;
    let d1 = rest1 < 2 ? 0 : 11 - rest1;
    if (d1 !== parseInt(clean.charAt(12))) {
      return { valid: false, reason: 'Primeiro dígito verificador inválido.' };
    }

    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    for (let i = 0; i < 13; i++) sum2 += parseInt(clean.charAt(i)) * weights2[i];
    let rest2 = sum2 % 11;
    let d2 = rest2 < 2 ? 0 : 11 - rest2;
    if (d2 !== parseInt(clean.charAt(13))) {
      return { valid: false, reason: 'Segundo dígito verificador inválido.' };
    }

    return { valid: true };
  }
};

window.CPF_CNPJ_TOOL = CPF_CNPJ_TOOL;
