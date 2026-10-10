/**
 * Ferramenta: Testador de Expressões Regulares (Regex Tester & Cheat Sheet)
 * Destaque visual de correspondências, grupos de captura e presets úteis
 */

const REGEX_TESTER = {
  presets: {
    email: { pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi', label: 'E-mail' },
    cpf: { pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}', flags: 'g', label: 'CPF com pontuação' },
    cep: { pattern: '\\d{5}-\\d{3}', flags: 'g', label: 'CEP (00000-000)' },
    url: { pattern: 'https?:\\/\\/[\\w\\.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+', flags: 'gi', label: 'URL / Link Web' },
    phone: { pattern: '\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}', flags: 'g', label: 'Telefone Celular com DDD' },
    date: { pattern: '\\d{2}\\/\\d{2}\\/\\d{4}', flags: 'g', label: 'Data (DD/MM/AAAA)' }
  },

  test(patternStr, flags, text) {
    if (!patternStr || !text) {
      return { success: false, matches: [], count: 0, html: escapeHtml(text || '') };
    }

    try {
      const regex = new RegExp(patternStr, flags || 'g');
      const matches = [];
      let match;

      // Se não tiver flag 'g', faz exec uma única vez
      if (!flags.includes('g')) {
        match = regex.exec(text);
        if (match) {
          matches.push({ text: match[0], index: match.index });
        }
      } else {
        while ((match = regex.exec(text)) !== null) {
          matches.push({ text: match[0], index: match.index });
          if (match.index === regex.lastIndex) regex.lastIndex++; // Previne loop infinito com regex vazio
        }
      }

      // Gerar HTML com highlight das correspondências
      let html = '';
      let lastIdx = 0;
      matches.forEach(m => {
        html += escapeHtml(text.slice(lastIdx, m.index));
        html += `<mark class="regex-match">${escapeHtml(m.text)}</mark>`;
        lastIdx = m.index + m.text.length;
      });
      html += escapeHtml(text.slice(lastIdx));

      return {
        success: true,
        matches,
        count: matches.length,
        html
      };
    } catch (err) {
      return { success: false, error: err.message, matches: [], count: 0, html: escapeHtml(text) };
    }
  }
};

window.REGEX_TESTER = REGEX_TESTER;
