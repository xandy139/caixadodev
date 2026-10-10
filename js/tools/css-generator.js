/**
 * Ferramenta: Gerador de Sombras (Box Shadow) e Glassmorphism CSS
 * Sliders interativos com preview em tempo real e código CSS pronto para copiar
 */

const CSS_GENERATOR = {
  PRESETS_SHADOW: {
    subtle: { x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 0.1 },
    soft: { x: 0, y: 10, blur: 25, spread: -5, color: '#000000', opacity: 0.15 },
    elevated: { x: 0, y: 20, blur: 40, spread: -10, color: '#000000', opacity: 0.25 },
    neon_indigo: { x: 0, y: 0, blur: 25, spread: 5, color: '#6366f1', opacity: 0.5 },
    neon_cyan: { x: 0, y: 0, blur: 25, spread: 5, color: '#06b6d4', opacity: 0.5 }
  },

  hexToRgba(hex, alpha) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  generateBoxShadow(x, y, blur, spread, colorHex, opacity, inset = false) {
    const rgba = this.hexToRgba(colorHex, opacity);
    const insetText = inset ? 'inset ' : '';
    const rule = `${insetText}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
    
    const cssCode = `/* CSS Box Shadow */
box-shadow: ${rule};
-webkit-box-shadow: ${rule};`;

    return { rule, cssCode };
  },

  generateGlassmorphism(blur, bgOpacity, borderOpacity, radius = 16) {
    const bg = `rgba(255, 255, 255, ${bgOpacity})`;
    const border = `1px solid rgba(255, 255, 255, ${borderOpacity})`;
    const shadow = `0 8px 32px 0 rgba(0, 0, 0, 0.37)`;

    const cssCode = `/* CSS Glassmorphism */
background: ${bg};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${radius}px;
border: ${border};
box-shadow: ${shadow};`;

    return {
      cssCode,
      styles: {
        background: bg,
        backdropFilter: `blur(${blur}px)`,
        webkitBackdropFilter: `blur(${blur}px)`,
        borderRadius: `${radius}px`,
        border: border,
        boxShadow: shadow
      }
    };
  }
};

window.CSS_GENERATOR = CSS_GENERATOR;
