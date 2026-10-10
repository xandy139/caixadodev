/**
 * Ferramenta: Gerador e Validador de RG (Registro Geral)
 * Suporte a padrão de dígitos verificadores (SSP-SP) e formato nacional com/sem pontuação
 */

const RG_TOOL = {
  // Gera RG no padrão SSP-SP (mais comum no Brasil com dígito X/0-9)
  generate(withMask = true, state = 'SP') {
    // 8 dígitos base
    const digits = [];
    for (let i = 0; i < 8; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    // Cálculo do dígito verificador padrão SP (pesos 2 a 9)
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * (2 + i);
    }

    const rest = sum % 11;
    let dv;
    if (rest === 0) {
      dv = '0';
    } else if (rest === 1) {
      dv = 'X';
    } else {
      dv = String(11 - rest);
    }

    const raw = digits.join('') + dv;

    if (!withMask) return raw;

    // Formato: 00.000.000-0 ou 00.000.000-X
    return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}-${raw.slice(8)}`;
  },

  validate(rgInput) {
    if (!rgInput) return { valid: false, message: 'Digite um número de RG' };
    const clean = rgInput.trim().toUpperCase().replace(/[^0-9X]/g, '');

    if (clean.length < 7 || clean.length > 10) {
      return { 
        valid: false, 
        message: 'Tamanho de RG inválido (esperado entre 7 e 9 caracteres numéricos mais dígito).' 
      };
    }

    // Se tiver 9 caracteres (padrão SP), calcula dígito oficial
    if (clean.length === 9) {
      const base = clean.slice(0, 8);
      const providedDv = clean.slice(8);

      if (!/^\d{8}$/.test(base)) {
        return { valid: false, message: 'Os primeiros 8 caracteres devem ser números.' };
      }

      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += parseInt(base[i]) * (2 + i);
      }

      const rest = sum % 11;
      let expectedDv;
      if (rest === 0) expectedDv = '0';
      else if (rest === 1) expectedDv = 'X';
      else expectedDv = String(11 - rest);

      if (providedDv === expectedDv) {
        return { 
          valid: true, 
          message: `RG Válido! Formato SSP-SP com dígito verificador '${expectedDv}' correto.` 
        };
      } else {
        return { 
          valid: false, 
          message: `Dígito verificador incorreto. Esperado: '${expectedDv}', Encontrado: '${providedDv}'.` 
        };
      }
    }

    // Outros estados brasileiros não possuem algoritmo nacional unificado único
    return {
      valid: true,
      message: `RG com estrutura aceita (${clean.length} dígitos). Nota: Estados fora de SP possuem regras próprias de emissão.`
    };
  }
};

window.RG_TOOL = RG_TOOL;
