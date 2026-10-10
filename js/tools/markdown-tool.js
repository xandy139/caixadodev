/**
 * Ferramenta: Editor e Renderizador de Markdown para HTML
 * Parser client-side rápido com suporte a Headings, Tabelas, Código, Blockquotes, Listas e Links
 */

const MARKDOWN_TOOL = {
  SAMPLE: `# 🚀 Projeto Exemplo - Caixa do Dev

Bem-vindo ao **Caixa do Dev**, a suíte definitiva para desenvolvedores!

## ✨ Funcionalidades
- **100% Client-Side**: Nenhum dado trafega para servidores externos.
- **Rápido**: Renderização instantânea com suporte a *Markdown* e *GFM*.
- [Acesse o site oficial](https://caixadodev.com.br)

## 📋 Lista de Tarefas
- [x] Criar geradores de documentos (CPF, CNPJ, RG)
- [x] Implementar formatadores de SQL e JSON
- [ ] Adicionar suporte a temas customizados

## 📊 Tabela de Tecnologias
| Tecnologia | Função | Velocidade |
| :--- | :--- | :--- |
| JavaScript Vanilla | Motor do navegador | < 1ms |
| CSS Moderno | Layout e Dark Mode | 60 FPS |
| Web Crypto API | Hashes Seguros | Nativo |

## 💻 Exemplo de Código
\`\`\`javascript
const saudar = (nome) => {
  console.log(\`Olá, \${nome}! Bem-vindo ao Caixa do Dev.\`);
};
saudar('Dev');
\`\`\`

> "A simplicidade é o último grau de sofisticação." — Leonardo da Vinci
`,

  parse(mdText) {
    if (!mdText) return '';
    let html = mdText;

    // Escapar tags HTML perigosas para evitar XSS direto no preview
    html = html.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');

    // Fenced Code Blocks (```lang ... ```)
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="md-code-block"><code class="lang-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

    // Headings (H1 a H4)
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquotes (> quote)
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="md-quote">$1</blockquote>');

    // Horizontal Rule (--- ou ***)
    html = html.replace(/^(?:---|\*\*\*|___)\s*$/gim, '<hr class="md-hr">');

    // Bold, Italic, Strikethrough
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Task Lists (- [x] e - [ ])
    html = html.replace(/^- \[(x|X)\] (.*$)/gim, '<li class="md-task-item"><input type="checkbox" checked disabled> $2</li>');
    html = html.replace(/^- \[ \] (.*$)/gim, '<li class="md-task-item"><input type="checkbox" disabled> $2</li>');

    // Unordered Lists (- item ou * item)
    html = html.replace(/^[\*\-] (?!<input)(.*$)/gim, '<li>$1</li>');

    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>');

    // Tabelas simples (| a | b |)
    html = html.replace(/^\|(.+)\|$/gim, (match) => {
      const cells = match.split('|').filter(c => c.trim().length > 0);
      if (cells.some(c => c.trim().startsWith('---') || c.trim().startsWith(':---'))) {
        return ''; // linha divisória
      }
      const tdList = cells.map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tdList}</tr>`;
    });

    // Envolver grupos de <tr> em <table>
    html = html.replace(/(<tr>[\s\S]*?<\/tr>)+/g, (match) => {
      return `<div class="md-table-wrap"><table class="md-table">${match}</table></div>`;
    });

    // Envolver grupos de <li> em <ul>
    html = html.replace(/(<li[\s\S]*?<\/li>)+/g, (match) => {
      return `<ul class="md-list">${match}</ul>`;
    });

    // Parágrafos (linhas com texto não envolvidas em tags bloco)
    const lines = html.split('\n');
    const result = [];
    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        result.push('');
      } else if (!trimmed.startsWith('<h') && 
                 !trimmed.startsWith('<pre') && 
                 !trimmed.startsWith('<ul') && 
                 !trimmed.startsWith('<li') && 
                 !trimmed.startsWith('<block') && 
                 !trimmed.startsWith('<div') && 
                 !trimmed.startsWith('<table') && 
                 !trimmed.startsWith('<tr') && 
                 !trimmed.startsWith('<hr')) {
        result.push(`<p>${trimmed}</p>`);
      } else {
        result.push(trimmed);
      }
    }

    return result.join('\n');
  }
};

window.MARKDOWN_TOOL = MARKDOWN_TOOL;
