/**
 * Ferramenta: Calculadora Comparativa CLT vs PJ
 * Desenvolvida para a realidade dos profissionais de TI e desenvolvedores no Brasil
 * Tabela de INSS progressiva, IRPF, 13º, Férias + 1/3, FGTS, Simples Nacional (Anexo III Fator R)
 */

const CLT_PJ_CALCULATOR = {
  // Teto INSS atualizado aproximado
  TETO_INSS: 7786.02,

  calculateINSS(bruto) {
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

    return inss;
  },

  calculateIRPF(baseCalculo) {
    if (baseCalculo <= 2259.20) return 0;
    if (baseCalculo <= 2826.65) return (baseCalculo * 0.075) - 169.44;
    if (baseCalculo <= 3751.05) return (baseCalculo * 0.15) - 381.44;
    if (baseCalculo <= 4664.68) return (baseCalculo * 0.225) - 662.77;
    return (baseCalculo * 0.275) - 896.00;
  },

  calculate(salarioCLT, beneficiosMensais = 0, faturamentoPJ = 0, custoContador = 150) {
    const clt = Number(salarioCLT) || 0;
    const beneficios = Number(beneficiosMensais) || 0;
    const pj = Number(faturamentoPJ) || 0;
    const contador = Number(custoContador) || 0;

    // --- CÁLCULO CLT ---
    const inssCLT = this.calculateINSS(clt);
    const baseIRPF_CLT = Math.max(0, clt - inssCLT);
    const irpfCLT = Math.max(0, this.calculateIRPF(baseIRPF_CLT));
    const liquidoMensalCLT = clt - inssCLT - irpfCLT + beneficios;

    // Benefícios anuais legais
    const fgtsMensal = clt * 0.08;
    const decimoTerceiro = clt; // 1 salário integral
    const feriasUmTerco = clt + (clt / 3); // 1 salário + 1/3 constitucional
    const fgtsAnual = fgtsMensal * 12;

    // Total anual CLT recebido em mãos (líquido x 12 + 13º líquido est. + 1/3 férias + FGTS anual)
    const decimoTerceiroLiquido = decimoTerceiro - this.calculateINSS(decimoTerceiro) - Math.max(0, this.calculateIRPF(decimoTerceiro - this.calculateINSS(decimoTerceiro)));
    const totalAnualCLT = (liquidoMensalCLT * 12) + decimoTerceiroLiquido + (clt / 3) + fgtsAnual;
    const mediaMensalRealCLT = totalAnualCLT / 12;

    // --- CÁLCULO PJ (Simples Nacional com Fator R 28%) ---
    // Imposto Simples Nacional Anexo III alíquota inicial ~6%
    const impostoSimples = pj * 0.06;
    // Pró-labore para garantir Fator R (mínimo 28% do faturamento)
    const proLabore = pj * 0.28;
    const inssProLabore = proLabore * 0.11; // 11% INSS patronal/contribuinte individual
    const irpfProLabore = Math.max(0, this.calculateIRPF(proLabore - inssProLabore));
    
    // Lucro distribuído isento
    const lucroIsento = pj - impostoSimples - proLabore - contador;
    const liquidoMensalPJ = (proLabore - inssProLabore - irpfProLabore) + Math.max(0, lucroIsento);
    const totalAnualPJ = liquidoMensalPJ * 12;

    // PJ Equivalente estimado: para ter o mesmo total anual da CLT
    // Fórmula empírica de mercado: Salário CLT * ~1.5 a 1.6
    const pjEquivalenteSugerido = (totalAnualCLT / 12) / 0.88;

    return {
      clt: {
        bruto: clt,
        inss: inssCLT,
        irpf: irpfCLT,
        beneficios,
        liquidoMensal: liquidoMensalCLT,
        fgtsMensal,
        totalAnual: totalAnualCLT,
        mediaMensalReal: mediaMensalRealCLT
      },
      pj: {
        faturamento: pj,
        impostoSimples,
        proLabore,
        inssProLabore,
        irpfProLabore,
        contador,
        liquidoMensal: liquidoMensalPJ,
        totalAnual: totalAnualPJ
      },
      comparativo: {
        diferencaAnual: totalAnualPJ - totalAnualCLT,
        vantagem: totalAnualPJ >= totalAnualCLT ? 'PJ' : 'CLT',
        pjEquivalente: pjEquivalenteSugerido
      }
    };
  }
};

window.CLT_PJ_CALCULATOR = CLT_PJ_CALCULATOR;
