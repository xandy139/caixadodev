/**
 * Ferramenta: Comparador de Arquivos e Textos (Diff Checker)
 * Algoritmo de comparação linha por linha com detecção de adições, remoções e modificações
 */

const DIFF_CHECKER = {
  compare(textA, textB) {
    const linesA = (textA || '').split(/\r?\n/);
    const linesB = (textB || '').split(/\r?\n/);

    const diff = [];
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    let i = 0;
    let j = 0;

    while (i < linesA.length || j < linesB.length) {
      const lineA = linesA[i];
      const lineB = linesB[j];

      if (i < linesA.length && j < linesB.length && lineA === lineB) {
        diff.push({ type: 'unchanged', text: lineA, lineA: i + 1, lineB: j + 1 });
        unchangedCount++;
        i++;
        j++;
      } else {
        // Verificar se linhaA existe mais adiante em B
        const indexInB = linesB.indexOf(lineA, j);
        const indexInA = linesA.indexOf(lineB, i);

        if (indexInB !== -1 && (indexInA === -1 || indexInB - j <= indexInA - i)) {
          // Linha foi adicionada em B
          diff.push({ type: 'added', text: lineB, lineA: null, lineB: j + 1 });
          addedCount++;
          j++;
        } else if (i < linesA.length) {
          // Linha foi removida de A
          diff.push({ type: 'removed', text: lineA, lineA: i + 1, lineB: null });
          removedCount++;
          i++;
        } else {
          diff.push({ type: 'added', text: lineB, lineA: null, lineB: j + 1 });
          addedCount++;
          j++;
        }
      }
    }

    return {
      diff,
      stats: {
        added: addedCount,
        removed: removedCount,
        unchanged: unchangedCount,
        totalLines: diff.length
      }
    };
  },

  getSample() {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    if (isEn) {
      return {
        textA: `function calculateDiscount(price) {
  // Version 1.0
  const rate = 0.05;
  return price * (1 - rate);
}

console.log(calculateDiscount(100));`,
        textB: `function calculateDiscount(price, coupon = false) {
  // Version 2.0 with special coupon support
  let rate = 0.05;
  if (coupon) {
    rate = 0.15;
  }
  return price * (1 - rate);
}

console.log(calculateDiscount(100, true));`
      };
    }
    return {
      textA: `function calcularDesconto(valor) {
  // Versão 1.0
  const taxa = 0.05;
  return valor * (1 - taxa);
}

console.log(calcularDesconto(100));`,
      textB: `function calcularDesconto(valor, cupom = false) {
  // Versão 2.0 com suporte a cupom especial
  let taxa = 0.05;
  if (cupom) {
    taxa = 0.15;
  }
  return valor * (1 - taxa);
}

console.log(calcularDesconto(100, true));`
    };
  }
};

window.DIFF_CHECKER = DIFF_CHECKER;
