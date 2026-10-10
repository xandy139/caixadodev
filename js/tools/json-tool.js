/**
 * Ferramenta: Formatador, Validador e Minificador de JSON
 */

const JSON_TOOL = {
  format(jsonString, indent = 2) {
    if (!jsonString || !jsonString.trim()) {
      return { success: false, error: 'Por favor, insira um código JSON para formatar.' };
    }

    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, indent);
      const stats = this.getStats(parsed, jsonString, formatted);
      return { success: true, result: formatted, stats };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  minify(jsonString) {
    if (!jsonString || !jsonString.trim()) {
      return { success: false, error: 'Por favor, insira um código JSON para minificar.' };
    }

    try {
      const parsed = JSON.parse(jsonString);
      const minified = JSON.stringify(parsed);
      const stats = this.getStats(parsed, jsonString, minified);
      return { success: true, result: minified, stats };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  getStats(obj, rawOriginal, result) {
    let keysCount = 0;
    const countKeys = (item) => {
      if (typeof item === 'object' && item !== null) {
        if (Array.isArray(item)) {
          item.forEach(countKeys);
        } else {
          keysCount += Object.keys(item).length;
          Object.values(item).forEach(countKeys);
        }
      }
    };
    countKeys(obj);

    const origBytes = new Blob([rawOriginal]).size;
    const resBytes = new Blob([result]).size;
    const saved = origBytes - resBytes;

    return {
      keys: keysCount,
      originalSize: origBytes,
      resultSize: resBytes,
      diffPercentage: origBytes > 0 ? ((saved / origBytes) * 100).toFixed(1) : 0
    };
  },

  getSample() {
    return JSON.stringify({
      projeto: "Caixa do Dev",
      versao: "1.0.0",
      recursos: [
        "Gerador de CPF/CNPJ",
        "Formatador JSON",
        "Decodificador JWT",
        "Conversor Unix Timestamp"
      ],
      autor: {
        nome: "Comunidade Dev Brasil",
        ativo: true
      },
      metricas: {
        tempoMedioProcessamentoMs: 0.42,
        requisicoesExternas: 0
      }
    }, null, 2);
  }
};

window.JSON_TOOL = JSON_TOOL;
