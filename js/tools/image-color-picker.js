/**
 * Caixa do Dev - Seletor de Cores de Imagem (Conta-Gotas e Extrator de Paleta)
 * 100% Client-Side via Canvas API, ImageData e EyeDropper API
 */

(function () {
  'use strict';

  // Detecção de idioma e dicionário i18n
  const isEn = (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const I18N = {
    pt: {
      black: 'Preto Profundo',
      white: 'Branco Puro',
      darkGray: 'Cinza Escuro',
      mediumGray: 'Cinza Médio',
      lightGray: 'Cinza Claro',
      red: 'Vermelho',
      orange: 'Laranja',
      yellow: 'Amarelo',
      green: 'Verde',
      cyan: 'Ciano / Turquesa',
      blue: 'Azul',
      purple: 'Roxo / Índigo',
      pink: 'Rosa / Magenta',
      colorful: 'Colorido',
      copiedClipboard: 'Copiado para a área de transferência!',
      copied: 'Copiado!',
      copiedHex: (hex) => `Copiado: ${hex}`,
      allHexCopied: 'Todos os códigos HEX copiados!',
      cssCopied: 'CSS Variables copiadas para a área de transferência!',
      jsonCopied: 'JSON da paleta copiado!',
      paletteCleared: 'Paleta limpa com sucesso.',
      noColorsCaptured: 'Nenhuma cor capturada ainda.',
      imgLoaded: 'Imagem carregada com sucesso!',
      imgPasted: 'Imagem colada da área de transferência!',
      invalidImage: 'Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP, SVG).',
      emptyPalette: 'Passe o mouse ou toque na imagem para capturar cores de pixels.',
      clickToCopy: 'Clique para copiar',
      manualCopy: 'Copie o código manualmente:'
    },
    en: {
      black: 'Deep Black',
      white: 'Pure White',
      darkGray: 'Dark Gray',
      mediumGray: 'Medium Gray',
      lightGray: 'Light Gray',
      red: 'Red',
      orange: 'Orange',
      yellow: 'Yellow',
      green: 'Green',
      cyan: 'Cyan / Teal',
      blue: 'Blue',
      purple: 'Purple / Indigo',
      pink: 'Pink / Magenta',
      colorful: 'Colorful',
      copiedClipboard: 'Copied to clipboard!',
      copied: 'Copied!',
      copiedHex: (hex) => `Copied: ${hex}`,
      allHexCopied: 'All HEX codes copied!',
      cssCopied: 'CSS Variables copied to clipboard!',
      jsonCopied: 'Palette JSON copied to clipboard!',
      paletteCleared: 'Palette cleared successfully.',
      noColorsCaptured: 'No colors captured yet.',
      imgLoaded: 'Image loaded successfully!',
      imgPasted: 'Image pasted from clipboard!',
      invalidImage: 'Please select a valid image file (PNG, JPG, WEBP, SVG).',
      emptyPalette: 'Hover or tap on the image to pick pixel colors.',
      clickToCopy: 'Click to copy',
      manualCopy: 'Copy code manually:'
    }
  };
  const t = isEn ? I18N.en : I18N.pt;

  // Estado da ferramenta
  const state = {
    img: null,
    canvas: null,
    ctx: null,
    loupeCanvas: null,
    loupeCtx: null,
    selectedColor: { r: 99, g: 102, b: 241, hex: '#6366F1' },
    hoverColor: null,
    zoomLevel: 1,
    imageWidth: 0,
    imageHeight: 0,
    capturedPalette: [],
    dominantPalette: [],
    maxPaletteItems: 24,
    loupeZoom: 9 // grade 9x9 pixels
  };

  // Cores de Presets para carregar instantaneamente
  const PRESETS = {
    ui: {
      name: 'Design System & UI Mockup',
      draw: function(ctx, w, h) {
        // Fundo escuro moderno
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Header / Navbar
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, 60);
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(36, 30, 16, 0, Math.PI * 2);
        ctx.fill();

        // Cards com gradientes e botões
        // Card 1: Roxo/Índigo
        const grad1 = ctx.createLinearGradient(40, 90, 240, 290);
        grad1.addColorStop(0, '#4f46e5');
        grad1.addColorStop(1, '#06b6d4');
        ctx.fillStyle = grad1;
        roundRect(ctx, 40, 90, 200, 180, 16);

        // Card 2: Esmeralda / Verde
        const grad2 = ctx.createLinearGradient(270, 90, 470, 290);
        grad2.addColorStop(0, '#10b981');
        grad2.addColorStop(1, '#3b82f6');
        ctx.fillStyle = grad2;
        roundRect(ctx, 270, 90, 200, 180, 16);

        // Card 3: Rose / Sunset
        const grad3 = ctx.createLinearGradient(500, 90, 700, 290);
        grad3.addColorStop(0, '#f43f5e');
        grad3.addColorStop(1, '#f59e0b');
        ctx.fillStyle = grad3;
        roundRect(ctx, 500, 90, 200, 180, 16);

        // Elementos de UI adicionais
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText('Primary Token', 60, 130);
        ctx.fillText('Success State', 290, 130);
        ctx.fillText('Alert Accent', 520, 130);

        // Badges e chips
        ctx.fillStyle = '#38bdf8';
        roundRect(ctx, 60, 155, 90, 28, 14);
        ctx.fillStyle = '#0f172a';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('CSS Cyan', 80, 174);

        ctx.fillStyle = '#34d399';
        roundRect(ctx, 290, 155, 100, 28, 14);
        ctx.fillStyle = '#064e3b';
        ctx.fillText('Emerald 400', 305, 174);

        ctx.fillStyle = '#fbbf24';
        roundRect(ctx, 520, 155, 90, 28, 14);
        ctx.fillStyle = '#78350f';
        ctx.fillText('Amber 400', 538, 174);

        // Rodapé de cards
        ctx.fillStyle = '#334155';
        roundRect(ctx, 40, 295, 660, 60, 12);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px monospace';
        ctx.fillText('Palette Tokens: #4F46E5 | #06B6D4 | #10B981 | #F43F5E | #F59E0B', 60, 330);
      }
    },
    sunset: {
      name: 'Paisagem Pôr do Sol',
      draw: function(ctx, w, h) {
        // Céu gradiente pôr do sol
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, '#1e1b4b');
        sky.addColorStop(0.3, '#581c87');
        sky.addColorStop(0.5, '#be185d');
        sky.addColorStop(0.7, '#ea580c');
        sky.addColorStop(0.9, '#facc15');
        sky.addColorStop(1, '#0284c7');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // Sol quente
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.65, 70, 0, Math.PI * 2);
        ctx.fill();

        // Montanhas silhueta
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * 0.72);
        ctx.lineTo(w * 0.25, h * 0.58);
        ctx.lineTo(w * 0.5, h * 0.75);
        ctx.lineTo(w * 0.75, h * 0.52);
        ctx.lineTo(w, h * 0.78);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }
    },
    neon: {
      name: 'Cyberpunk Neon',
      draw: function(ctx, w, h) {
        ctx.fillStyle = '#05050d';
        ctx.fillRect(0, 0, w, h);

        // Círculos de luz difusa neon
        drawGlow(ctx, w * 0.3, h * 0.4, 180, '#ec4899', '#3b0764');
        drawGlow(ctx, w * 0.7, h * 0.5, 200, '#06b6d4', '#082f49');
        drawGlow(ctx, w * 0.5, h * 0.75, 140, '#a855f7', '#1e1b4b');

        // Linhas de grade futuristas
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }
    }
  };

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawGlow(ctx, x, y, radius, innerColor, outerColor) {
    const radial = ctx.createRadialGradient(x, y, 0, x, y, radius);
    radial.addColorStop(0, innerColor);
    radial.addColorStop(1, outerColor);
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Utilitários de Cor
  function rgbToHex(r, g, b) {
    const toH = (n) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, '0').toUpperCase();
    return `#${toH(r)}${toH(g)}${toH(b)}`;
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
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
  }

  function rgbToCmyk(r, g, b) {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(lum1, lum2) {
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function getColorName(hex) {
    // Estimativa amigável de tonalidade
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const hsl = rgbToHsl(r, g, b);

    if (hsl.l < 10) return t.black;
    if (hsl.l > 92 && hsl.s < 10) return t.white;
    if (hsl.s < 12) {
      if (hsl.l < 35) return t.darkGray;
      if (hsl.l < 65) return t.mediumGray;
      return t.lightGray;
    }

    const h = hsl.h;
    if (h >= 345 || h < 15) return t.red;
    if (h >= 15 && h < 45) return t.orange;
    if (h >= 45 && h < 70) return t.yellow;
    if (h >= 70 && h < 160) return t.green;
    if (h >= 160 && h < 195) return t.cyan;
    if (h >= 195 && h < 255) return t.blue;
    if (h >= 255 && h < 290) return t.purple;
    if (h >= 290 && h < 345) return t.pink;
    return t.colorful;
  }

  // Inicialização no DOM
  function init() {
    state.canvas = document.getElementById('image-canvas');
    if (!state.canvas) return;
    state.ctx = state.canvas.getContext('2d', { willReadFrequently: true });

    state.loupeCanvas = document.getElementById('loupe-canvas');
    if (state.loupeCanvas) {
      state.loupeCtx = state.loupeCanvas.getContext('2d');
    }

    setupEventListeners();
    setupEyeDropper();
    loadStoredPalette();

    // Carregar preset padrão de UI para que o usuário já veja a ferramenta funcionando imediatamente
    loadPreset('ui');
  }

  function setupEyeDropper() {
    const eyeBtn = document.getElementById('btn-eyedropper-native');
    if (!eyeBtn) return;

    if ('EyeDropper' in window) {
      eyeBtn.style.display = 'inline-flex';
      eyeBtn.addEventListener('click', async () => {
        try {
          const eyeDropper = new window.EyeDropper();
          const result = await eyeDropper.open();
          if (result && result.sRGBHex) {
            applyHexColor(result.sRGBHex);
            showToast(`Cor capturada: ${result.sRGBHex}`);
          }
        } catch (e) {
          // Usuário cancelou ou pressionou ESC
        }
      });
    } else {
      eyeBtn.style.display = 'none';
    }
  }

  function setupEventListeners() {
    const fileInput = document.getElementById('image-file-input');
    const uploadBtn = document.getElementById('btn-upload-trigger');
    const dropZone = document.getElementById('canvas-drop-zone');
    const clearBtn = document.getElementById('btn-clear-palette');
    const copyAllHexBtn = document.getElementById('btn-copy-all-hex');
    const exportCssBtn = document.getElementById('btn-export-css');
    const exportJsonBtn = document.getElementById('btn-export-json');

    // Botão de upload
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
        }
      });
    }

    // Drag and Drop
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('drag-active');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('drag-active');
        }, false);
      });

      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          handleFile(dt.files[0]);
        }
      });
    }

    // Colar da área de transferência (Ctrl+V)
    window.addEventListener('paste', (e) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile();
          handleFile(blob);
          showToast(t.imgPasted);
          break;
        }
      }
    });

    // Interações no Canvas principal
    state.canvas.addEventListener('mousemove', onCanvasMouseMove);
    state.canvas.addEventListener('mouseleave', onCanvasMouseLeave);
    state.canvas.addEventListener('click', onCanvasClick);

    // Suporte a toque Mobile
    state.canvas.addEventListener('touchstart', onCanvasTouch, { passive: false });
    state.canvas.addEventListener('touchmove', onCanvasTouch, { passive: false });

    // Presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        loadPreset(presetKey);
      });
    });

    // Ações da paleta personalizada
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.capturedPalette = [];
        saveStoredPalette();
        renderCapturedPalette();
        showToast(t.paletteCleared);
      });
    }

    if (copyAllHexBtn) {
      copyAllHexBtn.addEventListener('click', () => {
        if (!state.capturedPalette.length) {
          showToast(t.noColorsCaptured);
          return;
        }
        const text = state.capturedPalette.map(c => c.hex).join(', ');
        copyText(text, t.allHexCopied);
      });
    }

    if (exportCssBtn) {
      exportCssBtn.addEventListener('click', () => {
        if (!state.capturedPalette.length) {
          showToast(t.noColorsCaptured);
          return;
        }
        let css = ':root {\n';
        state.capturedPalette.forEach((c, idx) => {
          css += `  --color-${idx + 1}: ${c.hex}; /* ${c.rgb} */\n`;
        });
        css += '}';
        copyText(css, t.cssCopied);
      });
    }

    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        if (!state.capturedPalette.length) {
          showToast(t.noColorsCaptured);
          return;
        }
        const json = JSON.stringify(state.capturedPalette, null, 2);
        copyText(json, t.jsonCopied);
      });
    }
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert(t.invalidImage);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.img = img;
        drawImageToCanvas(img);
        extractDominantColors();
        showToast(t.imgLoaded);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function loadPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    const w = 740;
    const h = 420;
    state.canvas.width = w;
    state.canvas.height = h;
    state.imageWidth = w;
    state.imageHeight = h;

    preset.draw(state.ctx, w, h);
    updateImageDimensionsLabel(w, h);
    extractDominantColors();

    // Seleciona um pixel representativo padrão
    selectPixelAt(140, 160);
  }

  function drawImageToCanvas(img) {
    state.imageWidth = img.naturalWidth || img.width;
    state.imageHeight = img.naturalHeight || img.height;

    state.canvas.width = state.imageWidth;
    state.canvas.height = state.imageHeight;

    state.ctx.clearRect(0, 0, state.imageWidth, state.imageHeight);
    state.ctx.drawImage(img, 0, 0);

    updateImageDimensionsLabel(state.imageWidth, state.imageHeight);

    // Selecionar o centro por padrão
    const midX = Math.floor(state.imageWidth / 2);
    const midY = Math.floor(state.imageHeight / 2);
    selectPixelAt(midX, midY);
  }

  function updateImageDimensionsLabel(w, h) {
    const label = document.getElementById('image-dimensions-badge');
    if (label) {
      label.textContent = `${w} × ${h} px`;
    }
  }

  // Coordenadas reais no Canvas considerando escala CSS
  function getCanvasCoords(e) {
    const rect = state.canvas.getBoundingClientRect();
    const scaleX = state.canvas.width / rect.width;
    const scaleY = state.canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    return {
      x: Math.max(0, Math.min(state.canvas.width - 1, x)),
      y: Math.max(0, Math.min(state.canvas.height - 1, y)),
      viewportX: clientX,
      viewportY: clientY
    };
  }

  function onCanvasMouseMove(e) {
    const coords = getCanvasCoords(e);
    updateLoupe(coords.x, coords.y, coords.viewportX, coords.viewportY);
  }

  function onCanvasMouseLeave() {
    const floatingLoupe = document.getElementById('floating-loupe-wrapper');
    if (floatingLoupe) floatingLoupe.style.display = 'none';
  }

  function onCanvasClick(e) {
    const coords = getCanvasCoords(e);
    selectPixelAt(coords.x, coords.y);
  }

  function onCanvasTouch(e) {
    e.preventDefault();
    const coords = getCanvasCoords(e);
    updateLoupe(coords.x, coords.y, coords.viewportX, coords.viewportY);
    selectPixelAt(coords.x, coords.y);
  }

  function selectPixelAt(x, y) {
    const pixel = state.ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = (pixel[3] / 255).toFixed(2);
    const hex = rgbToHex(r, g, b);

    applyColor({ r, g, b, a, hex, x, y });
    addToCapturedPalette({ r, g, b, hex });
  }

  function applyHexColor(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    applyColor({ r, g, b, a: 1, hex: hex.toUpperCase() });
    addToCapturedPalette({ r, g, b, hex: hex.toUpperCase() });
  }

  // Atualiza a Lupa com zoom ampliado dos pixels ao redor
  function updateLoupe(centerX, centerY, vX, vY) {
    const loupeWrapper = document.getElementById('floating-loupe-wrapper');
    const coordsLabel = document.getElementById('loupe-coords');
    const colorLabel = document.getElementById('loupe-hex');

    if (!state.loupeCtx || !loupeWrapper) return;

    // Tamanho da janela da lupa
    const sampleSize = 11; // 11x11 pixels ao redor
    const half = Math.floor(sampleSize / 2);
    const startX = Math.max(0, Math.min(state.canvas.width - sampleSize, centerX - half));
    const startY = Math.max(0, Math.min(state.canvas.height - sampleSize, centerY - half));

    // Captura fatia de imagem
    const imageData = state.ctx.getImageData(startX, startY, sampleSize, sampleSize);

    // Renderizar ampliado na loupeCanvas (110x110 px)
    const lW = state.loupeCanvas.width;
    const lH = state.loupeCanvas.height;
    const cellW = lW / sampleSize;
    const cellH = lH / sampleSize;

    state.loupeCtx.clearRect(0, 0, lW, lH);

    // Desenhar pixels individuais com grade
    for (let py = 0; py < sampleSize; py++) {
      for (let px = 0; px < sampleSize; px++) {
        const idx = (py * sampleSize + px) * 4;
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        const a = imageData.data[idx + 3] / 255;

        state.loupeCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        state.loupeCtx.fillRect(px * cellW, py * cellH, cellW, cellH);

        // Grade sutil
        state.loupeCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        state.loupeCtx.strokeRect(px * cellW, py * cellH, cellW, cellH);
      }
    }

    // Destacar o pixel central (mira)
    const centerIdx = (half * sampleSize + half) * 4;
    const cR = imageData.data[centerIdx];
    const cG = imageData.data[centerIdx + 1];
    const cB = imageData.data[centerIdx + 2];
    const currentHex = rgbToHex(cR, cG, cB);

    state.loupeCtx.lineWidth = 2;
    state.loupeCtx.strokeStyle = '#ffffff';
    state.loupeCtx.strokeRect(half * cellW, half * cellH, cellW, cellH);
    state.loupeCtx.strokeStyle = '#000000';
    state.loupeCtx.strokeRect(half * cellW - 1, half * cellH - 1, cellW + 2, cellH + 2);

    // Atualizar textos da lupa
    if (coordsLabel) coordsLabel.textContent = `X: ${centerX} Y: ${centerY}`;
    if (colorLabel) {
      colorLabel.textContent = currentHex;
      colorLabel.style.color = currentHex;
    }

    // Posicionar a lupa perto do cursor (evitando sair da tela)
    loupeWrapper.style.display = 'block';
    const offsetX = 24;
    const offsetY = 24;
    let posX = vX + offsetX;
    let posY = vY + offsetY;

    if (posX + 180 > window.innerWidth) posX = vX - 190;
    if (posY + 180 > window.innerHeight) posY = vY - 190;

    loupeWrapper.style.left = `${posX}px`;
    loupeWrapper.style.top = `${posY}px`;
  }

  // Aplica cor no painel do Inspetor
  function applyColor({ r, g, b, a, hex, x, y }) {
    state.selectedColor = { r, g, b, hex };

    const hsl = rgbToHsl(r, g, b);
    const cmyk = rgbToCmyk(r, g, b);
    const name = getColorName(hex);
    const lum = getLuminance(r, g, b);
    const contrastWhite = getContrastRatio(1, lum);
    const contrastBlack = getContrastRatio(lum, 0);

    // Atualizar elementos visuais
    const previewBox = document.getElementById('preview-selected-color');
    const colorNameEl = document.getElementById('selected-color-name');
    const hexInput = document.getElementById('input-color-hex');
    const rgbInput = document.getElementById('input-color-rgb');
    const hslInput = document.getElementById('input-color-hsl');
    const cmykInput = document.getElementById('input-color-cmyk');
    const cssVarInput = document.getElementById('input-color-cssvar');

    if (previewBox) {
      previewBox.style.backgroundColor = hex;
      previewBox.animate([
        { transform: 'scale(0.96)' },
        { transform: 'scale(1)' }
      ], { duration: 200, easing: 'ease-out' });
    }

    if (colorNameEl) {
      colorNameEl.textContent = name;
    }

    if (hexInput) hexInput.value = hex;
    if (rgbInput) rgbInput.value = `rgb(${r}, ${g}, ${b})`;
    if (hslInput) hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    if (cmykInput) cmykInput.value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    if (cssVarInput) cssVarInput.value = `--picked-color: ${hex};`;

    // Atualizar contraste WCAG
    updateWcagBadges(contrastWhite, contrastBlack);
  }

  function updateWcagBadges(ratioWhite, ratioBlack) {
    const whiteScore = document.getElementById('wcag-white-ratio');
    const whiteBadge = document.getElementById('wcag-white-badge');
    const blackScore = document.getElementById('wcag-black-ratio');
    const blackBadge = document.getElementById('wcag-black-badge');

    if (whiteScore && whiteBadge) {
      whiteScore.textContent = `${ratioWhite.toFixed(1)}:1`;
      if (ratioWhite >= 7) {
        whiteBadge.textContent = 'AAA Pass';
        whiteBadge.className = 'wcag-pill pass-aaa';
      } else if (ratioWhite >= 4.5) {
        whiteBadge.textContent = 'AA Pass';
        whiteBadge.className = 'wcag-pill pass-aa';
      } else if (ratioWhite >= 3) {
        whiteBadge.textContent = 'AA Large';
        whiteBadge.className = 'wcag-pill pass-aa-lg';
      } else {
        whiteBadge.textContent = 'Fail';
        whiteBadge.className = 'wcag-pill fail';
      }
    }

    if (blackScore && blackBadge) {
      blackScore.textContent = `${ratioBlack.toFixed(1)}:1`;
      if (ratioBlack >= 7) {
        blackBadge.textContent = 'AAA Pass';
        blackBadge.className = 'wcag-pill pass-aaa';
      } else if (ratioBlack >= 4.5) {
        blackBadge.textContent = 'AA Pass';
        blackBadge.className = 'wcag-pill pass-aa';
      } else if (ratioBlack >= 3) {
        blackBadge.textContent = 'AA Large';
        blackBadge.className = 'wcag-pill pass-aa-lg';
      } else {
        blackBadge.textContent = 'Fail';
        blackBadge.className = 'wcag-pill fail';
      }
    }
  }

  // Extração rápida de Paleta Dominante da Imagem via Amostragem e Quantização
  function extractDominantColors() {
    const w = state.canvas.width;
    const h = state.canvas.height;
    if (!w || !h) return;

    // Amostragem com salto (step) para desempenho instantâneo mesmo em 4K
    const step = Math.max(2, Math.floor(Math.sqrt((w * h) / 10000)));
    const imgData = state.ctx.getImageData(0, 0, w, h).data;
    const colorBins = {};
    let totalSamples = 0;

    // Quantização para cubos de cor (resolução 32 para agrupar tons similares)
    const factor = 24;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4;
        const a = imgData[idx + 3];
        if (a < 128) continue; // Ignora pixels transparentes

        const r = Math.round(imgData[idx] / factor) * factor;
        const g = Math.round(imgData[idx + 1] / factor) * factor;
        const b = Math.round(imgData[idx + 2] / factor) * factor;

        const key = `${r},${g},${b}`;
        colorBins[key] = (colorBins[key] || 0) + 1;
        totalSamples++;
      }
    }

    // Ordenar por frequência
    const sortedBins = Object.entries(colorBins)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8); // Top 8 cores dominantes

    state.dominantPalette = sortedBins.map(([rgbStr, count]) => {
      const [r, g, b] = rgbStr.split(',').map(Number);
      const hex = rgbToHex(r, g, b);
      const percentage = Math.max(1, Math.round((count / totalSamples) * 100));
      return { r, g, b, hex, percentage };
    });

    renderDominantPalette();
  }

  function renderDominantPalette() {
    const container = document.getElementById('dominant-palette-container');
    if (!container) return;

    container.innerHTML = '';
    if (!state.dominantPalette.length) {
      container.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">Nenhuma imagem processada.</span>';
      return;
    }

    state.dominantPalette.forEach(item => {
      const swatch = document.createElement('div');
      swatch.className = 'dominant-swatch-item';
      swatch.title = `Clique para selecionar ${item.hex} (~${item.percentage}%)`;
      swatch.innerHTML = `
        <div class="swatch-color" style="background-color: ${item.hex};"></div>
        <div class="swatch-info">
          <span class="swatch-hex">${item.hex}</span>
          <span class="swatch-pct">${item.percentage}%</span>
        </div>
      `;
      swatch.addEventListener('click', () => {
        applyHexColor(item.hex);
        showToast(`Cor da paleta selecionada: ${item.hex}`);
      });
      container.appendChild(swatch);
    });
  }

  // Paleta de Cores Capturadas pelo Usuário (Histórico)
  function addToCapturedPalette(colorObj) {
    // Evitar duplicadas consecutivas
    if (state.capturedPalette.length && state.capturedPalette[0].hex === colorObj.hex) {
      return;
    }

    // Inserir no início
    state.capturedPalette.unshift(colorObj);
    if (state.capturedPalette.length > state.maxPaletteItems) {
      state.capturedPalette.pop();
    }

    saveStoredPalette();
    renderCapturedPalette();
  }

  function renderCapturedPalette() {
    const container = document.getElementById('captured-palette-container');
    const countBadge = document.getElementById('captured-palette-count');
    if (!container) return;

    container.innerHTML = '';
    if (countBadge) countBadge.textContent = state.capturedPalette.length;

    if (!state.capturedPalette.length) {
      container.innerHTML = `
        <div class="empty-palette-state">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${t.emptyPalette}</span>
        </div>`;
      return;
    }

    state.capturedPalette.forEach((item, index) => {
      const swatch = document.createElement('div');
      swatch.className = 'captured-swatch-item';
      swatch.title = `${item.hex} - ${t.clickToCopy}`;
      swatch.innerHTML = `
        <div class="swatch-box" style="background-color: ${item.hex};"></div>
        <span class="swatch-label">${item.hex}</span>
      `;
      swatch.addEventListener('click', () => {
        copyText(item.hex, t.copiedHex(item.hex));
        applyHexColor(item.hex);
      });
      container.appendChild(swatch);
    });
  }

  function saveStoredPalette() {
    try {
      localStorage.setItem('caixadodev_image_palette', JSON.stringify(state.capturedPalette));
    } catch (e) {}
  }

  function loadStoredPalette() {
    try {
      const raw = localStorage.getItem('caixadodev_image_palette');
      if (raw) {
        state.capturedPalette = JSON.parse(raw) || [];
        renderCapturedPalette();
      }
    } catch (e) {}
  }

  // Toast e Copiar
  function showToast(msg) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }

  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || t.copiedClipboard);
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || t.copied);
    } catch (e) {
      prompt(t.manualCopy, text);
    }
    document.body.removeChild(ta);
  }

  window.copyText = copyText;

  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
