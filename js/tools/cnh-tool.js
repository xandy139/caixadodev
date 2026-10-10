/**
 * Ferramenta: Gerador e Validador de CNH (Carteira Nacional de Habilitação)
 * Algoritmo oficial de 11 dígitos com cálculo ponderado dos dois dígitos verificadores
 */

const CNH_TOOL = {
  generate() {
    // 9 primeiros dígitos aleatórios
    const digits = [];
    for (let i = 0; i < 9; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    // 1º Dígito verificador
    let sum1 = 0;
    for (let i = 0; i < 9; i++) {
      sum1 += digits[i] * (9 - i);
    }
    let d1 = sum1 % 11;
    let inc = 0;
    if (d1 >= 10) {
      d1 = 0;
      inc = 2;
    }

    // 2º Dígito verificador
    let sum2 = 0;
    for (let i = 0; i < 9; i++) {
      sum2 += digits[i] * (1 + i);
    }
    let d2 = (sum2 % 11);
    if (d2 >= 10) {
      d2 = 0;
    } else {
      d2 = d2 - inc;
      if (d2 < 0) d2 += 11;
    }

    digits.push(d1);
    digits.push(d2);

    return digits.join('');
  },

  validate(cnh) {
    const clean = String(cnh).replace(/\D/g, '');
    if (clean.length !== 11) {
      return { valid: false, reason: 'CNH deve conter exatamente 11 dígitos.' };
    }

    if (/^(\d)\1{10}$/.test(clean)) {
      return { valid: false, reason: 'Sequência de números repetidos não é uma CNH válida.' };
    }

    const digits = clean.split('').map(Number);

    // Validar d1
    let sum1 = 0;
    for (let i = 0; i < 9; i++) {
      sum1 += digits[i] * (9 - i);
    }
    let d1 = sum1 % 11;
    let inc = 0;
    if (d1 >= 10) {
      d1 = 0;
      inc = 2;
    }
    if (d1 !== digits[9]) {
      return { valid: false, reason: 'Primeiro dígito verificador da CNH incorreto.' };
    }

    // Validar d2
    let sum2 = 0;
    for (let i = 0; i < 9; i++) {
      sum2 += digits[i] * (1 + i);
    }
    let d2 = sum2 % 11;
    if (d2 >= 10) {
      d2 = 0;
    } else {
      d2 = d2 - inc;
      if (d2 < 0) d2 += 11;
    }

    if (d2 !== digits[10]) {
      return { valid: false, reason: 'Segundo dígito verificador da CNH incorreto.' };
    }

    return { valid: true };
  }
};

window.CNH_TOOL = CNH_TOOL;
