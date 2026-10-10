/**
 * Ferramenta: Gerador e Validador de Cartão de Crédito para Testes
 * Utiliza o Algoritmo de Luhn (Módulo 10) oficial para bandeiras de cartão
 */

const CREDIT_CARD_TOOL = {
  brands: {
    visa: { name: 'Visa', prefix: ['4'], length: 16, cvvLength: 3 },
    mastercard: { name: 'Mastercard', prefix: ['51', '52', '53', '54', '55'], length: 16, cvvLength: 3 },
    amex: { name: 'American Express', prefix: ['34', '37'], length: 15, cvvLength: 4 },
    elo: { name: 'Elo', prefix: ['636368', '438935', '504175', '451416', '636297'], length: 16, cvvLength: 3 },
    hipercard: { name: 'Hipercard', prefix: ['606282'], length: 16, cvvLength: 3 }
  },

  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Gerar número válido pelo algoritmo de Luhn
  generateCard(brandKey = 'visa', formatted = true) {
    const brand = this.brands[brandKey] || this.brands.visa;
    const prefix = this.getRandomItem(brand.prefix);
    const targetLength = brand.length;

    const digits = prefix.split('').map(Number);
    // Preencher dígitos aleatórios até o penúltimo
    while (digits.length < targetLength - 1) {
      digits.push(Math.floor(Math.random() * 10));
    }

    // Calcular dígito verificador Luhn
    let sum = 0;
    const reversed = [...digits].reverse();
    for (let i = 0; i < reversed.length; i++) {
      let digit = reversed[i];
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }

    const checkDigit = (sum * 9) % 10;
    digits.push(checkDigit);

    const rawNumber = digits.join('');
    
    // Gerar validade futura (1 a 5 anos à frente)
    const now = new Date();
    const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const expYear = String((now.getFullYear() % 100) + Math.floor(Math.random() * 5) + 1).padStart(2, '0');

    // Gerar CVV
    let cvv = '';
    for (let i = 0; i < brand.cvvLength; i++) {
      cvv += Math.floor(Math.random() * 10);
    }

    const formattedNumber = rawNumber.replace(/(\d{4})/g, '$1 ').trim();

    return {
      brand: brand.name,
      number: formatted ? formattedNumber : rawNumber,
      expiration: `${expMonth}/${expYear}`,
      cvv
    };
  },

  // Validar número de cartão via Algoritmo de Luhn
  validate(cardNumber) {
    const clean = String(cardNumber).replace(/\D/g, '');
    if (clean.length < 13 || clean.length > 19) {
      return { valid: false, reason: 'Quantidade de dígitos incompatível (deve ter entre 13 e 19 dígitos).' };
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    const isValid = (sum % 10) === 0;
    if (!isValid) {
      return { valid: false, reason: 'Número rejeitado pelo algoritmo de Luhn (dígito verificador inválido).' };
    }

    // Identificar bandeira
    let detectedBrand = 'Desconhecida';
    if (/^4/.test(clean)) detectedBrand = 'Visa';
    else if (/^(5[1-5]|2[2-7])/.test(clean)) detectedBrand = 'Mastercard';
    else if (/^3[47]/.test(clean)) detectedBrand = 'American Express';
    else if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(clean)) detectedBrand = 'Elo';
    else if (/^606282/.test(clean)) detectedBrand = 'Hipercard';

    return {
      valid: true,
      brand: detectedBrand
    };
  }
};

window.CREDIT_CARD_TOOL = CREDIT_CARD_TOOL;
