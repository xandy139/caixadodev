/**
 * Ferramenta: Gerador e Tradutor de Expressões Cron
 * Converte cron padrão (minuto, hora, dia, mês, dia_semana) para português claro
 * Calcula próximas 5 execuções e oferece construtor visual
 */

const CRON_TOOL = {
  PRESETS: {
    'every_5m': { exp: '*/5 * * * *', label: 'A cada 5 minutos' },
    'every_15m': { exp: '*/15 * * * *', label: 'A cada 15 minutos' },
    'every_1h': { exp: '0 * * * *', label: 'No início de cada hora' },
    'midnight': { exp: '0 0 * * *', label: 'Todo dia à meia-noite (00:00)' },
    'workdays_9am': { exp: '0 9 * * 1-5', label: 'Segunda a Sexta às 09:00' },
    'weekly_sun': { exp: '0 3 * * 0', label: 'Todo Domingo às 03:00 da manhã' },
    'monthly_first': { exp: '0 0 1 * *', label: 'No primeiro dia de cada mês' }
  },

  DAYS_OF_WEEK: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  MONTHS: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],

  explain(cronStr) {
    if (!cronStr) return 'Insira uma expressão cron (5 campos: min hora dia mês sem)';
    let parts = cronStr.trim().split(/\s+/);

    // Aliases comuns
    if (parts.length === 1) {
      const alias = parts[0].toLowerCase();
      if (alias === '@hourly') parts = ['0', '*', '*', '*', '*'];
      else if (alias === '@daily') parts = ['0', '0', '*', '*', '*'];
      else if (alias === '@weekly') parts = ['0', '0', '*', '*', '0'];
      else if (alias === '@monthly') parts = ['0', '0', '1', '*', '*'];
      else if (alias === '@yearly' || alias === '@annually') parts = ['0', '0', '1', '1', '*'];
    }

    if (parts.length !== 5) {
      return 'Expressão inválida. O formato padrão exige 5 campos separados por espaço: minuto hora dia mês dia_da_semana';
    }

    const [min, hour, dayOfMonth, month, dayOfWeek] = parts;

    let descMin = '';
    if (min === '*') descMin = 'a cada minuto';
    else if (min.startsWith('*/')) descMin = `a cada ${min.slice(2)} minutos`;
    else descMin = `no minuto ${min}`;

    let descHour = '';
    if (hour === '*') descHour = 'de todas as horas';
    else if (hour.startsWith('*/')) descHour = `a cada ${hour.slice(2)} horas`;
    else descHour = `às ${hour.padStart(2, '0')}:${min === '*' ? '00' : min.padStart(2, '0')}`;

    let descDay = '';
    if (dayOfMonth === '*') descDay = 'todos os dias';
    else if (dayOfMonth.startsWith('*/')) descDay = `a cada ${dayOfMonth.slice(2)} dias`;
    else descDay = `no dia ${dayOfMonth} do mês`;

    let descMonth = '';
    if (month === '*') descMonth = 'de cada mês';
    else if (month.startsWith('*/')) descMonth = `a cada ${month.slice(2)} meses`;
    else {
      const mIdx = parseInt(month, 10) - 1;
      descMonth = `em ${this.MONTHS[mIdx] || 'mês ' + month}`;
    }

    let descDow = '';
    if (dayOfWeek === '*') descDow = '';
    else if (dayOfWeek === '1-5') descDow = 'de segunda a sexta-feira';
    else if (dayOfWeek === '0,6' || dayOfWeek === '6,0') descDow = 'somente nos fins de semana';
    else {
      const dowIdx = parseInt(dayOfWeek, 10) % 7;
      descDow = `somente aos ${this.DAYS_OF_WEEK[dowIdx] || 'dias ' + dayOfWeek}`;
    }

    // Monta frase coerente
    if (min.startsWith('*/') && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `Executa continuamente a cada ${min.slice(2)} minutos, todos os dias.`;
    }
    if (min === '0' && hour.startsWith('*/') && dayOfMonth === '*' && month === '*') {
      return `Executa a cada ${hour.slice(2)} horas, no minuto zero.`;
    }
    if (hour !== '*' && !hour.startsWith('*/') && min !== '*' && !min.startsWith('*/')) {
      return `Executa às ${hour.padStart(2, '0')}:${min.padStart(2, '0')} (${descDay}${descDow ? ', ' + descDow : ''}, ${descMonth}).`;
    }

    return `Executa ${descMin}, ${descHour}, ${descDay}${descDow ? ' (' + descDow + ')' : ''}, ${descMonth}.`;
  },

  getNextExecutions(cronStr, count = 5) {
    const parts = (cronStr || '').trim().split(/\s+/);
    if (parts.length !== 5) return [];

    const now = new Date();
    const results = [];
    let current = new Date(now.getTime() + 60000); // Começa do próximo minuto

    // Simulação prática aproximada para visualização das próximas execuções
    for (let i = 0; i < 5000 && results.length < count; i++) {
      const min = current.getMinutes();
      const hour = current.getHours();
      const day = current.getDate();
      const month = current.getMonth() + 1;
      const dow = current.getDay();

      const matchMin = this.matchField(parts[0], min, 0, 59);
      const matchHour = this.matchField(parts[1], hour, 0, 23);
      const matchDay = this.matchField(parts[2], day, 1, 31);
      const matchMonth = this.matchField(parts[3], month, 1, 12);
      const matchDow = this.matchField(parts[4], dow, 0, 7);

      if (matchMin && matchHour && matchDay && matchMonth && matchDow) {
        results.push(new Date(current));
      }

      current = new Date(current.getTime() + 60000); // incrementa 1 min
    }

    return results;
  },

  matchField(field, val, minLimit, maxLimit) {
    if (field === '*') return true;
    if (field.startsWith('*/')) {
      const step = parseInt(field.slice(2), 10);
      return val % step === 0;
    }
    if (field.includes('-')) {
      const [start, end] = field.split('-').map(Number);
      return val >= start && val <= end;
    }
    if (field.includes(',')) {
      return field.split(',').map(Number).includes(val);
    }
    return parseInt(field, 10) === val;
  }
};

window.CRON_TOOL = CRON_TOOL;
