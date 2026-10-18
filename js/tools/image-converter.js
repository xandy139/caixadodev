/**
 * Ferramenta: Conversor e Compressor de Imagens Web (100% Client-Side)
 * Suporte a PNG, JPEG, WebP e AVIF com redimensionamento e controle de qualidade
 * Processamento local seguro via HTML5 Canvas e FileReader (sem envio a servidores)
 */

const IMAGE_CONVERTER = {
  SUPPORTED_FORMATS: {
    'image/webp': { ext: 'webp', name: 'WebP (Recomendado para Web & SEO)', mime: 'image/webp' },
    'image/jpeg': { ext: 'jpg', name: 'JPEG / JPG (Universal)', mime: 'image/jpeg' },
    'image/png': { ext: 'png', name: 'PNG (Sem perdas / Transparência)', mime: 'image/png' },
    'image/avif': { ext: 'avif', name: 'AVIF (Compressão de Última Geração)', mime: 'image/avif' }
  },

  formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Falha ao decodificar a imagem'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem'));
      reader.readAsDataURL(file);
    });
  },

  calculateDimensions(origWidth, origHeight, maxWidth, maxHeight) {
    let width = origWidth;
    let height = origHeight;

    if (maxWidth && width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    if (maxHeight && height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    return { width, height };
  },

  async convert(file, options = {}) {
    const {
      targetFormat = 'image/webp',
      quality = 0.85,
      maxWidth = null,
      maxHeight = null,
      keepMetadata = false
    } = options;

    const img = await this.loadImage(file);
    const { width, height } = this.calculateDimensions(img.naturalWidth, img.naturalHeight, maxWidth, maxHeight);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Se o formato de destino for JPEG e a imagem original tiver transparência, preenche fundo branco
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    // Desenho de alta qualidade com suavização bicúbica
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Falha ao gerar o blob de imagem'));
          return;
        }

        const formatInfo = this.SUPPORTED_FORMATS[targetFormat] || this.SUPPORTED_FORMATS['image/webp'];
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const newFileName = `${baseName}.${formatInfo.ext}`;
        const blobUrl = URL.createObjectURL(blob);

        const originalSize = file.size;
        const newSize = blob.size;
        const savingsPercent = originalSize > 0 
          ? Math.round(((originalSize - newSize) / originalSize) * 100) 
          : 0;

        resolve({
          blob,
          blobUrl,
          fileName: newFileName,
          mimeType: targetFormat,
          originalSize,
          newSize,
          savingsPercent,
          width,
          height,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight
        });
      }, targetFormat, quality);
    });
  }
};

if (typeof window !== 'undefined') {
  window.IMAGE_CONVERTER = IMAGE_CONVERTER;
}
