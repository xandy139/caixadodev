/**
 * Ferramenta: Gerador e Validador de Certidões Civis (CNJ)
 * Provimento nº 63/2017 do Conselho Nacional de Justiça
 * Suporte a Nascimento, Casamento e Óbito com 32 dígitos e 2 DVs (Módulo 11)
 */

const CERTIDAO_TOOL = {
  TIPOS: {
    nascimento: { code: '55', label: 'Nascimento' },
    casamento: { code: '56', label: 'Casamento' },
    casamento_religioso: { code: '57', label: 'Casamento Religioso' },
    obito: { code: '58', label: 'Óbito' },
    natimorto: { code: '59', label: 'Natimorto' }
  },

  calculateDV(digits30) {
    // Cálculo do 1º Dígito Verificador (DV1)
    let sum1 = 0;
    let weight = 2;
    for (let i = digits30.length - 1; i >= 0; i--) {
      sum1 += parseInt(digits30[i], 10) * weight;
      weight = (weight === 10) ? 2 : weight + 1;
    }
    let rest1 = sum1 % 11;
    let dv1 = (rest1 === 10) ? 1 : rest1;

    // Cálculo do 2º Dígito Verificador (DV2) usando os 30 dígitos + DV1
    const digits31 = digits30 + dv1;
    let sum2 = 0;
    weight = 2;
    for (let i = digits31.length - 1; i >= 0; i--) {
      sum2 += parseInt(digits31[i], 10) * weight;
      weight = (weight === 10) ? 2 : weight + 1;
    }
    let rest2 = sum2 % 11;
    let dv2 = (rest2 === 10) ? 1 : rest2;

    return `${dv1}${dv2}`;
  },

  generate(tipoKey = 'nascimento', withMask = true) {
    const tipo = this.TIPOS[tipoKey] || this.TIPOS.nascimento;

    // 1. CNS (Código Nacional da Serventia): 6 dígitos (100000 - 999999)
    const cns = String(Math.floor(100000 + Math.random() * 899999));
    
    // 2. Acervo: 01 (próprio) ou 02 (incorporado)
    const acervo = Math.random() > 0.5 ? '01' : '02';

    // 3. Tipo de Livro (55 nascimento, 56 casamento, 58 obito)
    const tipoLivro = tipo.code;

    // 4. Ano do Registro: 1980 - 2026
    const ano = String(Math.floor(1985 + Math.random() * 41));

    // 5. Tipo de Livro número (1 a 9)
    const tipoLivroLetra = String(Math.floor(1 + Math.random() * 5));

    // 6. Livro: 5 dígitos (00001 - 09999)
    const livro = String(Math.floor(1 + Math.random() * 9999)).padStart(5, '0');

    // 7. Folha: 3 dígitos (001 - 999)
    const folha = String(Math.floor(1 + Math.random() * 999)).padStart(3, '0');

    // 8. Termo: 7 dígitos (0000001 - 9999999)
    const termo = String(Math.floor(1 + Math.random() * 999999)).padStart(7, '0');

    const base30 = `${cns}${acervo}${tipoLivro}${ano}${tipoLivroLetra}${livro}${folha}${termo}`;
    const dvs = this.calculateDV(base30);
    const full = base30 + dvs;

    if (!withMask) return { raw: full, formatted: full, tipo: tipo.label, ano };

    // Máscara oficial CNJ: 123456.01.55.2024.1.00123.045.0001234-56
    const formatted = `${cns}.${acervo}.${tipoLivro}.${ano}.${tipoLivroLetra}.${livro}.${folha}.${termo}-${dvs}`;
    return {
      raw: full,
      formatted,
      tipo: tipo.label,
      cns,
      ano,
      dvs
    };
  },

  validate(certidaoStr) {
    if (!certidaoStr) return { valid: false, message: 'Digite o número da certidão.' };
    const clean = certidaoStr.replace(/\D/g, '');

    if (clean.length !== 32) {
      return {
        valid: false,
        message: `Tamanho incorreto (${clean.length} dígitos). O padrão oficial do CNJ possui exatamente 32 dígitos.`
      };
    }

    const base30 = clean.slice(0, 30);
    const providedDv = clean.slice(30, 32);
    const expectedDv = this.calculateDV(base30);

    if (providedDv === expectedDv) {
      const tipoCode = clean.slice(8, 10);
      let tipoNome = 'Desconhecido';
      Object.values(this.TIPOS).forEach(t => {
        if (t.code === tipoCode) tipoNome = t.label;
      });

      const ano = clean.slice(10, 14);

      return {
        valid: true,
        tipo: tipoNome,
        ano,
        message: `Certidão Válida! Tipo: ${tipoNome}, Ano: ${ano}, DVs [${expectedDv}] conferem perfeitamente com a regra do CNJ.`
      };
    } else {
      return {
        valid: false,
        message: `Dígitos verificadores inválidos! Fornecido: ${providedDv}, Esperado pelo algoritmo: ${expectedDv}.`
      };
    }
  }
};

window.CERTIDAO_TOOL = CERTIDAO_TOOL;
