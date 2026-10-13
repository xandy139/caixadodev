/**
 * Ferramenta: Otimizador de SVG e Gerador de Data URI para CSS
 * Converte código SVG em data URIs seguros para background-image e Base64
 */

const SVG_TOOL = {
  SAMPLE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>`,

  optimize(svgString) {
    if (!svgString) return '';
    return svgString
      .replace(/<script[\s\S]*?<\/script>/gi, '') // remove scripts maliciosos (XSS)
      .replace(/\son[a-z]+=(["'][^"']*["']|[^\s>]+)/gi, '') // remove handlers inline on*
      .replace(/<\?xml[\s\S]*?\?>/i, '') // remove declaração xml
      .replace(/<!DOCTYPE[\s\S]*?>/i, '') // remove doctype
      .replace(/<!--[\s\S]*?-->/g, '')     // remove comentários
      .replace(/\s+/g, ' ')               // colapsa múltiplos espaços
      .replace(/>\s+</g, '><')            // remove espaços entre tags
      .trim();
  },

  toCssDataUri(svgString) {
    const minified = this.optimize(svgString);
    if (!minified) return '';

    // Encode especial para SVG em CSS: precisa codificar #, <, >, ", '
    const encoded = minified
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
      .replace(/"/g, "'");

    return `background-image: url("data:image/svg+xml,${encoded}");`;
  },

  toBase64Uri(svgString) {
    const minified = this.optimize(svgString);
    if (!minified) return '';
    const b64 = btoa(unescape(encodeURIComponent(minified)));
    return `data:image/svg+xml;base64,${b64}`;
  }
};

window.SVG_TOOL = SVG_TOOL;
