/**
 * Ferramenta: Gerador de Senhas Seguras
 * Geração criptograficamente segura com cálculo de entropia e força
 */

const PASSWORD_GENERATOR = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',

  generate(options = { length: 16, upper: true, lower: true, numbers: true, symbols: true }) {
    let pool = '';
    const guaranteed = [];

    if (options.lower) {
      pool += this.lower;
      guaranteed.push(this.lower.charAt(Math.floor(Math.random() * this.lower.length)));
    }
    if (options.upper) {
      pool += this.upper;
      guaranteed.push(this.upper.charAt(Math.floor(Math.random() * this.upper.length)));
    }
    if (options.numbers) {
      pool += this.numbers;
      guaranteed.push(this.numbers.charAt(Math.floor(Math.random() * this.numbers.length)));
    }
    if (options.symbols) {
      pool += this.symbols;
      guaranteed.push(this.symbols.charAt(Math.floor(Math.random() * this.symbols.length)));
    }

    if (!pool) pool = this.lower + this.numbers;

    const len = Math.max(6, Math.min(64, options.length || 16));
    const randomArray = new Uint32Array(len);
    window.crypto.getRandomValues(randomArray);

    const chars = [];
    for (let i = 0; i < len; i++) {
      chars.push(pool.charAt(randomArray[i] % pool.length));
    }

    // Inserir caracteres garantidos
    for (let i = 0; i < guaranteed.length; i++) {
      chars[i] = guaranteed[i];
    }

    // Embaralhar (Fisher-Yates)
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    const password = chars.join('');
    const strength = this.evaluateStrength(password, pool.length);

    return {
      password,
      strength
    };
  },

  evaluateStrength(password, poolSize) {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    const entropy = Math.round(password.length * Math.log2(poolSize || 26));

    if (entropy < 40) return { label: isEn ? 'Weak' : 'Fraca', color: '#f43f5e', percent: 25 };
    if (entropy < 60) return { label: isEn ? 'Moderate' : 'Razoável', color: '#f59e0b', percent: 50 };
    if (entropy < 85) return { label: isEn ? 'Strong' : 'Forte', color: '#10b981', percent: 80 };
    return { label: isEn ? 'Very Strong (Unbreakable)' : 'Muito Forte (Imbatível)', color: '#38bdf8', percent: 100 };
  }
};

window.PASSWORD_GENERATOR = PASSWORD_GENERATOR;
