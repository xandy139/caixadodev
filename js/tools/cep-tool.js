/**
 * Ferramenta: Gerador e Buscador de CEP (Código de Endereçamento Postal)
 * Suporte a faixas oficiais dos Correios para os 27 estados e consulta ViaCEP com fallback offline
 */

const CEP_TOOL = {
  // Faixas oficiais de CEP por Estado (Correios)
  ESTADOS: {
    SP: { nome: 'São Paulo', min: 1000000, max: 19999999, capital: 'São Paulo' },
    RJ: { nome: 'Rio de Janeiro', min: 20000000, max: 28999999, capital: 'Rio de Janeiro' },
    ES: { nome: 'Espírito Santo', min: 29000000, max: 29999999, capital: 'Vitória' },
    MG: { nome: 'Minas Gerais', min: 30000000, max: 39999999, capital: 'Belo Horizonte' },
    BA: { nome: 'Bahia', min: 40000000, max: 48999999, capital: 'Salvador' },
    SE: { nome: 'Sergipe', min: 49000000, max: 49999999, capital: 'Aracaju' },
    PE: { nome: 'Pernambuco', min: 50000000, max: 56999999, capital: 'Recife' },
    AL: { nome: 'Alagoas', min: 57000000, max: 57999999, capital: 'Maceió' },
    PB: { nome: 'Paraíba', min: 58000000, max: 58999999, capital: 'João Pessoa' },
    RN: { nome: 'Rio Grande do Norte', min: 59000000, max: 59999999, capital: 'Natal' },
    CE: { nome: 'Ceará', min: 60000000, max: 63999999, capital: 'Fortaleza' },
    PI: { nome: 'Piauí', min: 64000000, max: 64999999, capital: 'Teresina' },
    MA: { nome: 'Maranhão', min: 65000000, max: 65999999, capital: 'São Luís' },
    PA: { nome: 'Pará', min: 66000000, max: 68899999, capital: 'Belém' },
    AP: { nome: 'Amapá', min: 68900000, max: 68999999, capital: 'Macapá' },
    AM: { nome: 'Amazonas', min: 69000000, max: 69299999, capital: 'Manaus' },
    RR: { nome: 'Roraima', min: 69300000, max: 69399999, capital: 'Boa Vista' },
    AC: { nome: 'Acre', min: 69900000, max: 69999999, capital: 'Rio Branco' },
    DF: { nome: 'Distrito Federal', min: 70000000, max: 72799999, capital: 'Brasília' },
    GO: { nome: 'Goiás', min: 72800000, max: 76799999, capital: 'Goiânia' },
    TO: { nome: 'Tocantins', min: 77000000, max: 77999999, capital: 'Palmas' },
    MT: { nome: 'Mato Grosso', min: 78000000, max: 78899999, capital: 'Cuiabá' },
    RO: { nome: 'Rondônia', min: 76800000, max: 76999999, capital: 'Porto Velho' },
    MS: { nome: 'Mato Grosso do Sul', min: 79000000, max: 79999999, capital: 'Campo Grande' },
    PR: { nome: 'Paraná', min: 80000000, max: 87999999, capital: 'Curitiba' },
    SC: { nome: 'Santa Catarina', min: 88000000, max: 89999999, capital: 'Florianópolis' },
    RS: { nome: 'Rio Grande do Sul', min: 90000000, max: 99999999, capital: 'Porto Alegre' }
  },

  // Gera CEP aleatório válido na faixa de um estado
  generate(uf = 'aleatorio', withMask = true) {
    let targetUf = uf;
    const ufs = Object.keys(this.ESTADOS);

    if (targetUf === 'aleatorio' || !this.ESTADOS[targetUf]) {
      targetUf = ufs[Math.floor(Math.random() * ufs.length)];
    }

    const info = this.ESTADOS[targetUf];
    const num = Math.floor(info.min + Math.random() * (info.max - info.min));
    const raw = String(num).padStart(8, '0');
    const formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;

    return {
      raw,
      formatted: withMask ? formatted : raw,
      uf: targetUf,
      estado: info.nome,
      capital: info.capital
    };
  },

  detectState(cepClean) {
    const num = parseInt(cepClean, 10);
    for (const [uf, info] of Object.entries(this.ESTADOS)) {
      if (num >= info.min && num <= info.max) {
        return { uf, nome: info.nome, capital: info.capital };
      }
    }
    return null;
  },

  async lookup(cepInput) {
    const clean = (cepInput || '').replace(/\D/g, '');
    if (clean.length !== 8) {
      return { success: false, message: 'O CEP deve conter exatamente 8 dígitos.' };
    }

    const stateInfo = this.detectState(clean);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
        signal: AbortSignal.timeout(3500)
      });
      const data = await response.json();

      if (data.erro) {
        return {
          success: false,
          offlineInfo: stateInfo,
          message: `CEP ${clean} não localizado na base do ViaCEP, mas pertence à faixa do estado ${stateInfo ? stateInfo.nome : 'desconhecido'}.`
        };
      }

      return {
        success: true,
        data: {
          cep: data.cep,
          logradouro: data.logradouro || 'Não informado',
          bairro: data.bairro || 'Centro / Geral',
          localidade: data.localidade,
          uf: data.uf,
          ibge: data.ibge,
          ddd: data.ddd
        }
      };
    } catch (err) {
      // Fallback offline caso esteja sem internet ou timeout
      return {
        success: true,
        isOfflineFallback: true,
        data: {
          cep: `${clean.slice(0, 5)}-${clean.slice(5)}`,
          logradouro: 'Consulta offline (Modo seguro)',
          bairro: 'Região estimada',
          localidade: stateInfo ? stateInfo.capital : 'Brasil',
          uf: stateInfo ? stateInfo.uf : 'BR',
          ibge: '-',
          ddd: '-'
        },
        message: 'Consulta realizada via base offline local de faixas postais.'
      };
    }
  }
};

window.CEP_TOOL = CEP_TOOL;
