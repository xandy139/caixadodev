/**
 * Ferramenta: Conversor de Formato de Texto (Case Converter)
 * camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, dot.case
 */

const CASE_CONVERTER = {
  // Quebrar qualquer texto em lista de palavras limpas
  extractWords(str) {
    if (!str) return [];
    return str
      // Separar camelCase (ex: nomeUsuario -> nome Usuario)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Substituir hífens, underscores, pontos e barras por espaço
      .replace(/[-_./\\]+/g, ' ')
      // Remover pontuações excedentes
      .replace(/[^\w\s\u00C0-\u017F]/gi, '')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);
  },

  toCamelCase(str) {
    const words = this.extractWords(str);
    if (!words.length) return '';
    return words.map((w, idx) => {
      const lower = w.toLowerCase();
      if (idx === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join('');
  },

  toPascalCase(str) {
    const words = this.extractWords(str);
    if (!words.length) return '';
    return words.map(w => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join('');
  },

  toSnakeCase(str) {
    const words = this.extractWords(str);
    return words.map(w => w.toLowerCase()).join('_');
  },

  toKebabCase(str) {
    const words = this.extractWords(str);
    return words.map(w => w.toLowerCase()).join('-');
  },

  toConstantCase(str) {
    const words = this.extractWords(str);
    return words.map(w => w.toUpperCase()).join('_');
  },

  toTitleCase(str) {
    const words = this.extractWords(str);
    return words.map(w => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(' ');
  },

  toDotCase(str) {
    const words = this.extractWords(str);
    return words.map(w => w.toLowerCase()).join('.');
  },

  convertAll(input) {
    if (!input || !input.trim()) {
      return {
        camel: '',
        pascal: '',
        snake: '',
        kebab: '',
        constant: '',
        title: '',
        dot: ''
      };
    }
    return {
      camel: this.toCamelCase(input),
      pascal: this.toPascalCase(input),
      snake: this.toSnakeCase(input),
      kebab: this.toKebabCase(input),
      constant: this.toConstantCase(input),
      title: this.toTitleCase(input),
      dot: this.toDotCase(input)
    };
  }
};

window.CASE_CONVERTER = CASE_CONVERTER;
