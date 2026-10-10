/**
 * Ferramenta: Gerador e Validador de PIS / PASEP / NIT
 * 11 dígitos com cálculo oficial Módulo 11
 */

const PIS_TOOL = {
  weights: [3, 2, 9, 8, 7, 6, 5, 4, 3, 2],

  generate(formatted = true) {
    const digits = [];
    for (let i = 0; i < 10; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * this.weights[i];
    }

    const rest = 11 - (sum % 11);
    const d = (rest === 10 || rest === 11) ? 0 : rest;
    digits.push(d);

    const raw = digits.join('');
    if (!formatted) return raw;
    return raw.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
  },

  validate(pis) {
    const clean = String(pis).replace(/\D/g, '');
    if (clean.length !== 11) {
      return { valid: false, reason: 'PIS/PASEP deve conter 11 dígitos.' };
    }

    if (/^(\d)\1{10}$/.test(clean)) {
      return { valid: false, reason: 'Sequência repetida não é válida.' };
    }

    const digits = clean.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * this.weights[i];
    }

    const rest = 11 - (sum % 11);
    const d = (rest === 10 || rest === 11) ? 0 : rest;

    if (d !== digits[10]) {
      return { valid: false, reason: 'Dígito verificador do PIS inválido.' };
    }

    return { valid: true };
  }
};

window.PIS_TOOL = PIS_TOOL;
