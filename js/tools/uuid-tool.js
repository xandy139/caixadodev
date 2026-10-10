/**
 * Ferramenta: Gerador de UUID / GUID v4
 * Utiliza crypto.randomUUID() criptograficamente seguro com fallback
 */

const UUID_TOOL = {
  generateSingle(uppercase = false, withHyphens = true) {
    let uuid;
    if (window.crypto && window.crypto.randomUUID) {
      uuid = window.crypto.randomUUID();
    } else {
      // Fallback RFC4122 v4
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    if (!withHyphens) {
      uuid = uuid.replace(/-/g, '');
    }

    return uppercase ? uuid.toUpperCase() : uuid.toLowerCase();
  },

  generateBatch(count = 5, uppercase = false, withHyphens = true) {
    const qty = Math.min(Math.max(1, parseInt(count) || 1), 100);
    const list = [];
    for (let i = 0; i < qty; i++) {
      list.push(this.generateSingle(uppercase, withHyphens));
    }
    return list;
  }
};

window.UUID_TOOL = UUID_TOOL;
