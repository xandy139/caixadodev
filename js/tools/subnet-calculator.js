/**
 * Ferramenta: Calculadora de Sub-rede IP e CIDR
 * Calcula Máscara Decimal, Rede, Primeiro e Último Host, Broadcast e Quantidade de Hosts
 */

const SUBNET_CALCULATOR = {
  ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  },

  intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  },

  calculate(ipStr, cidrPrefix) {
    const cleanIp = ipStr.trim();
    const prefix = parseInt(cidrPrefix, 10);

    const isEn = document.documentElement.lang === 'en';

    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(cleanIp) || prefix < 0 || prefix > 32) {
      return { success: false, error: isEn ? 'Invalid IP address or CIDR prefix.' : 'Endereço IP ou máscara CIDR inválida.' };
    }

    const octets = cleanIp.split('.').map(Number);
    if (octets.some(o => o < 0 || o > 255)) {
      return { success: false, error: isEn ? 'IP octets must be between 0 and 255.' : 'Octetos do IP devem estar entre 0 e 255.' };
    }

    const ipInt = this.ipToInt(cleanIp);
    const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | ~maskInt) >>> 0;

    const netmask = this.intToIp(maskInt);
    const network = this.intToIp(netInt);
    const broadcast = this.intToIp(bcastInt);

    let firstHost = '';
    let lastHost = '';
    let usableHosts = 0;

    if (prefix === 31) {
      usableHosts = 2; // RFC 3021 (ponto-a-ponto)
      firstHost = network;
      lastHost = broadcast;
    } else if (prefix === 32) {
      usableHosts = 1;
      firstHost = network;
      lastHost = network;
    } else {
      usableHosts = Math.max(0, Math.pow(2, 32 - prefix) - 2);
      firstHost = this.intToIp((netInt + 1) >>> 0);
      lastHost = this.intToIp((bcastInt - 1) >>> 0);
    }

    const totalAddresses = Math.pow(2, 32 - prefix);
    const loc = isEn ? 'en-US' : 'pt-BR';

    return {
      success: true,
      cidr: `${network}/${prefix}`,
      netmask,
      network,
      broadcast,
      firstHost,
      lastHost,
      usableHosts: usableHosts.toLocaleString(loc),
      totalAddresses: totalAddresses.toLocaleString(loc),
      binaryMask: maskInt.toString(2).padStart(32, '0').match(/.{8}/g).join('.')
    };
  }
};

window.SUBNET_CALCULATOR = SUBNET_CALCULATOR;
