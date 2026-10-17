/**
 * Ferramenta: Formatador e Minificador de HTML & CSS
 * Algoritmo client-side rápido para identação e compressão de código web
 */

const CODE_BEAUTIFIER = {
  get SAMPLE_HTML() {
    if (document.documentElement.lang === 'en') {
      return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Example</title><style>body{margin:0;padding:20px;font-family:sans-serif;background:#0d1117;color:#fff;}.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px;}</style></head><body><div class="card"><h1>Hello Developer!</h1><p>Clean, readable, well-formatted code.</p><button id="btn" class="btn-primary">Click Here</button></div></body></html>`;
    }
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Exemplo</title><style>body{margin:0;padding:20px;font-family:sans-serif;background:#0d1117;color:#fff;}.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px;}</style></head><body><div class="card"><h1>Olá Dev!</h1><p>Código limpo e bem formatado.</p><button id="btn" class="btn-primary">Clique Aqui</button></div></body></html>`;
  },

  get SAMPLE_CSS() {
    if (document.documentElement.lang === 'en') {
      return `/* Reset & Global Styles */
body{margin:0;padding:0;background-color:#0f172a;color:#f8fafc;font-family:'Inter',sans-serif;}
.container{max-width:1200px;margin:0 auto;padding:0 24px;}
.header{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid #1e293b;}
.btn-primary{background:#6366f1;color:#ffffff;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;transition:background 0.2s ease;}
.btn-primary:hover{background:#4f46e5;}`;
    }
    return `/* Reset e Estilos Globais */
body{margin:0;padding:0;background-color:#0f172a;color:#f8fafc;font-family:'Inter',sans-serif;}
.container{max-width:1200px;margin:0 auto;padding:0 24px;}
.header{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid #1e293b;}
.btn-primary{background:#6366f1;color:#ffffff;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;transition:background 0.2s ease;}
.btn-primary:hover{background:#4f46e5;}`;
  },

  formatHTML(html, indentSize = 2) {
    if (!html) return '';
    const indent = ' '.repeat(indentSize);
    let tab = '';
    let result = '';

    // Remove espaços entre tags existentes
    const clean = html.replace(/>\s+</g, '><').trim();

    // Regex para separar tags e conteúdo
    const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);

    const selfClosing = /^(<(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[^>]*>)$/i;

    tokens.forEach(token => {
      const isTag = token.startsWith('<') && token.endsWith('>');
      const isClosingTag = token.startsWith('</');
      const isComment = token.startsWith('<!--');
      const isDoctype = token.toLowerCase().startsWith('<!doctype');

      if (isClosingTag) {
        tab = tab.slice(indentSize);
        result += `${tab}${token}\n`;
      } else if (isTag) {
        result += `${tab}${token}\n`;
        if (!isClosingTag && !selfClosing.test(token) && !isComment && !isDoctype && !token.endsWith('/>')) {
          tab += indent;
        }
      } else {
        const text = token.trim();
        if (text) {
          result += `${tab}${text}\n`;
        }
      }
    });

    return result.trim();
  },

  minifyHTML(html) {
    if (!html) return '';
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // remove comentários
      .replace(/>\s+</g, '><')         // remove espaço entre tags
      .replace(/\s{2,}/g, ' ')         // múltiplos espaços para um
      .trim();
  },

  formatCSS(css, indentSize = 2) {
    if (!css) return '';
    const indent = ' '.repeat(indentSize);
    let clean = css
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m) // preserva comentários
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .trim();

    const lines = clean.split('\n');
    let depth = 0;
    const formatted = [];

    lines.forEach(line => {
      let l = line.trim();
      if (!l) return;

      if (l.includes('}')) {
        depth = Math.max(0, depth - 1);
      }

      formatted.push(`${indent.repeat(depth)}${l}`);

      if (l.includes('{')) {
        depth++;
      }
    });

    return formatted.join('\n');
  },

  minifyCSS(css) {
    if (!css) return '';
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove comentários
      .replace(/\s+/g, ' ')             // múltiplos espaços
      .replace(/\s*([\{\}:;,])\s*/g, '$1') // remove espaços ao redor de símbolos
      .replace(/;}/g, '}')              // remove último ponto e vírgula
      .trim();
  }
};

window.CODE_BEAUTIFIER = CODE_BEAUTIFIER;
