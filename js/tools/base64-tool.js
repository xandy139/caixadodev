/**
 * Ferramenta: Codificador e Decodificador Base64 e URL
 * Suporte completo a acentuação em português (UTF-8)
 */

const BASE64_TOOL = {
  encodeBase64(text) {
    if (!text) return '';
    try {
      const bytes = new TextEncoder().encode(text);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      return btoa(binString);
    } catch (err) {
      throw new Error('Falha ao codificar para Base64: ' + err.message);
    }
  },

  decodeBase64(base64) {
    if (!base64) return '';
    try {
      const binString = atob(base64.trim());
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch (err) {
      throw new Error('Base64 inválido ou corrompido: ' + err.message);
    }
  },

  encodeUrl(text) {
    if (!text) return '';
    return encodeURIComponent(text);
  },

  decodeUrl(text) {
    if (!text) return '';
    try {
      return decodeURIComponent(text);
    } catch (err) {
      throw new Error('String de URL inválida para decodificação: ' + err.message);
    }
  }
};

window.BASE64_TOOL = BASE64_TOOL;
