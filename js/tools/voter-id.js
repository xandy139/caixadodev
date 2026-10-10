/**
 * Ferramenta: Gerador e Validador de Título de Eleitor
 * 12 dígitos com verificação de Unidade Federativa (UF) e dígitos verificadores do TSE
 */

const VOTER_ID_TOOL = {
  ufCodes: {
    'SP': '01', 'MG': '02', 'RJ': '03', 'RS': '04', 'BA': '05',
    'PR': '06', 'CE': '07', 'PE': '08', 'SC': '09', 'GO': '10',
    'MA': '11', 'PB': '12', 'PA': '13', 'ES': '14', 'PI': '15',
    'RN': '16', 'AL': '17', 'MT': '18', 'MS': '19', 'DF': '20',
    'SE': '21', 'AM': '22', 'RO': '23', 'AC': '24', 'AP': '25',
    'RR': '26', 'TO': '27', 'ZZ': '28'
  },

  generate(uf = 'SP', formatted = true) {
    const stateCode = this.ufCodes[uf] || '01';

    // 8 dígitos sequenciais
    const digits = [];
    for (let i = 0; i < 8; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    // Adicionar código do estado
    digits.push(parseInt(stateCode.charAt(0)));
    digits.push(parseInt(stateCode.charAt(1)));

    // 1º Dígito verificador (pesos 2 a 9 para os 8 primeiros números)
    let sum1 = 0;
    for (let i = 0; i < 8; i++) {
      sum1 += digits[i] * (i + 2);
    }
    let rest1 = sum1 % 11;
    let d1 = rest1 === 10 ? 0 : (rest1 === 0 && (stateCode === '01' || stateCode === '02') ? 1 : rest1);
    if (d1 === 10) d1 = 0;
    digits.push(d1);

    // 2º Dígito verificador (pesos 7, 8, 9 para estado e 1º DV)
    const sum2 = (digits[8] * 7) + (digits[9] * 8) + (digits[10] * 9);
    let rest2 = sum2 % 11;
    let d2 = rest2 === 10 ? 0 : (rest2 === 0 && (stateCode === '01' || stateCode === '02') ? 1 : rest2);
    if (d2 === 10) d2 = 0;
    digits.push(d2);

    const raw = digits.join('');
    if (!formatted) return raw;
    return raw.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  },

  validate(voterId) {
    const clean = String(voterId).replace(/\D/g, '');
    if (clean.length !== 12) {
      return { valid: false, reason: 'Título de Eleitor deve conter 12 dígitos.' };
    }

    const stateDigits = clean.substring(8, 10);
    const stateCodeNum = parseInt(stateDigits, 10);
    if (stateCodeNum < 1 || stateCodeNum > 28) {
      return { valid: false, reason: 'Código de UF eleitoral inválido.' };
    }

    const digits = clean.split('').map(Number);

    // D1
    let sum1 = 0;
    for (let i = 0; i < 8; i++) sum1 += digits[i] * (i + 2);
    let rest1 = sum1 % 11;
    let d1 = rest1 === 10 ? 0 : (rest1 === 0 && (stateDigits === '01' || stateDigits === '02') ? 1 : rest1);
    if (d1 === 10) d1 = 0;
    if (d1 !== digits[10]) return { valid: false, reason: 'Primeiro dígito verificador inválido.' };

    // D2
    const sum2 = (digits[8] * 7) + (digits[9] * 8) + (digits[10] * 9);
    let rest2 = sum2 % 11;
    let d2 = rest2 === 10 ? 0 : (rest2 === 0 && (stateDigits === '01' || stateDigits === '02') ? 1 : rest2);
    if (d2 === 10) d2 = 0;
    if (d2 !== digits[11]) return { valid: false, reason: 'Segundo dígito verificador inválido.' };

    return { valid: true };
  }
};

window.VOTER_ID_TOOL = VOTER_ID_TOOL;
