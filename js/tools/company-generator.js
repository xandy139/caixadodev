/**
 * Ferramenta: Gerador de Empresas Fictícias (Dados Completos de PJ)
 * Razão Social, Nome Fantasia, CNPJ, Inscrição Estadual, CNAE, Endereço e Capital
 */

const COMPANY_GENERATOR = {
  segments: [
    { prefix: 'Tech', suffix: 'Soluções em Tecnologia Ltda', fantasy: 'Tech Solutions', cnae: '6201-5/01 - Desenvolvimento de programas de computador sob encomenda' },
    { prefix: 'Log', suffix: 'Transportes e Logística S.A.', fantasy: 'Log Brasil Express', cnae: '4930-2/02 - Transporte rodoviário de carga intermunicipal e interestadual' },
    { prefix: 'Bio', suffix: 'Produtos Farmacêuticos Ltda', fantasy: 'BioHealth Farma', cnae: '4644-3/01 - Comércio atacadista de medicamentos e drogas de uso humano' },
    { prefix: 'Alimentos', suffix: 'Distribuidora e Comércio de Alimentos Eireli', fantasy: 'Sabor & Cia Alimentos', cnae: '4639-7/01 - Comércio atacadista de produtos alimentícios em geral' },
    { prefix: 'Constru', suffix: 'Engenharia e Construções Civis Ltda', fantasy: 'Nova Era Engenharia', cnae: '4120-4/00 - Construção de edifícios' },
    { prefix: 'Digital', suffix: 'Agência de Publicidade e Mídia Ltda', fantasy: 'Pulse Digital Media', cnae: '7311-4/00 - Agências de publicidade' },
    { prefix: 'Solar', suffix: 'Energia Renovável e Sustentável S.A.', fantasy: 'Solaris Energia', cnae: '4321-5/00 - Instalação e manutenção elétrica e solar' }
  ],

  generateCompany(options = { state: 'SP', format: true }) {
    const seg = this.segments[Math.floor(Math.random() * this.segments.length)];
    const cnpj = window.CPF_CNPJ_TOOL ? window.CPF_CNPJ_TOOL.generateCNPJ(options.format) : '12.345.678/0001-90';

    // Inscrição Estadual (fictícia para o estado)
    const ieNum = String(Math.floor(Math.random() * 899999999) + 100000000);
    const ie = options.format ? `${ieNum.slice(0, 3)}.${ieNum.slice(3, 6)}.${ieNum.slice(6, 9)}` : ieNum;

    // Data de Fundação (entre 2 e 25 anos atrás)
    const yearsAgo = Math.floor(Math.random() * 23) + 2;
    const year = new Date().getFullYear() - yearsAgo;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const openingDate = `${day}/${month}/${year}`;

    // Capital Social (R$ 20.000 a R$ 2.500.000)
    const capitalVal = (Math.floor(Math.random() * 248) + 2) * 10000;
    const capitalSocial = `R$ ${capitalVal.toLocaleString('pt-BR')},00`;

    // Endereço Empresarial
    const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'DF'];
    const uf = options.state || ufs[Math.floor(Math.random() * ufs.length)];
    const street = 'Avenida Empresarial';
    const number = Math.floor(Math.random() * 1900) + 100;
    const complement = `Sala ${Math.floor(Math.random() * 12) + 1}0${Math.floor(Math.random() * 9) + 1}`;
    const cep = options.format ? '01310-100' : '01310100';

    const cleanName = seg.prefix.toLowerCase();
    const email = `contato@${cleanName}brasil.com.br`;
    const phone = options.format ? '(11) 3250-8400' : '1132508400';

    return {
      corporateName: `${seg.prefix} ${seg.suffix}`,
      fantasyName: seg.fantasy,
      cnpj,
      ie,
      cnae: seg.cnae,
      openingDate,
      capitalSocial,
      email,
      phone,
      address: `${street}, ${number} - ${complement}`,
      neighborhood: 'Distrito Industrial',
      city: uf === 'SP' ? 'São Paulo' : 'Capital',
      state: uf,
      cep
    };
  }
};

window.COMPANY_GENERATOR = COMPANY_GENERATOR;
