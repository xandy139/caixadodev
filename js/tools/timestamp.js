/**
 * Ferramenta: Conversor de Timestamp Unix (Epoch)
 * Conversão bidirecional: Epoch <> Data Legível (Horário de Brasília e UTC)
 */

const TIMESTAMP_TOOL = {
  // Epoch para Data Legível
  epochToDate(timestamp) {
    if (timestamp === undefined || timestamp === null || isNaN(Number(timestamp))) {
      return { success: false, error: 'Insira um valor numérico válido para o timestamp.' };
    }

    let ts = Number(timestamp);
    // Se tiver 10 dígitos (segundos), converter para ms
    if (String(Math.floor(ts)).length <= 10) {
      ts = ts * 1000;
    }

    const date = new Date(ts);
    if (isNaN(date.getTime())) {
      return { success: false, error: 'Timestamp fora do intervalo suportado por Date.' };
    }

    return {
      success: true,
      timestampSeconds: Math.floor(ts / 1000),
      timestampMilliseconds: ts,
      brasilia: date.toLocaleString('pt-BR', { 
        timeZone: 'America/Sao_Paulo', 
        dateStyle: 'full', 
        timeStyle: 'medium' 
      }),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: this.getRelativeTime(ts)
    };
  },

  // Data Legível para Epoch
  dateToEpoch(dateString) {
    if (!dateString) {
      return { success: false, error: 'Selecione uma data e hora válidas.' };
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { success: false, error: 'Formato de data inválido.' };
    }

    const ms = date.getTime();
    return {
      success: true,
      timestampSeconds: Math.floor(ms / 1000),
      timestampMilliseconds: ms,
      iso: date.toISOString(),
      brasilia: date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    };
  },

  getRelativeTime(timestampMs) {
    const now = Date.now();
    const diffSec = Math.floor((timestampMs - now) / 1000);

    const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.floor(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHours = Math.floor(diffMin / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    const diffDays = Math.floor(diffHours / 24);
    if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day');
    const diffMonths = Math.floor(diffDays / 30);
    if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, 'month');
    const diffYears = Math.floor(diffDays / 365);
    return rtf.format(diffYears, 'year');
  }
};

window.TIMESTAMP_TOOL = TIMESTAMP_TOOL;
