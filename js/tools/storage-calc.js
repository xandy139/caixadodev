/**
 * Ferramenta: Conversor de Unidades de Armazenamento e Calculadora de Transferência
 * Suporte a base decimal (SI 1000) e binária (IEC 1024), além de tempo de download/upload
 */

const STORAGE_CALC = {
  // Converte a partir de um valor e unidade de entrada para todas as outras
  convert(val, fromUnit = 'MB') {
    const v = Number(val) || 0;
    
    // Fatores de conversão em Bytes
    const multipliers = {
      'B': 1,
      'KB': 1e3,
      'MB': 1e6,
      'GB': 1e9,
      'TB': 1e12,
      'PB': 1e15,
      'KiB': 1024,
      'MiB': Math.pow(1024, 2),
      'GiB': Math.pow(1024, 3),
      'TiB': Math.pow(1024, 4),
      'PiB': Math.pow(1024, 5)
    };

    const bytes = v * (multipliers[fromUnit] || 1);
    const bits = bytes * 8;

    return {
      bytes,
      bits,
      // Padrão Decimal (1000)
      KB: bytes / 1e3,
      MB: bytes / 1e6,
      GB: bytes / 1e9,
      TB: bytes / 1e12,
      PB: bytes / 1e15,
      // Padrão Binário (1024)
      KiB: bytes / 1024,
      MiB: bytes / Math.pow(1024, 2),
      GiB: bytes / Math.pow(1024, 3),
      TiB: bytes / Math.pow(1024, 4),
      PiB: bytes / Math.pow(1024, 5)
    };
  },

  // Calcula tempo de transferência
  calculateTransferTime(sizeVal, sizeUnit = 'GB', speedMbps = 100) {
    const converted = this.convert(sizeVal, sizeUnit);
    const speedBitsPerSec = (Number(speedMbps) || 1) * 1e6;

    const totalSeconds = converted.bits / speedBitsPerSec;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let formatted = '';
    if (hours > 0) formatted += `${hours}h `;
    if (minutes > 0 || hours > 0) formatted += `${minutes}m `;
    formatted += `${seconds}s`;

    return {
      totalSeconds,
      formatted: formatted.trim() || '< 1s',
      hours,
      minutes,
      seconds
    };
  }
};

window.STORAGE_CALC = STORAGE_CALC;
