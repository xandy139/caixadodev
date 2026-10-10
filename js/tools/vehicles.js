/**
 * Ferramenta: Gerador de Placa de Veículo e RENAVAM
 * Suporte a padrão Mercosul (BRA2E19) e tradicional (ABC-1234), além de RENAVAM válido (Módulo 11)
 */

const VEHICLES_TOOL = {
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

  getRandomLetter() {
    return this.letters.charAt(Math.floor(Math.random() * this.letters.length));
  },

  getRandomDigit() {
    return Math.floor(Math.random() * 10);
  },

  generatePlate(mercosul = true) {
    const l1 = this.getRandomLetter();
    const l2 = this.getRandomLetter();
    const l3 = this.getRandomLetter();

    if (mercosul) {
      // Padrão Mercosul: LLLNLNN (Ex: BRA2E19)
      const d1 = this.getRandomDigit();
      const l4 = this.getRandomLetter();
      const d2 = this.getRandomDigit();
      const d3 = this.getRandomDigit();
      return `${l1}${l2}${l3}${d1}${l4}${d2}${d3}`;
    } else {
      // Padrão Tradicional: LLL-NNNN (Ex: ABC-1234)
      const d1 = this.getRandomDigit();
      const d2 = this.getRandomDigit();
      const d3 = this.getRandomDigit();
      const d4 = this.getRandomDigit();
      return `${l1}${l2}${l3}-${d1}${d2}${d3}${d4}`;
    }
  },

  // Gerar RENAVAM válido (11 dígitos, cálculo com Módulo 11)
  generateRenavam() {
    // 10 primeiros dígitos aleatórios
    const digits = [];
    for (let i = 0; i < 10; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }

    const rest = (sum * 10) % 11;
    const checkDigit = (rest === 10 || rest === 11) ? 0 : rest;
    digits.push(checkDigit);

    return digits.join('');
  },

  validateRenavam(renavam) {
    const clean = String(renavam).replace(/\D/g, '');
    if (clean.length !== 11) return false;

    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(clean.charAt(i), 10) * weights[i];
    }

    const rest = (sum * 10) % 11;
    const checkDigit = (rest === 10 || rest === 11) ? 0 : rest;

    return checkDigit === parseInt(clean.charAt(10), 10);
  }
};

window.VEHICLES_TOOL = VEHICLES_TOOL;
