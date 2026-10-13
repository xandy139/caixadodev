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

  // Auxiliar: Valor numérico da tabela ASCII - 48 (Regra Oficial da Receita Federal para CNPJ Alfanumérico)
  getCharValue(c) {
    return c.charCodeAt(0) - 48;
  },

  // Formatação de CNPJ com máscara
  formatCNPJ(clean) {
    if (!clean || clean.length !== 14) return clean;
    return `${clean.substring(0, 2)}.${clean.substring(2, 5)}.${clean.substring(5, 8)}/${clean.substring(8, 12)}-${clean.substring(12, 14)}`;
  },

  // Cálculo dos 2 dígitos verificadores (compatível com numérico e alfanumérico)
  calculateCNPJDVs(base12) {
    const b = String(base12).toUpperCase();
    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum1 = 0;
    for (let i = 0; i < 12; i++) {
      sum1 += this.getCharValue(b[i]) * w1[i];
    }
    let rest1 = sum1 % 11;
    let d1 = rest1 < 2 ? 0 : 11 - rest1;

    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    for (let i = 0; i < 12; i++) {
      sum2 += this.getCharValue(b[i]) * w2[i];
    }
    sum2 += d1 * w2[12];
    let rest2 = sum2 % 11;
    let d2 = rest2 < 2 ? 0 : 11 - rest2;

    return { d1, d2 };
  },

  // Gerar CNPJ válido Tradicional (100% numérico)
  generateCNPJ(formatted = true) {
    const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
    // Padrão matriz: 0001
    digits.push(0, 0, 0, 1);
    const base = digits.join('');
    const { d1, d2 } = this.calculateCNPJDVs(base);
    const raw = `${base}${d1}${d2}`;
    return formatted ? this.formatCNPJ(raw) : raw;
  },

  // Gerar CNPJ Alfanumérico (IN RFB nº 2.229/2024)
  generateCNPJAlfanumerico({ formatted = true, filial = '0001', forceAlpha = true } = {}) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const all = digits + letters;

    // Gerar raiz com 8 caracteres
    let raiz = '';
    for (let i = 0; i < 8; i++) {
      raiz += all[Math.floor(Math.random() * all.length)];
    }
    // Se forceAlpha, garante pelo menos uma letra na raiz
    if (forceAlpha && !/[A-Z]/.test(raiz)) {
      const pos = Math.floor(Math.random() * 8);
      raiz = raiz.substring(0, pos) + letters[Math.floor(Math.random() * letters.length)] + raiz.substring(pos + 1);
    }

    // Gerar filial (4 caracteres)
    let filialCode = '0001';
    if (filial === 'sequencial') {
      const seqNum = Math.floor(Math.random() * 9998) + 2;
      filialCode = String(seqNum).padStart(4, '0');
    } else if (filial === 'alfanumerica') {
      filialCode = '';
      for (let i = 0; i < 4; i++) {
        filialCode += all[Math.floor(Math.random() * all.length)];
      }
      if (!/[A-Z]/.test(filialCode)) {
        const p = Math.floor(Math.random() * 4);
        filialCode = filialCode.substring(0, p) + letters[Math.floor(Math.random() * letters.length)] + filialCode.substring(p + 1);
      }
    }

    const base = `${raiz}${filialCode}`;
    const { d1, d2 } = this.calculateCNPJDVs(base);
    const raw = `${base}${d1}${d2}`;
    return formatted ? this.formatCNPJ(raw) : raw;
  },

  // Geração de CNPJs em Lote para Testers/QAs
  generateBatch(count = 10, { isAlphanumeric = true, formatted = true, filial = '0001' } = {}) {
    const list = [];
    for (let i = 0; i < count; i++) {
      if (isAlphanumeric) {
        list.push(this.generateCNPJAlfanumerico({ formatted, filial }));
      } else {
        list.push(this.generateCNPJ(formatted));
      }
    }
    return list;
  },

  // Validar CNPJ (Compatível com CNPJ Tradicional Numérico e CNPJ Alfanumérico da RFB)
  validateCNPJ(cnpj) {
    if (!cnpj) return { valid: false, reason: 'Informe o número do CNPJ.' };
    
    // Limpeza de pontuação e espaços
    const clean = String(cnpj).toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (clean.length !== 14) {
      return { valid: false, reason: 'Deve conter exatamente 14 caracteres alfanuméricos.' };
    }

    // Rejeitar 14 caracteres idênticos repetidos (ex: 00000000000000 ou AAAAAAAAAAAAAA)
    if (/^([A-Z0-9])\1{13}$/.test(clean)) {
      return { valid: false, reason: 'Sequência de caracteres repetidos não é um CNPJ válido.' };
    }

    // Regra oficial RFB: Os dois últimos caracteres (DVs) DEVEM ser puramente numéricos (0-9)
    const dvPart = clean.substring(12, 14);
    if (!/^[0-9]{2}$/.test(dvPart)) {
      return { valid: false, reason: 'Os 2 dígitos verificadores (posições 13 e 14) devem ser estritamente numéricos (0-9).' };
    }

    const base = clean.substring(0, 12);
    const { d1, d2 } = this.calculateCNPJDVs(base);

    const d1Informado = parseInt(clean.charAt(12), 10);
    const d2Informado = parseInt(clean.charAt(13), 10);

    if (d1 !== d1Informado) {
      return { 
        valid: false, 
        reason: `Primeiro dígito verificador inválido. Esperado: ${d1}, informado: ${d1Informado}.`,
        expectedD1: d1,
        expectedD2: d2
      };
    }

    if (d2 !== d2Informado) {
      return { 
        valid: false, 
        reason: `Segundo dígito verificador inválido. Esperado: ${d2}, informado: ${d2Informado}.`,
        expectedD1: d1,
        expectedD2: d2
      };
    }

    const isAlphanumeric = /[A-Z]/.test(clean);

    return { 
      valid: true,
      clean,
      formatted: this.formatCNPJ(clean),
      isAlphanumeric,
      tipo: isAlphanumeric ? 'CNPJ Alfanumérico (IN RFB 2.229/2024)' : 'CNPJ Tradicional Numérico',
      raiz: clean.substring(0, 8),
      filial: clean.substring(8, 12),
      dvs: `${d1}${d2}`,
      reason: isAlphanumeric 
        ? 'CNPJ Alfanumérico Válido (Dígitos verificadores aprovados pelo cálculo oficial RFB ASCII-48).'
        : 'CNPJ Válido (Dígitos verificadores aprovados pelo Módulo 11).'
    };
  },

  // Auditoria técnica detalhada passo a passo do cálculo do CNPJ para QAs e Devs
  auditCNPJ(cnpj) {
    const clean = String(cnpj).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length !== 14) return null;

    const base = clean.substring(0, 12);
    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const steps = [];
    let sum1 = 0;
    for (let i = 0; i < 12; i++) {
      const char = base[i];
      const ascii = char.charCodeAt(0);
      const val = ascii - 48;
      const weight1 = w1[i];
      const prod1 = val * weight1;
      sum1 += prod1;
      steps.push({ pos: i + 1, char, ascii, val, weight1, prod1 });
    }

    const rest1 = sum1 % 11;
    const d1 = rest1 < 2 ? 0 : 11 - rest1;

    let sum2 = 0;
    for (let i = 0; i < 12; i++) {
      const weight2 = w2[i];
      const prod2 = steps[i].val * weight2;
      sum2 += prod2;
      steps[i].weight2 = weight2;
      steps[i].prod2 = prod2;
    }
    const prodD1 = d1 * w2[12];
    sum2 += prodD1;

    const rest2 = sum2 % 11;
    const d2 = rest2 < 2 ? 0 : 11 - rest2;

    return {
      clean,
      base,
      steps,
      sum1,
      rest1,
      d1,
      sum2,
      prodD1,
      rest2,
      d2,
      d1Informado: parseInt(clean.charAt(12), 10),
      d2Informado: parseInt(clean.charAt(13), 10),
      valid: d1 === parseInt(clean.charAt(12), 10) && d2 === parseInt(clean.charAt(13), 10),
      isAlphanumeric: /[A-Z]/.test(clean)
    };
  }
};

if (typeof window !== 'undefined') window.CPF_CNPJ_TOOL = CPF_CNPJ_TOOL;
if (typeof module !== 'undefined' && module.exports) module.exports = CPF_CNPJ_TOOL;
