/**
 * Ferramenta: Gerador de Massa de Testes em Lote (Mock Data)
 * Gera registros fictícios estruturados em JSON, CSV ou comandos SQL INSERT
 */

const MOCK_DATA_TOOL = {
  NOMES: [
    'Lucas Silva', 'Mariana Santos', 'Gabriel Oliveira', 'Beatriz Souza', 'Rodrigo Lima',
    'Camila Pereira', 'Felipe Ferreira', 'Larissa Costa', 'Matheus Ribeiro', 'Juliana Almeida',
    'Thiago Carvalho', 'Amanda Rocha', 'Guilherme Dias', 'Fernanda Martins', 'Bruno Barbosa',
    'Letícia Ramos', 'Gustavo Castro', 'Bruna Monteiro', 'André Rezende', 'Rafaela Duarte'
  ],

  DOMINIOS: ['gmail.com', 'outlook.com', 'empresa.com.br', 'dev.com.br', 'techmail.io'],
  CIDADES: ['São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Curitiba - PR', 'Porto Alegre - RS', 'Salvador - BA', 'Brasília - DF', 'Recife - PE', 'Florianópolis - SC', 'Fortaleza - CE'],
  STATUS: ['Ativo', 'Pendente', 'Inativo', 'Cancelado'],

  generateBatch(count = 10, tableName = 'usuarios') {
    const qty = Math.min(Math.max(1, parseInt(count, 10) || 10), 200);
    const records = [];

    for (let i = 1; i <= qty; i++) {
      const nome = this.NOMES[Math.floor(Math.random() * this.NOMES.length)];
      const partes = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');
      const dominio = this.DOMINIOS[Math.floor(Math.random() * this.DOMINIOS.length)];
      const email = `${partes[0]}.${partes[1]}${i}@${dominio}`;

      // CPF gerado válido se a ferramenta estiver carregada
      let cpf = '000.000.000-00';
      if (window.CPF_CNPJ_TOOL) {
        cpf = window.CPF_CNPJ_TOOL.generateCPF(true);
      } else {
        cpf = `${String(Math.floor(100+Math.random()*899))}.${String(Math.floor(100+Math.random()*899))}.${String(Math.floor(100+Math.random()*899))}-01`;
      }

      const ddd = String(Math.floor(11 + Math.random() * 88));
      const tel = `(${ddd}) 9${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`;
      const cidade = this.CIDADES[Math.floor(Math.random() * this.CIDADES.length)];
      const status = this.STATUS[Math.floor(Math.random() * this.STATUS.length)];
      const saldo = (Math.random() * 5000 + 100).toFixed(2);
      
      const d = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
      const criadoEm = d.toISOString().split('T')[0];

      records.push({
        id: i,
        nome,
        email,
        cpf,
        telefone: tel,
        cidade,
        status,
        saldo: parseFloat(saldo),
        criado_em: criadoEm
      });
    }

    return {
      records,
      tableName: tableName || 'usuarios',
      toJSON() {
        return JSON.stringify(records, null, 2);
      },
      toCSV() {
        if (records.length === 0) return '';
        const headers = Object.keys(records[0]).join(',');
        const rows = records.map(r => Object.values(r).map(v => typeof v === 'string' ? `"${v}"` : v).join(','));
        return [headers, ...rows].join('\n');
      },
      toSQL() {
        if (records.length === 0) return '';
        const cols = Object.keys(records[0]).join(', ');
        const inserts = records.map(r => {
          const vals = Object.values(r).map(v => typeof v === 'number' ? v : `'${v}'`).join(', ');
          return `INSERT INTO ${tableName} (${cols}) VALUES (${vals});`;
        });
        return inserts.join('\n');
      }
    };
  }
};

window.MOCK_DATA_TOOL = MOCK_DATA_TOOL;
