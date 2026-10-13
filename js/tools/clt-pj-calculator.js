/**
 * Ferramenta: Calculadora Comparativa CLT vs PJ
 * Desenvolvida para a realidade dos profissionais de TI, desenvolvedores e analistas de QA no Brasil
 * Tabela de INSS progressiva, IRPF, 13º, Férias + 1/3, FGTS, Simples Nacional (Anexo III Fator R e Anexo V)
 */

const CLT_PJ_CALCULATOR = {
  // Salário Mínimo e Teto INSS atualizados (Vigência 2024 - 2026)
  SALARIO_MINIMO: 1412.00,
  TETO_INSS: 7786.02,

  // Cálculo de INSS Progressivo do Trabalhador CLT (Portaria Interministerial)
  calculateINSS(bruto) {
    if (bruto <= 0) return 0;
    let base = Math.min(bruto, this.TETO_INSS);
    let inss = 0;

    // Faixa 1: até 1.412,00 (7,5%)
    if (base > 1412.00) {
      inss += 1412.00 * 0.075;
    } else {
      return base * 0.075;
    }

    // Faixa 2: 1.412,01 até 2.666,68 (9%)
    if (base > 2666.68) {
      inss += (2666.68 - 1412.00) * 0.09;
    } else {
      return inss + (base - 1412.00) * 0.09;
    }

    // Faixa 3: 2.666,69 até 4.000,03 (12%)
    if (base > 4000.03) {
      inss += (4000.03 - 2666.68) * 0.12;
    } else {
      return inss + (base - 2666.68) * 0.12;
    }

    // Faixa 4: 4.000,04 até 7.786,02 (14%)
    inss += (base - 4000.03) * 0.14;

    // Teto máximo de contribuição de R$ 908,86
    return Math.min(inss, 908.86);
  },

  // Tabela Progressiva do IRPF (Receita Federal)
  calculateIRPF(baseCalculo) {
    if (baseCalculo <= 2259.20) return 0;
    if (baseCalculo <= 2826.65) return (baseCalculo * 0.075) - 169.44;
    if (baseCalculo <= 3751.05) return (baseCalculo * 0.15) - 381.44;
    if (baseCalculo <= 4664.68) return (baseCalculo * 0.225) - 662.77;
    return (baseCalculo * 0.275) - 896.00;
  },

  /**
   * Cálculo Comparativo Completo
   * @param {number} salarioCLT - Salário bruto mensal CLT
   * @param {number} beneficiosMensais - VR, VA, Saúde, etc. (em R$)
   * @param {number} faturamentoPJ - Faturamento bruto mensal emitido na Nota Fiscal (R$)
   * @param {number} custoContador - Mensalidade de contabilidade (R$)
   * @param {string} regimePJ - 'anexo3' (com Fator R 28% a 6%) ou 'anexo5' (sem Fator R a 15,5%)
   */
  calculate(salarioCLT, beneficiosMensais = 0, faturamentoPJ = 0, custoContador = 150, regimePJ = 'anexo3') {
    const clt = Math.max(0, Number(salarioCLT) || 0);
    const beneficios = Math.max(0, Number(beneficiosMensais) || 0);
    const pj = Math.max(0, Number(faturamentoPJ) || 0);
    const contador = Math.max(0, Number(custoContador) || 0);

    // ==========================================
    // 1. CÁLCULO REGIME CLT
    // ==========================================
    const inssCLT = this.calculateINSS(clt);
    const baseIRPF_CLT = Math.max(0, clt - inssCLT);
    const irpfCLT = Math.max(0, this.calculateIRPF(baseIRPF_CLT));
    const liquidoMensalCLT = clt - inssCLT - irpfCLT + beneficios;

    // Benefícios Legais Obrigatórios da CLT:
    // a) FGTS: 8% do salário bruto pago pela empresa (não descontado do empregado)
    const fgtsMensal = clt * 0.08;

    // b) 13º Salário: 1 salário integral no fim do ano (com dedução própria de INSS e IRPF na fonte)
    const inss13 = this.calculateINSS(clt);
    const irpf13 = Math.max(0, this.calculateIRPF(clt - inss13));
    const decimoTerceiroLiquido = clt - inss13 - irpf13;

    // c) Férias remuneradas e 1/3 Constitucional:
    // O trabalhador goza 30 dias de férias e recebe adiantado 1 salário normal + 1/3 constitucional.
    // Durante o ano, são 12 salários normais trabalhados/descansados + o bônus de 1/3 de férias.
    // Sobre o 1/3 de férias incide IRPF pela tabela progressiva:
    const tercoFeriasBruto = clt / 3;
    const irpfTercoFerias = Math.max(0, this.calculateIRPF(tercoFeriasBruto));
    const tercoFeriasLiquido = tercoFeriasBruto - irpfTercoFerias;

    // d) FGTS Total Anual: incide sobre os 12 meses + 13º salário + 1/3 de férias
    const fgtsTotalAnual = (clt * 12 + clt + tercoFeriasBruto) * 0.08;

    // Total anual efetivo recebido em mãos + FGTS acumulado:
    const totalAnualCLT = (liquidoMensalCLT * 12) + decimoTerceiroLiquido + tercoFeriasLiquido + fgtsTotalAnual;
    const mediaMensalRealCLT = totalAnualCLT / 12;

    // ==========================================
    // 2. CÁLCULO REGIME PJ (PESSOA JURÍDICA)
    // ==========================================
    let aliquotaDAS = 0.06; // Anexo III padrão 6%
    let proLabore = 0;
    let inssProLabore = 0;
    let irpfProLabore = 0;

    if (regimePJ === 'anexo5') {
      // Simples Nacional Anexo V: sem Fator R (alíquota inicial 15,5%)
      aliquotaDAS = 0.155;
      // Pró-labore mínimo legal: 1 Salário Mínimo
      proLabore = pj > 0 ? Math.min(pj, this.SALARIO_MINIMO) : 0;
      // INSS 11% sobre o Salário Mínimo (contribuinte individual)
      inssProLabore = proLabore * 0.11;
      // Isento de IRPF pois pró-labore de 1 salário mínimo está abaixo de R$ 2.259,20
      irpfProLabore = 0;
    } else {
      // Simples Nacional Anexo III com Fator R (28% de folha)
      aliquotaDAS = 0.06;

      if (pj > 0) {
        // Pró-labore necessário para atingir 28% da folha (com piso legal de 1 Salário Mínimo)
        const proLaboreIdeal = pj * 0.28;
        proLabore = Math.max(this.SALARIO_MINIMO, proLaboreIdeal);
        // Garantir que não ultrapasse o faturamento
        if (proLabore > pj) proLabore = pj;

        // INSS sobre Pró-Labore (11% de Contribuinte Individual)
        // REGRA DE OURO: O sócio NUNCA paga INSS acima do Teto Previdenciário!
        const baseINSSProlabore = Math.min(proLabore, this.TETO_INSS);
        inssProLabore = baseINSSProlabore * 0.11;

        // IRPF sobre Pró-Labore:
        const baseIRPFProlabore = Math.max(0, proLabore - inssProLabore);
        irpfProLabore = Math.max(0, this.calculateIRPF(baseIRPFProlabore));
      }
    }

    // Guia Única de Imposto Simples Nacional (DAS)
    const impostoDAS = pj * aliquotaDAS;

    // Lucro Distribuído Isento (Artigo 10 da Lei Federal nº 9.249/1995)
    // O que sobra após impostos da PJ, pró-labore e contabilidade é distribuído com ZERO IRPF!
    const lucroDistribuidoIsento = Math.max(0, pj - impostoDAS - proLabore - contador);

    // Líquido Mensal em mãos do PJ:
    // (Pró-labore líquido de INSS e IRPF) + Lucro Isento
    const proLaboreLiquido = Math.max(0, proLabore - inssProLabore - irpfProLabore);
    const liquidoMensalPJ = proLaboreLiquido + lucroDistribuidoIsento;
    const totalAnualPJ = liquidoMensalPJ * 12;

    // ==========================================
    // 3. COMPARATIVO & PJ EQUIVALENTE REAL
    // ==========================================
    const diferencaAnual = totalAnualPJ - totalAnualCLT;
    const diferencaMensal = diferencaAnual / 12;
    const vantagem = totalAnualPJ >= totalAnualCLT ? 'PJ' : 'CLT';

    // Faturamento PJ necessário para empatar exatamente com a média mensal real da CLT:
    // Leva em conta o imposto do DAS (~6% ou ~15,5%) e custos contábeis
    const taxaRetencaoEstimada = regimePJ === 'anexo5' ? 0.81 : 0.89; // margem líquida média
    const pjEquivalente = Math.round(((mediaMensalRealCLT + contador) / taxaRetencaoEstimada) * 100) / 100;
    const multiplicadorMercado = clt > 0 ? (pjEquivalente / clt).toFixed(2) : 1.5;

    return {
      clt: {
        bruto: clt,
        inss: inssCLT,
        irpf: irpfCLT,
        beneficios,
        liquidoMensal: liquidoMensalCLT,
        fgtsMensal,
        decimoTerceiroLiquido,
        tercoFeriasLiquido,
        fgtsTotalAnual,
        totalAnual: totalAnualCLT,
        mediaMensalReal: mediaMensalRealCLT
      },
      pj: {
        faturamento: pj,
        regimePJ,
        aliquotaDAS: aliquotaDAS * 100,
        impostoSimples: impostoDAS,
        proLabore,
        inssProLabore,
        irpfProLabore,
        proLaboreLiquido,
        lucroDistribuidoIsento,
        contador,
        liquidoMensal: liquidoMensalPJ,
        totalAnual: totalAnualPJ
      },
      comparativo: {
        diferencaAnual,
        diferencaMensal,
        vantagem,
        pjEquivalente,
        multiplicadorMercado
      }
    };
  }
};

if (typeof window !== 'undefined') window.CLT_PJ_CALCULATOR = CLT_PJ_CALCULATOR;
if (typeof module !== 'undefined' && module.exports) module.exports = CLT_PJ_CALCULATOR;
