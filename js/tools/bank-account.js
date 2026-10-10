/**
 * Ferramenta: Gerador de Contas Bancárias para Testes
 * Gera agências e contas correntes com dígitos para os principais bancos brasileiros
 */

const BANK_ACCOUNT_TOOL = {
  banks: {
    bb: { code: '001', name: 'Banco do Brasil', agencyLen: 4, accountLen: 8 },
    bradesco: { code: '237', name: 'Bradesco', agencyLen: 4, accountLen: 7 },
    caixa: { code: '104', name: 'Caixa Econômica Federal', agencyLen: 4, accountLen: 8 },
    itau: { code: '341', name: 'Itaú Unibanco', agencyLen: 4, accountLen: 5 },
    santander: { code: '033', name: 'Santander', agencyLen: 4, accountLen: 8 },
    nubank: { code: '260', name: 'Nubank (Nu Pagamentos)', agencyLen: 4, accountLen: 7 },
    inter: { code: '077', name: 'Banco Inter', agencyLen: 4, accountLen: 7 }
  },

  getRandomDigits(len) {
    let res = '';
    for (let i = 0; i < len; i++) {
      res += Math.floor(Math.random() * 10);
    }
    return res;
  },

  generate(bankKey = 'bb', formatted = true) {
    const bank = this.banks[bankKey] || this.banks.bb;
    const agencyRaw = this.getRandomDigits(bank.agencyLen);
    const agencyDigit = Math.floor(Math.random() * 10);

    const accountRaw = this.getRandomDigits(bank.accountLen);
    const accountDigit = Math.floor(Math.random() * 10);

    return {
      bankCode: bank.code,
      bankName: bank.name,
      agency: formatted ? `${agencyRaw}-${agencyDigit}` : `${agencyRaw}${agencyDigit}`,
      account: formatted ? `${accountRaw}-${accountDigit}` : `${accountRaw}${accountDigit}`,
      fullDisplay: `Banco: ${bank.code} - ${bank.name} | Agência: ${agencyRaw}-${agencyDigit} | Conta: ${accountRaw}-${accountDigit}`
    };
  }
};

window.BANK_ACCOUNT_TOOL = BANK_ACCOUNT_TOOL;
