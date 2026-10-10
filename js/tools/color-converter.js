/**
 * Ferramenta: Conversor de Cores (HEX <> RGB <> HSL)
 * Conversão instantânea de formatos de cores para CSS e Web Design
 */

const COLOR_CONVERTER = {
  hexToRgb(hex) {
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length !== 6) return null;

    const num = parseInt(clean, 16);
    if (isNaN(num)) return null;

    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  },

  rgbToHex(r, g, b) {
    const toHex = (n) => {
      const val = Math.min(255, Math.max(0, Math.round(n)));
      return val.toString(16).padStart(2, '0');
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // monocromático
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  },

  parseAny(colorStr) {
    if (!colorStr) return null;
    const str = colorStr.trim();

    // 1. Tentar HEX
    if (str.startsWith('#') || /^[0-9A-Fa-f]{3,6}$/.test(str)) {
      const rgb = this.hexToRgb(str);
      if (rgb) return this.generateOutputs(rgb.r, rgb.g, rgb.b);
    }

    // 2. Tentar RGB(A)
    const rgbMatch = str.match(/rgba?\(?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return this.generateOutputs(r, g, b);
    }

    return null;
  },

  generateOutputs(r, g, b) {
    const hex = this.rgbToHex(r, g, b);
    const hsl = this.rgbToHsl(r, g, b);

    // Luminância relativa (WCAG)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isDark = luminance < 0.5;

    return {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      rgba: `rgba(${r}, ${g}, ${b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      r, g, b,
      isDark
    };
  }
};

window.COLOR_CONVERTER = COLOR_CONVERTER;
