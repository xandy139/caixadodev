/**
 * Ferramenta: Codificador e Decodificador Base64 e URL
 * Suporte completo a UTF-8 / Full UTF-8 support
 */

const BASE64_TOOL = {
  encodeBase64(text) {
    if (!text) return '';
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    try {
      const bytes = new TextEncoder().encode(text);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      return btoa(binString);
    } catch (err) {
      throw new Error((isEn ? 'Failed to encode to Base64: ' : 'Falha ao codificar para Base64: ') + err.message);
    }
  },

  decodeBase64(base64) {
    if (!base64) return '';
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    try {
      const binString = atob(base64.trim());
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch (err) {
      throw new Error((isEn ? 'Invalid or corrupted Base64 string: ' : 'Base64 inválido ou corrompido: ') + err.message);
    }
  },

  encodeUrl(text) {
    if (!text) return '';
    return encodeURIComponent(text);
  },

  decodeUrl(text) {
    if (!text) return '';
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    try {
      return decodeURIComponent(text);
    } catch (err) {
      throw new Error((isEn ? 'Invalid URL string for decoding: ' : 'String de URL inválida para decodificação: ') + err.message);
    }
  }
};

if (typeof window !== 'undefined') {
  window.BASE64_TOOL = BASE64_TOOL;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BASE64_TOOL;
}
