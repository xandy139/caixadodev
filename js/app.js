/**
 * Caixa do Dev - Main Application Controller
 * Roteamento por hash, busca rápida (Ctrl+K), catálogo de 27 ferramentas e eventos
 */

// Catálogo Oficial de 40 Ferramentas - Ordenado por Frequência de Uso e Volume de Busca no Brasil
const TOOLS_CATALOG = [
  // ==========================================
  // TIER 1: AS MAIS UTILIZADAS NO DIA A DIA (TOP 12)
  // ==========================================
  {
    id: 'cpf-cnpj',
    name: 'Gerador e Validador de CPF / CNPJ',
    category: 'geradores',
    categoryLabel: 'Documentos & Fiscais',
    desc: 'Gere e valide números de CPF e CNPJ com algoritmo oficial Módulo 11, pontuação e detecção de Região Fiscal.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    color: 'var(--accent-primary)',
    badge: '🔥 #1 Mais Buscado',
    isPopular: true
  },
  {
    id: 'pessoas',
    name: 'Gerador de Pessoas (Dados Fictícios Completos)',
    category: 'geradores',
    categoryLabel: 'Massa de Testes',
    desc: 'Gere cadastros brasileiros completos para testes: Nome, CPF, RG, Idade, Data, Sexo, Sangue, E-mail, Celular e Endereço.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    color: 'var(--accent-primary)',
    badge: '⭐ #2 Mais Usado',
    isPopular: true
  },
  {
    id: 'json',
    name: 'Formatador e Validador de JSON',
    category: 'formatadores',
    categoryLabel: 'Código & APIs',
    desc: 'Formate, indente (2 ou 4 espaços), minifique e detecte erros de sintaxe em códigos JSON com estatísticas em tempo real.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: '⚡ Diário',
    isPopular: true
  },
  {
    id: 'json-ts',
    name: 'Conversor JSON para TypeScript',
    category: 'formatadores',
    categoryLabel: 'TypeScript & Frontend',
    desc: 'Cole qualquer retorno JSON de API e gere automaticamente interfaces e types tipados em TypeScript.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: '💎 TypeScript',
    isPopular: true
  },
  {
    id: 'clt-pj',
    name: 'Calculadora Comparativa CLT vs PJ',
    category: 'conversores',
    categoryLabel: 'Carreira Dev BR',
    desc: 'Descubra quanto cobrar como PJ ou compare propostas com tabelas de INSS progressivo, IRPF, FGTS, 13º e Simples Nacional (Fator R).',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    color: 'var(--accent-emerald)',
    badge: '💰 Carreira Dev',
    isPopular: true
  },
  {
    id: 'sql',
    name: 'Formatador e Minificador de SQL',
    category: 'formatadores',
    categoryLabel: 'Banco de Dados',
    desc: 'Embeleze e organize queries SQL complexas (SELECT, JOINs, subqueries) ou comprima em uma única linha.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    color: 'var(--accent-emerald)',
    badge: '🗄️ SQL',
    isPopular: true
  },
  {
    id: 'curl',
    name: 'Conversor de cURL (Fetch, Axios, Python, PHP)',
    category: 'formatadores',
    categoryLabel: 'APIs & HTTP',
    desc: 'Cole comandos cURL de documentações e converta imediatamente para JavaScript fetch, Axios, Python requests ou PHP.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    color: 'var(--accent-emerald)',
    badge: '🌐 APIs',
    isPopular: true
  },
  {
    id: 'regex',
    name: 'Testador de Regex (Expressões Regulares)',
    category: 'formatadores',
    categoryLabel: 'Expressões Regulares',
    desc: 'Teste padrões Regex com highlight visual de correspondências em tempo real e presets de e-mail, CPF e URL.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    color: 'var(--accent-purple)',
    badge: '🔍 Regex',
    isPopular: true
  },
  {
    id: 'cartao',
    name: 'Gerador e Validador de Cartão de Crédito',
    category: 'geradores',
    categoryLabel: 'Financeiro & E-commerce',
    desc: 'Gere números válidos para testes de checkout com algoritmo de Luhn (Visa, Mastercard, Amex, Elo, Hipercard) e CVV.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    color: 'var(--accent-rose)',
    badge: '💳 Checkout',
    isPopular: true
  },
  {
    id: 'cron',
    name: 'Gerador e Tradutor de Cron Expression',
    category: 'formatadores',
    categoryLabel: 'DevOps & Schedulers',
    desc: 'Traduza expressões cron para português claro, gere agendamentos comuns e veja as próximas 5 execuções calculadas.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: '⏰ DevOps',
    isPopular: true
  },
  {
    id: 'empresa',
    name: 'Gerador de Empresa (PJ Completa)',
    category: 'geradores',
    categoryLabel: 'Massa de Testes',
    desc: 'Gere dados empresariais com Razão Social, Nome Fantasia, CNPJ, Inscrição Estadual (IE), CNAE e Capital Social.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: '🏢 Empresas',
    isPopular: true
  },
  {
    id: 'mock-data',
    name: 'Gerador de Massa de Testes em Lote (Mock Data)',
    category: 'geradores',
    categoryLabel: 'Massa de Testes',
    desc: 'Gere centenas de registros fictícios estruturados de usuários e exporte em JSON, CSV para Excel ou SQL INSERT.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: '📊 Massa em Lote',
    isPopular: true
  },

  // ==========================================
  // TIER 2: UTILIDADES FREQUENTES & DESENVOLVIMENTO
  // ==========================================
  {
    id: 'markdown',
    name: 'Editor e Visualizador de Markdown',
    category: 'formatadores',
    categoryLabel: 'Documentação & Docs',
    desc: 'Escreva e pré-visualize Markdown com suporte a tabelas GFM, blocos de código e tarefas com conversão para HTML.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    color: 'var(--accent-purple)',
    badge: '📝 GFM Live'
  },
  {
    id: 'diff',
    name: 'Comparador de Arquivos e Textos (Diff)',
    category: 'formatadores',
    categoryLabel: 'Produtividade',
    desc: 'Compare dois textos ou códigos fonte linha a linha e visualize inserções, deleções e alterações.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: 'Diff Checker'
  },
  {
    id: 'jwt',
    name: 'Decodificador de JWT (JSON Web Token)',
    category: 'seguranca',
    categoryLabel: 'Segurança & Auth',
    desc: 'Decodifique cabeçalho (Header) e dados (Payload) de tokens JWT em tempo real, sem enviar dados a servidores.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    color: 'var(--accent-purple)',
    badge: 'Privado & Seguro'
  },
  {
    id: 'hashes',
    name: 'Gerador de Hashes (MD5, SHA-256, SHA-512)',
    category: 'seguranca',
    categoryLabel: 'Criptografia',
    desc: 'Calcule instantaneamente os hashes MD5, SHA-1, SHA-256 e SHA-512 de qualquer texto via Web Crypto API nativa.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    color: 'var(--accent-rose)',
    badge: 'Web Crypto'
  },
  {
    id: 'base64',
    name: 'Codificador e Decodificador Base64 & URL',
    category: 'conversores',
    categoryLabel: 'Conversores',
    desc: 'Codifique e decodifique textos e strings para Base64 (suporte a UTF-8) e codificação de URL.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    color: 'var(--accent-rose)',
    badge: 'UTF-8'
  },
  {
    id: 'uuid',
    name: 'Gerador de UUID / GUID v4',
    category: 'geradores',
    categoryLabel: 'Geradores',
    desc: 'Crie identificadores únicos universais (UUID v4) criptograficamente seguros individualmente ou em lote.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: 'Cripto Seguro'
  },
  {
    id: 'cep',
    name: 'Gerador e Buscador de CEP',
    category: 'geradores',
    categoryLabel: 'Endereços & Correios',
    desc: 'Gere CEPs válidos por UF a partir de faixas oficiais dos Correios e consulte endereços em tempo real com ViaCEP.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    color: 'var(--accent-amber)',
    badge: 'ViaCEP'
  },
  {
    id: 'rg',
    name: 'Gerador e Validador de RG',
    category: 'geradores',
    categoryLabel: 'Documentos',
    desc: 'Gere e valide números de Registro Geral (RG) padrão SSP-SP e outros estados com cálculo de dígito verificador.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><line x1="15" y1="8" x2="17" y2="8"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: 'SSP Brasil'
  },
  {
    id: 'bancos',
    name: 'Gerador de Conta Bancária para Testes',
    category: 'geradores',
    categoryLabel: 'Financeiro',
    desc: 'Gere números válidos de agência e conta corrente para BB, Bradesco, Caixa, Itaú, Santander, Nubank e Inter.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    color: 'var(--accent-emerald)',
    badge: 'Fintech'
  },

  // ==========================================
  // TIER 3: DESIGN, FRONTEND & DEVOPS
  // ==========================================
  {
    id: 'css-generator',
    name: 'Gerador de Box-Shadow & Glassmorphism CSS',
    category: 'conversores',
    categoryLabel: 'Design & CSS',
    desc: 'Ajuste sombras, desfoques e efeito vidro fosco com sliders interativos e copie o código CSS moderno pronto.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
    color: 'var(--accent-rose)',
    badge: 'Visual CSS'
  },
  {
    id: 'code-beautifier',
    name: 'Formatador e Minificador de HTML & CSS',
    category: 'formatadores',
    categoryLabel: 'Web & Frontend',
    desc: 'Indente e organize código HTML e CSS com 2 ou 4 espaços ou comprima em uma linha para carregamento ultrarrápido.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    color: 'var(--accent-primary)',
    badge: 'Minificador'
  },
  {
    id: 'url-parser',
    name: 'Inspetor e Construtor de URL / Query Params',
    category: 'formatadores',
    categoryLabel: 'Web & URLs',
    desc: 'Decomponha URLs em protocolo, host, caminho e edite query parameters (?chave=valor) com encode/decode.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: 'Query Params'
  },
  {
    id: 'timestamp',
    name: 'Conversor de Timestamp Unix (Epoch)',
    category: 'conversores',
    categoryLabel: 'Conversores',
    desc: 'Converta segundos e milissegundos Unix para horário de Brasília (GMT-3) e UTC, e vice-versa.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: 'Tempo Real'
  },
  {
    id: 'json-csv',
    name: 'Conversor JSON <> CSV',
    category: 'conversores',
    categoryLabel: 'Dados & Planilhas',
    desc: 'Converta arrays JSON para formato de tabela CSV para Excel e transforme arquivos CSV de volta para JSON.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/></svg>`,
    color: 'var(--accent-amber)',
    badge: 'Planilhas'
  },
  {
    id: 'storage',
    name: 'Conversor de Armazenamento & Tempo de Download',
    category: 'conversores',
    categoryLabel: 'Infra & Redes',
    desc: 'Converta entre Bytes, KB, MB, GB, TB, KiB, GiB e calcule tempo exato de transferência por velocidade de banda (Mbps/Gbps).',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
    color: 'var(--accent-amber)',
    badge: 'Download Calc'
  },
  {
    id: 'cnh',
    name: 'Gerador e Validador de CNH',
    category: 'geradores',
    categoryLabel: 'Documentos',
    desc: 'Gere e valide números de Carteira Nacional de Habilitação com cálculo oficial dos dois dígitos verificadores.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="10.5" r="2.5"/><line x1="14" y1="9" x2="18" y2="9"/><line x1="14" y1="13" x2="18" y2="13"/></svg>`,
    color: 'var(--accent-emerald)',
    badge: 'Detran'
  },
  {
    id: 'subnet',
    name: 'Calculadora de Sub-rede IP / CIDR',
    category: 'conversores',
    categoryLabel: 'Redes & DevOps',
    desc: 'Calcule máscara de sub-rede, IP de rede, primeiro/último host útil, broadcast e total de IPs a partir do CIDR.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    color: 'var(--accent-cyan)',
    badge: 'DevOps'
  },
  {
    id: 'http-status',
    name: 'Catálogo de Códigos de Status HTTP',
    category: 'conversores',
    categoryLabel: 'Web & APIs',
    desc: 'Consulte o significado e boas práticas de uso de todos os códigos HTTP (200, 201, 400, 401, 404, 500) em APIs REST.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    color: 'var(--accent-emerald)',
    badge: 'Guia REST'
  },
  {
    id: 'color',
    name: 'Conversor de Cores (HEX, RGB, HSL)',
    category: 'conversores',
    categoryLabel: 'Design & Cores',
    desc: 'Converta códigos de cores entre HEX, RGB, RGBA e HSL com seletor visual e análise de contraste WCAG.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>`,
    color: 'var(--accent-rose)',
    badge: 'Design Tokens'
  },
  {
    id: 'svg',
    name: 'Otimizador de SVG & Gerador de Data URI para CSS',
    category: 'conversores',
    categoryLabel: 'Design & SVGs',
    desc: 'Minifique vetores SVG e gere background-image: url("data:image/svg+xml...") pronto para incorporar em folhas de estilo.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    color: 'var(--accent-purple)',
    badge: 'SVG to CSS'
  },
  {
    id: 'senhas',
    name: 'Gerador de Senhas Seguras & Entropia',
    category: 'geradores',
    categoryLabel: 'Segurança',
    desc: 'Crie senhas fortes e aleatórias de 8 a 64 caracteres com medidor visual de força e cálculo de bits de entropia.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    color: 'var(--accent-purple)',
    badge: 'Segurança'
  },
  {
    id: 'case',
    name: 'Conversor de Formato de Texto (Case)',
    category: 'conversores',
    categoryLabel: 'Conversores',
    desc: 'Converta strings instantaneamente entre camelCase, PascalCase, snake_case, kebab-case e CONSTANT_CASE.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
    color: 'var(--accent-amber)',
    badge: 'Refatoração'
  },
  {
    id: 'qrcode',
    name: 'Gerador de QR Code',
    category: 'conversores',
    categoryLabel: 'Utilitários',
    desc: 'Crie imagens de QR Code em alta definição a partir de textos, URLs ou chaves Pix com download PNG.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    color: 'var(--accent-primary)',
    badge: 'Download'
  },

  // ==========================================
  // TIER 4: DOCUMENTOS ESPECÍFICOS & TESTES
  // ==========================================
  {
    id: 'veiculos',
    name: 'Gerador de Placa de Veículo & RENAVAM',
    category: 'geradores',
    categoryLabel: 'Veicular',
    desc: 'Gere placas no padrão Mercosul (BRA2E19), tradicional (ABC-1234) e números de RENAVAM válidos com Módulo 11.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="22" height="13" rx="2" ry="2"/><polyline points="4 21 8 16 16 16 20 21"/></svg>`,
    color: 'var(--accent-amber)',
    badge: 'Detran'
  },
  {
    id: 'certidao',
    name: 'Gerador de Certidão (Nascimento, Casamento, Óbito)',
    category: 'geradores',
    categoryLabel: 'Cartórios CNJ',
    desc: 'Gere números de certidões civis no padrão unificado do CNJ (32 dígitos) com cálculo de 2 dígitos verificadores (Módulo 11).',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`,
    color: 'var(--accent-emerald)',
    badge: 'Oficial CNJ'
  },
  {
    id: 'pis',
    name: 'Gerador e Validador de PIS / PASEP',
    category: 'geradores',
    categoryLabel: 'Documentos',
    desc: 'Gere e valide números de PIS/PASEP/NIT de 11 dígitos com cálculo Módulo 11 para testes de folha de pagamento.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    color: 'var(--accent-amber)',
    badge: 'RH & DP'
  },
  {
    id: 'titulo',
    name: 'Gerador e Validador de Título de Eleitor',
    category: 'geradores',
    categoryLabel: 'Documentos',
    desc: 'Gere e valide títulos de eleitor com código da Unidade Federativa (UF) e dígitos verificadores do TSE.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    color: 'var(--accent-rose)',
    badge: 'TSE'
  },
  {
    id: 'texto',
    name: 'Gerador de Lorem Ipsum & Contador de Texto',
    category: 'formatadores',
    categoryLabel: 'Texto & SEO',
    desc: 'Gere parágrafos de texto Lorem Ipsum e conte caracteres, palavras, linhas e tempo de leitura em tempo real.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    color: 'var(--accent-primary)',
    badge: 'Utilitário'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initSearchModal();
  initToolsHub();
  initToolEvents();
  initFAQ();
  initCookieConsent();
});

// ========================
// ROTEAMENTO POR HASH
// ========================
function initRouter() {
  const handleRoute = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    const hubView = document.getElementById('hub-view');
    const toolViews = document.querySelectorAll('.tool-view');

    if (hash === 'home') {
      if (hubView) hubView.style.display = 'block';
      toolViews.forEach(v => v.classList.remove('active'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (hubView) hubView.style.display = 'none';
      toolViews.forEach(v => v.classList.remove('active'));
      const activeToolView = document.getElementById(`view-${hash}`);
      if (activeToolView) {
        activeToolView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.hash = '#home';
      }
    }
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

// ========================
// RENDERIZAÇÃO DO HUB
// ========================
function initToolsHub() {
  const grid = document.getElementById('tools-grid');
  if (!grid) return;

  function renderTools(filterCategory = 'all') {
    grid.innerHTML = '';
    const filtered = filterCategory === 'all' 
      ? TOOLS_CATALOG 
      : filterCategory === 'populares'
        ? TOOLS_CATALOG.filter(t => t.isPopular)
        : TOOLS_CATALOG.filter(t => t.category === filterCategory);

    filtered.forEach(tool => {
      const card = document.createElement('a');
      card.href = `#${tool.id}`;
      card.className = 'tool-card';
      card.innerHTML = `
        <div class="tool-card-header">
          <div class="tool-card-icon" style="background: ${tool.color};">
            ${tool.icon}
          </div>
          <span class="tool-card-badge">${tool.badge}</span>
        </div>
        <h3>${tool.name}</h3>
        <p>${tool.desc}</p>
        <div class="tool-card-footer">
          <span>${tool.categoryLabel}</span>
          <span class="tool-card-action">Abrir Ferramenta &rarr;</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderTools();

  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTools(btn.dataset.category);
    });
  });
}

// ========================
// MODAL DE BUSCA (CTRL+K)
// ========================
function initSearchModal() {
  const trigger = document.getElementById('search-trigger');
  const modalOverlay = document.getElementById('search-modal-overlay');
  const searchInput = document.getElementById('modal-search-input');
  const resultsContainer = document.getElementById('modal-results');

  if (!modalOverlay || !searchInput) return;

  const openModal = () => {
    modalOverlay.classList.add('open');
    searchInput.value = '';
    renderModalResults('');
    setTimeout(() => searchInput.focus(), 50);
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
  };

  if (trigger) trigger.addEventListener('click', openModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modalOverlay.classList.contains('open') ? closeModal() : openModal();
    }
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  function renderModalResults(query) {
    const q = query.toLowerCase().trim();
    const filtered = TOOLS_CATALOG.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          Nenhuma ferramenta encontrada para "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map((t, idx) => `
      <a href="#${t.id}" class="modal-result-item ${idx === 0 ? 'selected' : ''}" onclick="document.getElementById('search-modal-overlay').classList.remove('open')">
        <div class="modal-result-info">
          <span class="modal-result-title">${t.name}</span>
          <span class="modal-result-desc">${t.desc}</span>
        </div>
        <span class="tool-card-badge">${t.categoryLabel}</span>
      </a>
    `).join('');
  }

  searchInput.addEventListener('input', (e) => {
    renderModalResults(e.target.value);
  });
}

// ========================
// EVENTOS DE TODAS AS FERRAMENTAS
// ========================
function initToolEvents() {
  // 1. GERADOR DE PESSOAS (4DEVS)
  const btnGenPerson = document.getElementById('btn-gen-person');
  const selPersonGender = document.getElementById('sel-person-gender');
  const selPersonState = document.getElementById('sel-person-state');
  const checkPersonFormat = document.getElementById('check-person-format');
  const btnCopyAllPerson = document.getElementById('btn-copy-all-person');

  const updatePersonUI = () => {
    if (!window.PERSON_GENERATOR) return;
    const gender = selPersonGender ? selPersonGender.value : 'all';
    const state = selPersonState ? selPersonState.value : 'SP';
    const format = checkPersonFormat ? checkPersonFormat.checked : true;
    const p = PERSON_GENERATOR.generatePerson({ gender, state, format });

    setField('pf-name', p.name);
    setField('pf-gender', p.gender);
    setField('pf-age', p.age);
    setField('pf-birth', p.birthDate);
    setField('pf-cpf', p.cpf);
    setField('pf-rg', p.rg);
    setField('pf-email', p.email);
    setField('pf-phone', p.phone);
    setField('pf-cep', p.cep);
    setField('pf-street', p.street);
    setField('pf-neighborhood', p.neighborhood);
    setField('pf-city', p.city);
    setField('pf-state', p.state);
    setField('pf-blood', p.blood);

    if (btnCopyAllPerson) {
      btnCopyAllPerson.onclick = () => {
        const full = `Nome: ${p.name}\nCPF: ${p.cpf}\nRG: ${p.rg}\nData de Nascimento: ${p.birthDate} (${p.age})\nSexo: ${p.gender}\nE-mail: ${p.email}\nTelefone: ${p.phone}\nEndereço: ${p.street}, ${p.neighborhood}\nCidade/UF: ${p.city} - ${p.state}\nCEP: ${p.cep}\nTipo Sanguíneo: ${p.blood}`;
        copyToClipboard(full);
      };
    }
  };

  function setField(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  if (btnGenPerson) {
    btnGenPerson.addEventListener('click', updatePersonUI);
    updatePersonUI();
  }

  // 2. GERADOR DE EMPRESAS (PJ)
  const btnGenCompany = document.getElementById('btn-gen-company');
  const selCompanyState = document.getElementById('sel-company-state');
  const checkCompanyFormat = document.getElementById('check-company-format');
  const btnCopyCompany = document.getElementById('btn-copy-company');

  const updateCompanyUI = () => {
    if (!window.COMPANY_GENERATOR) return;
    const state = selCompanyState ? selCompanyState.value : 'SP';
    const format = checkCompanyFormat ? checkCompanyFormat.checked : true;
    const c = COMPANY_GENERATOR.generateCompany({ state, format });

    setField('comp-corporate', c.corporateName);
    setField('comp-fantasy', c.fantasyName);
    setField('comp-cnpj', c.cnpj);
    setField('comp-ie', c.ie);
    setField('comp-cnae', c.cnae);
    setField('comp-opening', c.openingDate);
    setField('comp-capital', c.capitalSocial);
    setField('comp-email', c.email);
    setField('comp-phone', c.phone);
    setField('comp-address', c.address);
    setField('comp-city', `${c.city} - ${c.state}`);
    setField('comp-cep', c.cep);

    if (btnCopyCompany) {
      btnCopyCompany.onclick = () => {
        const full = `Razão Social: ${c.corporateName}\nNome Fantasia: ${c.fantasyName}\nCNPJ: ${c.cnpj}\nInscrição Estadual: ${c.ie}\nCNAE: ${c.cnae}\nData Abertura: ${c.openingDate}\nCapital Social: ${c.capitalSocial}\nEndereço: ${c.address}\nCEP: ${c.cep}\nTelefone: ${c.phone}`;
        copyToClipboard(full);
      };
    }
  };

  if (btnGenCompany) {
    btnGenCompany.addEventListener('click', updateCompanyUI);
    updateCompanyUI();
  }

  // 3. CONVERSOR JSON PARA TYPESCRIPT
  const jsonTsInput = document.getElementById('json-ts-input');
  const jsonTsOutput = document.getElementById('json-ts-output');
  const jsonTsRoot = document.getElementById('json-ts-root');
  const checkTsType = document.getElementById('check-ts-type');
  const btnConvertJsonTs = document.getElementById('btn-convert-json-ts');
  const btnSampleJsonTs = document.getElementById('btn-sample-json-ts');
  const btnCopyJsonTs = document.getElementById('btn-copy-json-ts');

  if (btnConvertJsonTs) {
    btnConvertJsonTs.addEventListener('click', () => {
      const root = jsonTsRoot?.value.trim() || 'RootObject';
      const useType = checkTsType ? checkTsType.checked : false;
      const res = JSON_TO_TS.convert(jsonTsInput.value, root, useType);
      if (res.success) {
        jsonTsOutput.textContent = res.code;
        showToast('Interfaces TypeScript geradas!');
      } else {
        jsonTsOutput.textContent = `// ${res.error}`;
      }
    });
  }

  if (btnSampleJsonTs) {
    btnSampleJsonTs.addEventListener('click', () => {
      jsonTsInput.value = JSON_TO_TS.getSample();
      btnConvertJsonTs.click();
    });
  }

  if (btnCopyJsonTs) {
    btnCopyJsonTs.addEventListener('click', () => {
      if (jsonTsOutput.textContent) copyToClipboard(jsonTsOutput.textContent);
    });
  }

  // 4. GERADOR DE HASHES (MD5, SHA-1, SHA-256, SHA-512)
  const hashInput = document.getElementById('hash-input');
  const hashMd5 = document.getElementById('hash-md5');
  const hashSha1 = document.getElementById('hash-sha1');
  const hashSha256 = document.getElementById('hash-sha256');
  const hashSha512 = document.getElementById('hash-sha512');

  if (hashInput) {
    const updateHashes = async () => {
      const val = hashInput.value;
      const res = await HASH_GENERATOR.generateAll(val);
      if (hashMd5) hashMd5.textContent = res.md5 || '---';
      if (hashSha1) hashSha1.textContent = res.sha1 || '---';
      if (hashSha256) hashSha256.textContent = res.sha256 || '---';
      if (hashSha512) hashSha512.textContent = res.sha512 || '---';
    };
    hashInput.addEventListener('input', updateHashes);
    updateHashes();
  }

  // 5. CNH
  const cnhDisplay = document.getElementById('cnh-display');
  const btnGenCnh = document.getElementById('btn-gen-cnh');
  const btnCopyCnh = document.getElementById('btn-copy-cnh');
  const inputValidateCnh = document.getElementById('input-validate-cnh');
  const badgeValidateCnh = document.getElementById('badge-validate-cnh');

  if (btnGenCnh) {
    const updateCnh = () => {
      if (cnhDisplay) cnhDisplay.textContent = CNH_TOOL.generate();
    };
    btnGenCnh.addEventListener('click', updateCnh);
    updateCnh();
  }

  if (btnCopyCnh) {
    btnCopyCnh.addEventListener('click', () => {
      copyToClipboard(cnhDisplay.textContent);
    });
  }

  if (inputValidateCnh) {
    inputValidateCnh.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (!val) {
        badgeValidateCnh.className = 'badge-status badge-neutral';
        badgeValidateCnh.textContent = 'Aguardando digitação';
        return;
      }
      const res = CNH_TOOL.validate(val);
      badgeValidateCnh.className = res.valid ? 'badge-status badge-valid' : 'badge-status badge-invalid';
      badgeValidateCnh.textContent = res.valid ? 'CNH Válida' : res.reason;
    });
  }

  // 6. PIS / PASEP
  const pisDisplay = document.getElementById('pis-display');
  const btnGenPis = document.getElementById('btn-gen-pis');
  const checkPisFormat = document.getElementById('check-pis-format');
  const btnCopyPis = document.getElementById('btn-copy-pis');
  const inputValidatePis = document.getElementById('input-validate-pis');
  const badgeValidatePis = document.getElementById('badge-validate-pis');

  if (btnGenPis) {
    const updatePis = () => {
      const format = checkPisFormat ? checkPisFormat.checked : true;
      if (pisDisplay) pisDisplay.textContent = PIS_TOOL.generate(format);
    };
    btnGenPis.addEventListener('click', updatePis);
    updatePis();
  }

  if (btnCopyPis) {
    btnCopyPis.addEventListener('click', () => {
      copyToClipboard(pisDisplay.textContent);
    });
  }

  if (inputValidatePis) {
    inputValidatePis.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (!val) {
        badgeValidatePis.className = 'badge-status badge-neutral';
        badgeValidatePis.textContent = 'Aguardando digitação';
        return;
      }
      const res = PIS_TOOL.validate(val);
      badgeValidatePis.className = res.valid ? 'badge-status badge-valid' : 'badge-status badge-invalid';
      badgeValidatePis.textContent = res.valid ? 'PIS Válido' : res.reason;
    });
  }

  // 7. TÍTULO DE ELEITOR
  const voterDisplay = document.getElementById('voter-display');
  const selVoterUf = document.getElementById('sel-voter-uf');
  const btnGenVoter = document.getElementById('btn-gen-voter');
  const btnCopyVoter = document.getElementById('btn-copy-voter');
  const inputValidateVoter = document.getElementById('input-validate-voter');
  const badgeValidateVoter = document.getElementById('badge-validate-voter');

  if (btnGenVoter) {
    const updateVoter = () => {
      const uf = selVoterUf ? selVoterUf.value : 'SP';
      if (voterDisplay) voterDisplay.textContent = VOTER_ID_TOOL.generate(uf, true);
    };
    btnGenVoter.addEventListener('click', updateVoter);
    updateVoter();
  }

  if (btnCopyVoter) {
    btnCopyVoter.addEventListener('click', () => {
      copyToClipboard(voterDisplay.textContent);
    });
  }

  if (inputValidateVoter) {
    inputValidateVoter.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (!val) {
        badgeValidateVoter.className = 'badge-status badge-neutral';
        badgeValidateVoter.textContent = 'Aguardando digitação';
        return;
      }
      const res = VOTER_ID_TOOL.validate(val);
      badgeValidateVoter.className = res.valid ? 'badge-status badge-valid' : 'badge-status badge-invalid';
      badgeValidateVoter.textContent = res.valid ? 'Título Válido' : res.reason;
    });
  }

  // 8. TESTADOR DE REGEX
  const regexPattern = document.getElementById('regex-pattern');
  const regexFlags = document.getElementById('regex-flags');
  const regexText = document.getElementById('regex-text');
  const regexHighlightBox = document.getElementById('regex-highlight-box');
  const regexMatchCount = document.getElementById('regex-match-count');

  const updateRegexUI = () => {
    if (!regexPattern || !regexText) return;
    const res = REGEX_TESTER.test(regexPattern.value, regexFlags?.value || 'g', regexText.value);
    if (regexHighlightBox) regexHighlightBox.innerHTML = res.html;
    if (regexMatchCount) regexMatchCount.textContent = `${res.count} ocorrência(s) encontrada(s)`;
  };

  if (regexPattern) regexPattern.addEventListener('input', updateRegexUI);
  if (regexFlags) regexFlags.addEventListener('input', updateRegexUI);
  if (regexText) regexText.addEventListener('input', updateRegexUI);

  // Preset buttons
  document.querySelectorAll('.btn-regex-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.dataset.preset;
      const preset = REGEX_TESTER.presets[pKey];
      if (preset) {
        regexPattern.value = preset.pattern;
        if (regexFlags) regexFlags.value = preset.flags;
        updateRegexUI();
        showToast(`Preset "${preset.label}" carregado!`);
      }
    });
  });

  // 9. CONVERSOR JSON <> CSV
  const jsonCsvInput = document.getElementById('json-csv-input');
  const jsonCsvOutput = document.getElementById('json-csv-output');
  const btnJsonToCsv = document.getElementById('btn-json-to-csv');
  const btnCsvToJson = document.getElementById('btn-csv-to-json');
  const btnSampleJsonCsv = document.getElementById('btn-sample-json-csv');
  const btnCopyJsonCsv = document.getElementById('btn-copy-json-csv');

  if (btnJsonToCsv) {
    btnJsonToCsv.addEventListener('click', () => {
      const res = JSON_CSV_TOOL.jsonToCsv(jsonCsvInput.value);
      if (res.success) {
        jsonCsvOutput.value = res.csv;
        showToast('JSON convertido para CSV!');
      } else {
        jsonCsvOutput.value = res.error;
      }
    });
  }

  if (btnCsvToJson) {
    btnCsvToJson.addEventListener('click', () => {
      const res = JSON_CSV_TOOL.csvToJson(jsonCsvInput.value);
      if (res.success) {
        jsonCsvOutput.value = res.json;
        showToast('CSV convertido para JSON!');
      } else {
        jsonCsvOutput.value = res.error;
      }
    });
  }

  if (btnSampleJsonCsv) {
    btnSampleJsonCsv.addEventListener('click', () => {
      jsonCsvInput.value = JSON_CSV_TOOL.getSampleJson();
      btnJsonToCsv.click();
    });
  }

  if (btnCopyJsonCsv) {
    btnCopyJsonCsv.addEventListener('click', () => {
      if (jsonCsvOutput.value) copyToClipboard(jsonCsvOutput.value);
    });
  }

  // 10. CALCULADORA DE SUB-REDE IP / CIDR
  const inputSubnetIp = document.getElementById('input-subnet-ip');
  const inputSubnetCidr = document.getElementById('input-subnet-cidr');
  const btnCalcSubnet = document.getElementById('btn-calc-subnet');
  const subnetResultContainer = document.getElementById('subnet-result-container');

  if (btnCalcSubnet) {
    const runSubnetCalc = () => {
      const ip = inputSubnetIp?.value || '192.168.1.0';
      const cidr = inputSubnetCidr?.value || '24';
      const res = SUBNET_CALCULATOR.calculate(ip, cidr);

      if (res.success) {
        subnetResultContainer.innerHTML = `
          <table class="subnet-table">
            <tbody>
              <tr><td>Notação CIDR:</td><td>${res.cidr}</td></tr>
              <tr><td>Máscara de Sub-rede:</td><td>${res.netmask}</td></tr>
              <tr><td>Máscara Binária:</td><td>${res.binaryMask}</td></tr>
              <tr><td>Endereço da Rede:</td><td>${res.network}</td></tr>
              <tr><td>Primeiro Host Útil:</td><td>${res.firstHost}</td></tr>
              <tr><td>Último Host Útil:</td><td>${res.lastHost}</td></tr>
              <tr><td>Endereço de Broadcast:</td><td>${res.broadcast}</td></tr>
              <tr><td>Hosts Utilizáveis:</td><td>${res.usableHosts} IPs</td></tr>
              <tr><td>Total de Endereços:</td><td>${res.totalAddresses} IPs</td></tr>
            </tbody>
          </table>
        `;
      } else {
        subnetResultContainer.innerHTML = `<span style="color: var(--accent-rose); font-size: 0.9rem;">${res.error}</span>`;
      }
    };

    btnCalcSubnet.addEventListener('click', runSubnetCalc);
    runSubnetCalc();
  }

  // 11. CATÁLOGO DE STATUS HTTP
  const httpSearchInput = document.getElementById('http-search-input');
  const httpCardsGrid = document.getElementById('http-cards-grid');
  const httpFilterBtns = document.querySelectorAll('.http-cat-btn');

  if (httpCardsGrid) {
    const renderHttpCodes = (query = '', cat = 'all') => {
      const list = HTTP_STATUS_TOOL.filter(query, cat);
      httpCardsGrid.innerHTML = list.map(c => `
        <div class="http-status-card">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="http-code-num c${c.category}">${c.code}</span>
            <span class="tool-card-badge">${c.phrase}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${c.desc}</p>
        </div>
      `).join('');
    };

    renderHttpCodes();

    if (httpSearchInput) {
      httpSearchInput.addEventListener('input', (e) => {
        const activeCat = document.querySelector('.http-cat-btn.active')?.dataset.cat || 'all';
        renderHttpCodes(e.target.value, activeCat);
      });
    }

    httpFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        httpFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderHttpCodes(httpSearchInput?.value || '', btn.dataset.cat);
      });
    });
  }

  // 12. CARTÃO DE CRÉDITO
  const btnGenCard = document.getElementById('btn-gen-card');
  const selCardBrand = document.getElementById('sel-card-brand');
  const checkCardFormat = document.getElementById('check-card-format');
  const cardPreviewNumber = document.getElementById('card-preview-number');
  const cardPreviewBrand = document.getElementById('card-preview-brand');
  const cardPreviewExp = document.getElementById('card-preview-exp');
  const cardPreviewCvv = document.getElementById('card-preview-cvv');
  const btnCopyCard = document.getElementById('btn-copy-card');
  const inputValidateCard = document.getElementById('input-validate-card');
  const badgeValidateCard = document.getElementById('badge-validate-card');

  if (btnGenCard) {
    const updateCardUI = () => {
      const brand = selCardBrand ? selCardBrand.value : 'visa';
      const format = checkCardFormat ? checkCardFormat.checked : true;
      const c = CREDIT_CARD_TOOL.generateCard(brand, format);

      if (cardPreviewNumber) cardPreviewNumber.textContent = c.number;
      if (cardPreviewBrand) cardPreviewBrand.textContent = c.brand;
      if (cardPreviewExp) cardPreviewExp.textContent = c.expiration;
      if (cardPreviewCvv) cardPreviewCvv.textContent = c.cvv;
    };
    btnGenCard.addEventListener('click', updateCardUI);
    updateCardUI();
  }

  if (btnCopyCard) {
    btnCopyCard.addEventListener('click', () => {
      const full = `Número: ${cardPreviewNumber.textContent} | Validade: ${cardPreviewExp.textContent} | CVV: ${cardPreviewCvv.textContent} (${cardPreviewBrand.textContent})`;
      copyToClipboard(full);
    });
  }

  if (inputValidateCard) {
    inputValidateCard.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (!val) {
        badgeValidateCard.className = 'badge-status badge-neutral';
        badgeValidateCard.textContent = 'Aguardando número';
        return;
      }
      const res = CREDIT_CARD_TOOL.validate(val);
      if (res.valid) {
        badgeValidateCard.className = 'badge-status badge-valid';
        badgeValidateCard.textContent = `Válido (${res.brand})`;
      } else {
        badgeValidateCard.className = 'badge-status badge-invalid';
        badgeValidateCard.textContent = res.reason;
      }
    });
  }

  // 13. CONTAS BANCÁRIAS
  const btnGenBank = document.getElementById('btn-gen-bank');
  const selBank = document.getElementById('sel-bank');
  const bankAgencyVal = document.getElementById('bank-agency-val');
  const bankAccountVal = document.getElementById('bank-account-val');
  const bankNameVal = document.getElementById('bank-name-val');
  const btnCopyBank = document.getElementById('btn-copy-bank');

  if (btnGenBank) {
    const updateBankUI = () => {
      const bKey = selBank ? selBank.value : 'bb';
      const b = BANK_ACCOUNT_TOOL.generate(bKey, true);
      if (bankAgencyVal) bankAgencyVal.textContent = b.agency;
      if (bankAccountVal) bankAccountVal.textContent = b.account;
      if (bankNameVal) bankNameVal.textContent = `${b.bankName} (Cód. ${b.bankCode})`;
    };
    btnGenBank.addEventListener('click', updateBankUI);
    updateBankUI();
  }

  if (btnCopyBank) {
    btnCopyBank.addEventListener('click', () => {
      const full = `${bankNameVal.textContent} | Agência: ${bankAgencyVal.textContent} | Conta: ${bankAccountVal.textContent}`;
      copyToClipboard(full);
    });
  }

  // 14. VEÍCULOS & RENAVAM
  const btnGenPlate = document.getElementById('btn-gen-plate');
  const checkMercosul = document.getElementById('check-plate-mercosul');
  const plateDisplay = document.getElementById('plate-display');
  const plateTypeLabel = document.getElementById('plate-type-label');
  const renavamDisplay = document.getElementById('renavam-display');
  const btnGenRenavam = document.getElementById('btn-gen-renavam');
  const btnCopyPlate = document.getElementById('btn-copy-plate');

  if (btnGenPlate) {
    const updatePlate = () => {
      const isMercosul = checkMercosul ? checkMercosul.checked : true;
      const plate = VEHICLES_TOOL.generatePlate(isMercosul);
      if (plateDisplay) plateDisplay.textContent = plate;
      if (plateTypeLabel) plateTypeLabel.textContent = isMercosul ? 'BRASIL • MERCOSUL' : 'BRASIL • PADRÃO';
    };
    btnGenPlate.addEventListener('click', updatePlate);
    updatePlate();
  }

  if (btnGenRenavam) {
    const updateRenavam = () => {
      if (renavamDisplay) renavamDisplay.textContent = VEHICLES_TOOL.generateRenavam();
    };
    btnGenRenavam.addEventListener('click', updateRenavam);
    updateRenavam();
  }

  if (btnCopyPlate) {
    btnCopyPlate.addEventListener('click', () => {
      copyToClipboard(plateDisplay.textContent);
    });
  }

  // 15. SENHAS
  const sliderPassLen = document.getElementById('pass-len-slider');
  const passLenDisplay = document.getElementById('pass-len-display');
  const checkPassUpper = document.getElementById('check-pass-upper');
  const checkPassLower = document.getElementById('check-pass-lower');
  const checkPassNums = document.getElementById('check-pass-nums');
  const checkPassSyms = document.getElementById('check-pass-syms');
  const btnGenPass = document.getElementById('btn-gen-pass');
  const passDisplay = document.getElementById('pass-display-val');
  const passStrengthFill = document.getElementById('pass-strength-fill');
  const passStrengthLabel = document.getElementById('pass-strength-label');
  const btnCopyPass = document.getElementById('btn-copy-pass');

  if (btnGenPass) {
    const updatePassUI = () => {
      const len = parseInt(sliderPassLen?.value || '16');
      if (passLenDisplay) passLenDisplay.textContent = len;

      const res = PASSWORD_GENERATOR.generate({
        length: len,
        upper: checkPassUpper?.checked !== false,
        lower: checkPassLower?.checked !== false,
        numbers: checkPassNums?.checked !== false,
        symbols: checkPassSyms?.checked !== false
      });

      if (passDisplay) passDisplay.textContent = res.password;
      if (passStrengthFill) {
        passStrengthFill.style.width = `${res.strength.percent}%`;
        passStrengthFill.style.backgroundColor = res.strength.color;
      }
      if (passStrengthLabel) {
        passStrengthLabel.textContent = `Força: ${res.strength.label}`;
        passStrengthLabel.style.color = res.strength.color;
      }
    };
    if (sliderPassLen) sliderPassLen.addEventListener('input', updatePassUI);
    btnGenPass.addEventListener('click', updatePassUI);
    updatePassUI();
  }

  if (btnCopyPass) {
    btnCopyPass.addEventListener('click', () => {
      copyToClipboard(passDisplay.textContent);
    });
  }

  // 16. LOREM IPSUM & TEXTO
  const btnGenLorem = document.getElementById('btn-gen-lorem');
  const selLoremQty = document.getElementById('sel-lorem-qty');
  const textInputArea = document.getElementById('text-input-area');
  const statCharsWithSpaces = document.getElementById('stat-chars-with-spaces');
  const statCharsNoSpaces = document.getElementById('stat-chars-no-spaces');
  const statWords = document.getElementById('stat-words');
  const statLines = document.getElementById('stat-lines');
  const statReadingTime = document.getElementById('stat-reading-time');
  const btnCopyText = document.getElementById('btn-copy-text');

  const updateTextStats = () => {
    if (!textInputArea) return;
    const stats = TEXT_TOOLS.analyzeText(textInputArea.value);
    if (statCharsWithSpaces) statCharsWithSpaces.textContent = stats.charsWithSpaces;
    if (statCharsNoSpaces) statCharsNoSpaces.textContent = stats.charsNoSpaces;
    if (statWords) statWords.textContent = stats.words;
    if (statLines) statLines.textContent = stats.lines;
    if (statReadingTime) statReadingTime.textContent = `${stats.readingTimeMin} min`;
  };

  if (textInputArea) textInputArea.addEventListener('input', updateTextStats);

  if (btnGenLorem) {
    btnGenLorem.addEventListener('click', () => {
      const qty = parseInt(selLoremQty?.value || '3');
      textInputArea.value = TEXT_TOOLS.generateLorem(qty);
      updateTextStats();
      showToast('Texto Lorem Ipsum gerado!');
    });
  }

  if (btnCopyText) {
    btnCopyText.addEventListener('click', () => {
      if (textInputArea.value) copyToClipboard(textInputArea.value);
    });
  }

  // 17. QR CODE
  const qrcodeInput = document.getElementById('qrcode-input');
  const btnGenQr = document.getElementById('btn-gen-qrcode');
  const qrcodeCanvas = document.getElementById('qrcode-canvas');
  const btnDownloadQr = document.getElementById('btn-download-qrcode');

  if (btnGenQr && qrcodeCanvas) {
    const renderQr = () => {
      const text = qrcodeInput.value.trim() || 'https://caixadodev.com.br';
      QRCODE_TOOL.generate(qrcodeCanvas, text, 240);
    };
    btnGenQr.addEventListener('click', renderQr);
    renderQr();
  }

  if (btnDownloadQr && qrcodeCanvas) {
    btnDownloadQr.addEventListener('click', () => {
      QRCODE_TOOL.download(qrcodeCanvas, 'qrcode-caixadodev.png');
      showToast('Download do QR Code iniciado!');
    });
  }

  // 18. CPF / CNPJ
  const btnGenCpf = document.getElementById('btn-gen-cpf');
  const btnGenCnpj = document.getElementById('btn-gen-cnpj');
  const cpfDisplay = document.getElementById('cpf-display-value');
  const checkCpfFormat = document.getElementById('check-cpf-format');
  const btnCopyCpf = document.getElementById('btn-copy-cpf');
  const inputValidateCpf = document.getElementById('input-validate-cpf');
  const badgeValidateResult = document.getElementById('badge-validate-result');
  const textValidateDetail = document.getElementById('text-validate-detail');

  if (btnGenCpf) {
    const updateCpf = () => {
      const formatted = checkCpfFormat ? checkCpfFormat.checked : true;
      cpfDisplay.textContent = CPF_CNPJ_TOOL.generateCPF(formatted);
    };
    btnGenCpf.addEventListener('click', updateCpf);
    updateCpf();
  }

  if (btnGenCnpj) {
    btnGenCnpj.addEventListener('click', () => {
      const formatted = checkCpfFormat ? checkCpfFormat.checked : true;
      cpfDisplay.textContent = CPF_CNPJ_TOOL.generateCNPJ(formatted);
    });
  }

  if (btnCopyCpf) {
    btnCopyCpf.addEventListener('click', () => {
      copyToClipboard(cpfDisplay.textContent);
    });
  }

  if (inputValidateCpf) {
    inputValidateCpf.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (!val) {
        badgeValidateResult.className = 'badge-status badge-neutral';
        badgeValidateResult.textContent = 'Aguardando digitação';
        textValidateDetail.textContent = '';
        return;
      }
      const clean = val.replace(/\D/g, '');
      if (clean.length <= 11) {
        const res = CPF_CNPJ_TOOL.validateCPF(val);
        badgeValidateResult.className = res.valid ? 'badge-status badge-valid' : 'badge-status badge-invalid';
        badgeValidateResult.textContent = res.valid ? 'CPF Válido' : 'CPF Inválido';
        textValidateDetail.textContent = res.region || res.reason;
      } else {
        const res = CPF_CNPJ_TOOL.validateCNPJ(val);
        badgeValidateResult.className = res.valid ? 'badge-status badge-valid' : 'badge-status badge-invalid';
        badgeValidateResult.textContent = res.valid ? 'CNPJ Válido' : 'CNPJ Inválido';
        textValidateDetail.textContent = res.reason || 'Formato e dígitos verificadores aprovados.';
      }
    });
  }

  // 19. JSON
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const btnFormatJson = document.getElementById('btn-format-json');
  const btnMinifyJson = document.getElementById('btn-minify-json');
  const btnSampleJson = document.getElementById('btn-sample-json');
  const btnClearJson = document.getElementById('btn-clear-json');
  const btnCopyJson = document.getElementById('btn-copy-json');
  const jsonStats = document.getElementById('json-stats');

  if (btnFormatJson) {
    btnFormatJson.addEventListener('click', () => {
      const indent = parseInt(document.getElementById('json-indent-select')?.value || '2');
      const res = JSON_TOOL.format(jsonInput.value, indent);
      if (res.success) {
        jsonOutput.textContent = res.result;
        jsonStats.innerHTML = `<span class="badge-status badge-valid">Válido</span> ${res.stats.keys} chaves | ${formatBytes(res.stats.resultSize)}`;
        showToast('JSON formatado!');
      } else {
        jsonOutput.textContent = `Erro de Sintaxe:\n${res.error}`;
        jsonStats.innerHTML = `<span class="badge-status badge-invalid">Inválido</span>`;
      }
    });
  }

  if (btnMinifyJson) {
    btnMinifyJson.addEventListener('click', () => {
      const res = JSON_TOOL.minify(jsonInput.value);
      if (res.success) {
        jsonOutput.textContent = res.result;
        jsonStats.innerHTML = `<span class="badge-status badge-valid">Minificado</span>`;
        showToast('JSON minificado!');
      } else {
        jsonOutput.textContent = `Erro:\n${res.error}`;
      }
    });
  }

  if (btnSampleJson) {
    btnSampleJson.addEventListener('click', () => {
      jsonInput.value = JSON_TOOL.getSample();
      btnFormatJson.click();
    });
  }

  if (btnClearJson) {
    btnClearJson.addEventListener('click', () => {
      jsonInput.value = '';
      jsonOutput.textContent = '';
      jsonStats.textContent = '';
    });
  }

  if (btnCopyJson) {
    btnCopyJson.addEventListener('click', () => {
      if (jsonOutput.textContent) copyToClipboard(jsonOutput.textContent);
    });
  }

  // 20. SQL
  const sqlInput = document.getElementById('sql-input');
  const sqlOutput = document.getElementById('sql-output');
  const btnFormatSql = document.getElementById('btn-format-sql');
  const btnMinifySql = document.getElementById('btn-minify-sql');
  const btnSampleSql = document.getElementById('btn-sample-sql');
  const btnClearSql = document.getElementById('btn-clear-sql');
  const btnCopySql = document.getElementById('btn-copy-sql');
  const checkSqlUpper = document.getElementById('check-sql-upper');

  if (btnFormatSql) {
    btnFormatSql.addEventListener('click', () => {
      const uppercase = checkSqlUpper ? checkSqlUpper.checked : true;
      sqlOutput.textContent = SQL_FORMATTER.format(sqlInput.value, { uppercase, indent: '  ' });
      showToast('SQL formatado!');
    });
  }

  if (btnMinifySql) {
    btnMinifySql.addEventListener('click', () => {
      sqlOutput.textContent = SQL_FORMATTER.minify(sqlInput.value);
      showToast('SQL minificado!');
    });
  }

  if (btnSampleSql) {
    btnSampleSql.addEventListener('click', () => {
      sqlInput.value = SQL_FORMATTER.getSample();
      btnFormatSql.click();
    });
  }

  if (btnClearSql) {
    btnClearSql.addEventListener('click', () => {
      sqlInput.value = '';
      sqlOutput.textContent = '';
    });
  }

  if (btnCopySql) {
    btnCopySql.addEventListener('click', () => {
      if (sqlOutput.textContent) copyToClipboard(sqlOutput.textContent);
    });
  }

  // 21. DIFF
  const diffInputA = document.getElementById('diff-input-a');
  const diffInputB = document.getElementById('diff-input-b');
  const btnRunDiff = document.getElementById('btn-run-diff');
  const btnSampleDiff = document.getElementById('btn-sample-diff');
  const btnClearDiff = document.getElementById('btn-clear-diff');
  const diffContainer = document.getElementById('diff-container');
  const diffStatsArea = document.getElementById('diff-stats-area');

  if (btnRunDiff) {
    const runDiffProcess = () => {
      const res = DIFF_CHECKER.compare(diffInputA.value, diffInputB.value);
      diffStatsArea.innerHTML = `
        <span class="diff-stat-item" style="color: #6ee7b7;">+ ${res.stats.added} adições</span>
        <span class="diff-stat-item" style="color: #fda4af;">- ${res.stats.removed} remoções</span>
        <span class="diff-stat-item" style="color: var(--text-muted);">= ${res.stats.unchanged} inalteradas</span>
      `;

      let tableHtml = `<table class="diff-table"><tbody>`;
      res.diff.forEach(row => {
        const symbol = row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' ';
        tableHtml += `
          <tr class="diff-row ${row.type}">
            <td class="diff-line-num">${row.lineA !== null ? row.lineA : ''}</td>
            <td class="diff-line-num">${row.lineB !== null ? row.lineB : ''}</td>
            <td class="diff-marker">${symbol}</td>
            <td class="diff-content">${escapeHtml(row.text)}</td>
          </tr>
        `;
      });
      tableHtml += `</tbody></table>`;
      diffContainer.innerHTML = tableHtml;
    };
    btnRunDiff.addEventListener('click', runDiffProcess);
  }

  if (btnSampleDiff) {
    btnSampleDiff.addEventListener('click', () => {
      const sample = DIFF_CHECKER.getSample();
      diffInputA.value = sample.textA;
      diffInputB.value = sample.textB;
      btnRunDiff.click();
    });
  }

  if (btnClearDiff) {
    btnClearDiff.addEventListener('click', () => {
      diffInputA.value = '';
      diffInputB.value = '';
      diffContainer.innerHTML = '<div style="padding: 20px; color: var(--text-muted); text-align: center;">Clique em "Comparar Textos".</div>';
      diffStatsArea.innerHTML = '';
    });
  }

  // 22. CASE
  const caseInput = document.getElementById('case-input');
  const valCamel = document.getElementById('val-camel');
  const valPascal = document.getElementById('val-pascal');
  const valSnake = document.getElementById('val-snake');
  const valKebab = document.getElementById('val-kebab');
  const valConstant = document.getElementById('val-constant');
  const valTitle = document.getElementById('val-title');
  const valDot = document.getElementById('val-dot');

  if (caseInput) {
    caseInput.addEventListener('input', (e) => {
      const res = CASE_CONVERTER.convertAll(e.target.value);
      if (valCamel) valCamel.textContent = res.camel;
      if (valPascal) valPascal.textContent = res.pascal;
      if (valSnake) valSnake.textContent = res.snake;
      if (valKebab) valKebab.textContent = res.kebab;
      if (valConstant) valConstant.textContent = res.constant;
      if (valTitle) valTitle.textContent = res.title;
      if (valDot) valDot.textContent = res.dot;
    });
  }

  // 23. CORES
  const colorPickerNative = document.getElementById('color-picker-native');
  const colorSwatchBox = document.getElementById('color-swatch-box');
  const inputColorHex = document.getElementById('input-color-hex');
  const inputColorRgb = document.getElementById('input-color-rgb');
  const inputColorHsl = document.getElementById('input-color-hsl');
  const badgeColorContrast = document.getElementById('badge-color-contrast');

  const updateColorUI = (outputs) => {
    if (!outputs) return;
    if (colorSwatchBox) colorSwatchBox.style.backgroundColor = outputs.hex;
    if (colorPickerNative) colorPickerNative.value = outputs.hex;
    if (inputColorHex && document.activeElement !== inputColorHex) inputColorHex.value = outputs.hex;
    if (inputColorRgb && document.activeElement !== inputColorRgb) inputColorRgb.value = outputs.rgb;
    if (inputColorHsl && document.activeElement !== inputColorHsl) inputColorHsl.value = outputs.hsl;
    if (badgeColorContrast) {
      badgeColorContrast.textContent = outputs.isDark ? 'Fundo Escuro' : 'Fundo Claro';
      badgeColorContrast.className = 'badge-status ' + (outputs.isDark ? 'badge-neutral' : 'badge-valid');
    }
  };

  if (colorPickerNative) colorPickerNative.addEventListener('input', (e) => updateColorUI(COLOR_CONVERTER.parseAny(e.target.value)));
  if (inputColorHex) inputColorHex.addEventListener('input', (e) => { const r = COLOR_CONVERTER.parseAny(e.target.value); if (r) updateColorUI(r); });
  if (inputColorRgb) inputColorRgb.addEventListener('input', (e) => { const r = COLOR_CONVERTER.parseAny(e.target.value); if (r) updateColorUI(r); });
  if (inputColorHex) updateColorUI(COLOR_CONVERTER.parseAny('#6366f1'));

  // 24. JWT
  const jwtInput = document.getElementById('jwt-input');
  const jwtHeaderOutput = document.getElementById('jwt-header-output');
  const jwtPayloadOutput = document.getElementById('jwt-payload-output');
  const jwtStatusBadge = document.getElementById('jwt-status-badge');
  const jwtExpDetail = document.getElementById('jwt-exp-detail');
  const btnSampleJwt = document.getElementById('btn-sample-jwt');

  const decodeJwtProcess = () => {
    const val = jwtInput.value.trim();
    if (!val) {
      jwtHeaderOutput.textContent = '// Aguardando token...';
      jwtPayloadOutput.textContent = '// Aguardando token...';
      jwtStatusBadge.className = 'badge-status badge-neutral';
      jwtStatusBadge.textContent = 'Sem Token';
      jwtExpDetail.textContent = '';
      return;
    }

    const res = JWT_TOOL.decode(val);
    if (res.success) {
      jwtHeaderOutput.textContent = JSON.stringify(res.header, null, 2);
      jwtPayloadOutput.textContent = JSON.stringify(res.payload, null, 2);
      if (res.expiration.hasExp) {
        jwtStatusBadge.className = res.expiration.isExpired ? 'badge-status badge-invalid' : 'badge-status badge-valid';
        jwtStatusBadge.textContent = res.expiration.statusLabel;
        jwtExpDetail.textContent = `Expiração: ${res.expiration.expDateFormatted}`;
      } else {
        jwtStatusBadge.className = 'badge-status badge-neutral';
        jwtStatusBadge.textContent = 'Sem expiração';
        jwtExpDetail.textContent = '';
      }
    } else {
      jwtHeaderOutput.textContent = '// Erro';
      jwtPayloadOutput.textContent = `// ${res.error}`;
      jwtStatusBadge.className = 'badge-status badge-invalid';
      jwtStatusBadge.textContent = 'Token Inválido';
      jwtExpDetail.textContent = res.error;
    }
  };

  if (jwtInput) jwtInput.addEventListener('input', decodeJwtProcess);
  if (btnSampleJwt) btnSampleJwt.addEventListener('click', () => { jwtInput.value = JWT_TOOL.getSample(); decodeJwtProcess(); });

  // 25. TIMESTAMP
  const liveClockSec = document.getElementById('live-clock-sec');
  const liveClockMs = document.getElementById('live-clock-ms');
  const inputEpoch = document.getElementById('input-epoch');
  const btnEpochToDate = document.getElementById('btn-epoch-to-date');
  const resultEpochDate = document.getElementById('result-epoch-date');
  const inputDateTime = document.getElementById('input-datetime');
  const btnDateToEpoch = document.getElementById('btn-date-to-epoch');
  const resultDateEpoch = document.getElementById('result-date-epoch');

  setInterval(() => {
    const now = Date.now();
    if (liveClockSec) liveClockSec.textContent = Math.floor(now / 1000);
    if (liveClockMs) liveClockMs.textContent = now;
  }, 1000);

  if (btnEpochToDate) {
    btnEpochToDate.addEventListener('click', () => {
      const res = TIMESTAMP_TOOL.epochToDate(inputEpoch.value);
      if (res.success) {
        resultEpochDate.innerHTML = `<strong>Brasília:</strong> ${res.brasilia}<br><strong>UTC:</strong> ${res.utc}<br><strong>ISO:</strong> ${res.iso}`;
      } else {
        resultEpochDate.innerHTML = `<span style="color: var(--accent-rose);">${res.error}</span>`;
      }
    });
  }

  if (btnDateToEpoch) {
    btnDateToEpoch.addEventListener('click', () => {
      const res = TIMESTAMP_TOOL.dateToEpoch(inputDateTime.value);
      if (res.success) {
        resultDateEpoch.innerHTML = `<strong>Segundos:</strong> ${res.timestampSeconds}<br><strong>Milissegundos:</strong> ${res.timestampMilliseconds}`;
      } else {
        resultDateEpoch.innerHTML = `<span style="color: var(--accent-rose);">${res.error}</span>`;
      }
    });
  }

  // 26. UUID
  const uuidDisplay = document.getElementById('uuid-display');
  const btnGenUuid = document.getElementById('btn-gen-uuid');
  const uuidQty = document.getElementById('uuid-qty');
  const checkUuidUpper = document.getElementById('check-uuid-upper');
  const checkUuidHyphens = document.getElementById('check-uuid-hyphens');
  const btnCopyUuid = document.getElementById('btn-copy-uuid');

  if (btnGenUuid) {
    const generateUuidProcess = () => {
      const qty = parseInt(uuidQty?.value || '1');
      const upper = checkUuidUpper?.checked || false;
      const hyphens = checkUuidHyphens?.checked || true;
      if (qty === 1) {
        uuidDisplay.textContent = UUID_TOOL.generateSingle(upper, hyphens);
      } else {
        uuidDisplay.textContent = UUID_TOOL.generateBatch(qty, upper, hyphens).join('\n');
      }
    };
    btnGenUuid.addEventListener('click', generateUuidProcess);
    generateUuidProcess();
  }

  if (btnCopyUuid) btnCopyUuid.addEventListener('click', () => copyToClipboard(uuidDisplay.textContent));

  // 27. BASE64
  const base64Input = document.getElementById('base64-input');
  const base64Output = document.getElementById('base64-output');
  const btnBase64Encode = document.getElementById('btn-base64-encode');
  const btnBase64Decode = document.getElementById('btn-base64-decode');
  const btnUrlEncode = document.getElementById('btn-url-encode');
  const btnUrlDecode = document.getElementById('btn-url-decode');
  const btnCopyBase64 = document.getElementById('btn-copy-base64');

  if (btnBase64Encode) btnBase64Encode.addEventListener('click', () => { base64Output.value = BASE64_TOOL.encodeBase64(base64Input.value); showToast('Codificado!'); });
  if (btnBase64Decode) btnBase64Decode.addEventListener('click', () => { try { base64Output.value = BASE64_TOOL.decodeBase64(base64Input.value); showToast('Decodificado!'); } catch (e) { base64Output.value = e.message; } });
  if (btnUrlEncode) btnUrlEncode.addEventListener('click', () => { base64Output.value = BASE64_TOOL.encodeUrl(base64Input.value); showToast('URL Codificada!'); });
  if (btnUrlDecode) btnUrlDecode.addEventListener('click', () => { try { base64Output.value = BASE64_TOOL.decodeUrl(base64Input.value); showToast('URL Decodificada!'); } catch (e) { base64Output.value = e.message; } });
  if (btnCopyBase64) btnCopyBase64.addEventListener('click', () => copyToClipboard(base64Output.value));

  // 28. RG TOOL
  const btnGenRg = document.getElementById('btn-gen-rg');
  const rgDisplay = document.getElementById('rg-display');
  const checkRgMask = document.getElementById('check-rg-mask');
  const btnCopyRg = document.getElementById('btn-copy-rg');
  const inputValRg = document.getElementById('input-val-rg');
  const btnValRg = document.getElementById('btn-val-rg');
  const rgValResult = document.getElementById('rg-val-result');

  if (btnGenRg && rgDisplay) {
    const runGenRg = () => {
      const withMask = checkRgMask ? checkRgMask.checked : true;
      rgDisplay.textContent = RG_TOOL.generate(withMask, 'SP');
    };
    btnGenRg.addEventListener('click', runGenRg);
    runGenRg();
  }
  if (btnCopyRg && rgDisplay) btnCopyRg.addEventListener('click', () => copyToClipboard(rgDisplay.textContent));
  if (btnValRg && inputValRg && rgValResult) {
    btnValRg.addEventListener('click', () => {
      const res = RG_TOOL.validate(inputValRg.value);
      rgValResult.style.display = 'block';
      rgValResult.className = `alert-box ${res.valid ? 'alert-success' : 'alert-danger'}`;
      rgValResult.textContent = res.message;
    });
  }

  // 29. CERTIDÃO CNJ
  const btnGenCertidao = document.getElementById('btn-gen-certidao');
  const selectCertidaoTipo = document.getElementById('select-certidao-tipo');
  const checkCertidaoMask = document.getElementById('check-certidao-mask');
  const certidaoDisplay = document.getElementById('certidao-display');
  const certidaoExtraInfo = document.getElementById('certidao-extra-info');
  const btnCopyCertidao = document.getElementById('btn-copy-certidao');
  const inputValCertidao = document.getElementById('input-val-certidao');
  const btnValCertidao = document.getElementById('btn-val-certidao');
  const certidaoValResult = document.getElementById('certidao-val-result');

  if (btnGenCertidao && certidaoDisplay) {
    const runGenCertidao = () => {
      const tipo = selectCertidaoTipo ? selectCertidaoTipo.value : 'nascimento';
      const withMask = checkCertidaoMask ? checkCertidaoMask.checked : true;
      const res = CERTIDAO_TOOL.generate(tipo, withMask);
      certidaoDisplay.textContent = res.formatted;
      if (certidaoExtraInfo) {
        certidaoExtraInfo.textContent = `Tipo: ${res.tipo} | Livro Cartório | DVs: ${res.dvs}`;
      }
    };
    btnGenCertidao.addEventListener('click', runGenCertidao);
    runGenCertidao();
  }
  if (btnCopyCertidao && certidaoDisplay) btnCopyCertidao.addEventListener('click', () => copyToClipboard(certidaoDisplay.textContent));
  if (btnValCertidao && inputValCertidao && certidaoValResult) {
    btnValCertidao.addEventListener('click', () => {
      const res = CERTIDAO_TOOL.validate(inputValCertidao.value);
      certidaoValResult.style.display = 'block';
      certidaoValResult.className = `alert-box ${res.valid ? 'alert-success' : 'alert-danger'}`;
      certidaoValResult.textContent = res.message;
    });
  }

  // 30. CEP TOOL
  const btnGenCep = document.getElementById('btn-gen-cep');
  const selectCepUf = document.getElementById('select-cep-uf');
  const checkCepMask = document.getElementById('check-cep-mask');
  const cepDisplay = document.getElementById('cep-display');
  const cepStateInfo = document.getElementById('cep-state-info');
  const btnCopyCep = document.getElementById('btn-copy-cep');
  const inputSearchCep = document.getElementById('input-search-cep');
  const btnSearchCep = document.getElementById('btn-search-cep');
  const cepSearchResult = document.getElementById('cep-search-result');

  if (btnGenCep && cepDisplay) {
    const runGenCep = () => {
      const uf = selectCepUf ? selectCepUf.value : 'aleatorio';
      const withMask = checkCepMask ? checkCepMask.checked : true;
      const res = CEP_TOOL.generate(uf, withMask);
      cepDisplay.textContent = res.formatted;
      if (cepStateInfo) {
        cepStateInfo.textContent = `Estado: ${res.estado} (${res.uf}) - Capital: ${res.capital}`;
      }
    };
    btnGenCep.addEventListener('click', runGenCep);
    runGenCep();
  }
  if (btnCopyCep && cepDisplay) btnCopyCep.addEventListener('click', () => copyToClipboard(cepDisplay.textContent));
  if (btnSearchCep && inputSearchCep && cepSearchResult) {
    btnSearchCep.addEventListener('click', async () => {
      btnSearchCep.disabled = true;
      btnSearchCep.textContent = 'Buscando...';
      cepSearchResult.style.display = 'block';
      cepSearchResult.innerHTML = `<div style="color: var(--text-muted); padding: 8px;">Consultando base postal...</div>`;
      const res = await CEP_TOOL.lookup(inputSearchCep.value);
      btnSearchCep.disabled = false;
      btnSearchCep.textContent = 'Buscar Endereço';

      if (!res.success) {
        cepSearchResult.innerHTML = `<div class="alert-box alert-danger">${res.message}</div>`;
      } else {
        const d = res.data;
        cepSearchResult.innerHTML = `
          <div class="result-box" style="margin-top: 10px; font-size: 0.92rem; line-height: 1.6;">
            <div><strong>CEP:</strong> ${d.cep}</div>
            <div><strong>Logradouro:</strong> ${d.logradouro}</div>
            <div><strong>Bairro:</strong> ${d.bairro}</div>
            <div><strong>Cidade/UF:</strong> ${d.localidade} - ${d.uf}</div>
            <div><strong>DDD:</strong> ${d.ddd} | <strong>IBGE:</strong> ${d.ibge}</div>
            ${res.isOfflineFallback ? '<div style="color: var(--accent-amber); font-size: 0.8rem; margin-top: 6px;">* Modo offline de faixas postais ativado.</div>' : ''}
          </div>
        `;
      }
    });
  }

  // 31. CRON TOOL
  const cronInput = document.getElementById('cron-input');
  const cronExplanation = document.getElementById('cron-explanation');
  const cronRunsList = document.getElementById('cron-runs-list');
  const cronPresetBtns = document.querySelectorAll('.btn-cron-preset');

  if (cronInput && cronExplanation && cronRunsList) {
    const updateCron = (val) => {
      const exp = (val || cronInput.value).trim();
      cronInput.value = exp;
      cronExplanation.textContent = CRON_TOOL.explain(exp);
      const runs = CRON_TOOL.getNextExecutions(exp, 5);
      if (runs.length > 0) {
        cronRunsList.innerHTML = runs.map((d, i) => `
          <div class="cron-run-item">
            <span>#${i + 1}</span>
            <span>${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR')}</span>
          </div>
        `).join('');
      } else {
        cronRunsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem;">Próximas execuções indisponíveis para esta expressão.</div>`;
      }
    };

    cronInput.addEventListener('input', () => updateCron());
    cronPresetBtns.forEach(b => {
      b.addEventListener('click', () => updateCron(b.dataset.cron));
    });
    updateCron('*/15 * * * *');
  }

  // 32. MARKDOWN TOOL
  const mdInput = document.getElementById('markdown-input');
  const mdPreview = document.getElementById('markdown-preview');
  const mdHtmlOutput = document.getElementById('markdown-html-output');
  const btnMdSample = document.getElementById('btn-md-sample');
  const btnCopyMdHtml = document.getElementById('btn-copy-md-html');

  if (mdInput && mdPreview) {
    const updateMarkdown = () => {
      const parsed = MARKDOWN_TOOL.parse(mdInput.value);
      mdPreview.innerHTML = parsed;
      if (mdHtmlOutput) mdHtmlOutput.value = parsed;
    };
    mdInput.addEventListener('input', updateMarkdown);
    if (btnMdSample) {
      btnMdSample.addEventListener('click', () => {
        mdInput.value = MARKDOWN_TOOL.SAMPLE;
        updateMarkdown();
      });
    }
    if (btnCopyMdHtml && mdHtmlOutput) {
      btnCopyMdHtml.addEventListener('click', () => copyToClipboard(mdHtmlOutput.value));
    }
    mdInput.value = MARKDOWN_TOOL.SAMPLE;
    updateMarkdown();
  }

  // 33. CURL CONVERTER
  const curlInput = document.getElementById('curl-input');
  const btnCurlConvert = document.getElementById('btn-curl-convert');
  const curlCodeOutput = document.getElementById('curl-code-output');
  const curlLangSelect = document.getElementById('curl-lang-select');
  const btnCurlSample = document.getElementById('btn-curl-sample');
  const btnCopyCurlCode = document.getElementById('btn-copy-curl-code');

  if (curlInput && curlCodeOutput) {
    let currentParsed = null;
    const runCurlConvert = () => {
      currentParsed = CURL_CONVERTER.parse(curlInput.value || CURL_CONVERTER.SAMPLE);
      if (!currentParsed) {
        curlCodeOutput.textContent = '// Comando cURL inválido ou vazio';
        return;
      }
      renderCurlCode();
    };

    const renderCurlCode = () => {
      if (!currentParsed) return;
      const lang = curlLangSelect ? curlLangSelect.value : 'fetch';
      if (lang === 'fetch') curlCodeOutput.textContent = CURL_CONVERTER.toFetch(currentParsed);
      else if (lang === 'axios') curlCodeOutput.textContent = CURL_CONVERTER.toAxios(currentParsed);
      else if (lang === 'python') curlCodeOutput.textContent = CURL_CONVERTER.toPython(currentParsed);
      else if (lang === 'php') curlCodeOutput.textContent = CURL_CONVERTER.toPhp(currentParsed);
    };

    if (btnCurlConvert) btnCurlConvert.addEventListener('click', runCurlConvert);
    if (curlLangSelect) curlLangSelect.addEventListener('change', renderCurlCode);
    if (btnCurlSample) {
      btnCurlSample.addEventListener('click', () => {
        curlInput.value = CURL_CONVERTER.SAMPLE;
        runCurlConvert();
      });
    }
    if (btnCopyCurlCode) btnCopyCurlCode.addEventListener('click', () => copyToClipboard(curlCodeOutput.textContent));
    curlInput.value = CURL_CONVERTER.SAMPLE;
    runCurlConvert();
  }

  // 34. CODE BEAUTIFIER (HTML & CSS)
  const beautifierInput = document.getElementById('beautifier-input');
  const btnFmtHtml = document.getElementById('btn-fmt-html');
  const btnMinHtml = document.getElementById('btn-min-html');
  const btnFmtCss = document.getElementById('btn-fmt-css');
  const btnMinCss = document.getElementById('btn-min-css');
  const btnSampleHtml = document.getElementById('btn-sample-html');
  const btnSampleCss = document.getElementById('btn-sample-css');
  const btnCopyBeautifier = document.getElementById('btn-copy-beautifier');

  if (beautifierInput) {
    if (btnFmtHtml) btnFmtHtml.addEventListener('click', () => {
      beautifierInput.value = CODE_BEAUTIFIER.formatHTML(beautifierInput.value);
      showToast('HTML Formatado!');
    });
    if (btnMinHtml) btnMinHtml.addEventListener('click', () => {
      beautifierInput.value = CODE_BEAUTIFIER.minifyHTML(beautifierInput.value);
      showToast('HTML Minificado!');
    });
    if (btnFmtCss) btnFmtCss.addEventListener('click', () => {
      beautifierInput.value = CODE_BEAUTIFIER.formatCSS(beautifierInput.value);
      showToast('CSS Formatado!');
    });
    if (btnMinCss) btnMinCss.addEventListener('click', () => {
      beautifierInput.value = CODE_BEAUTIFIER.minifyCSS(beautifierInput.value);
      showToast('CSS Minificado!');
    });
    if (btnSampleHtml) btnSampleHtml.addEventListener('click', () => {
      beautifierInput.value = CODE_BEAUTIFIER.SAMPLE_HTML;
    });
    if (btnSampleCss) btnSampleCss.addEventListener('click', () => {
      beautifierInput.value = CODE_BEAUTIFIER.SAMPLE_CSS;
    });
    if (btnCopyBeautifier) btnCopyBeautifier.addEventListener('click', () => copyToClipboard(beautifierInput.value));
  }

  // 35. URL PARSER
  const urlInput = document.getElementById('url-parser-input');
  const btnParseUrl = document.getElementById('btn-parse-url');
  const urlProto = document.getElementById('url-part-proto');
  const urlHost = document.getElementById('url-part-host');
  const urlPort = document.getElementById('url-part-port');
  const urlPath = document.getElementById('url-part-path');
  const urlParamsBody = document.getElementById('url-params-tbody');
  const urlRebuilt = document.getElementById('url-rebuilt-output');
  const btnCopyRebuiltUrl = document.getElementById('btn-copy-rebuilt-url');

  if (urlInput && btnParseUrl) {
    const runParseUrl = () => {
      const res = URL_PARSER.parse(urlInput.value || URL_PARSER.SAMPLE);
      if (!res.success) {
        showToast('URL inválida');
        return;
      }
      if (urlProto) urlProto.textContent = res.protocol;
      if (urlHost) urlHost.textContent = res.hostname;
      if (urlPort) urlPort.textContent = res.port;
      if (urlPath) urlPath.textContent = res.pathname;

      if (urlParamsBody) {
        if (res.params.length === 0) {
          urlParamsBody.innerHTML = `<tr><td colspan="2" style="color: var(--text-muted); text-align: center; padding: 12px;">Nenhum parâmetro de busca (?chave=valor) encontrado.</td></tr>`;
        } else {
          urlParamsBody.innerHTML = res.params.map(p => `
            <tr>
              <td style="font-weight: 600; color: var(--accent-cyan);">${escapeHtml(p.key)}</td>
              <td>${escapeHtml(p.value)}</td>
            </tr>
          `).join('');
        }
      }

      if (urlRebuilt) urlRebuilt.textContent = urlInput.value.trim();
    };

    btnParseUrl.addEventListener('click', runParseUrl);
    urlInput.value = URL_PARSER.SAMPLE;
    runParseUrl();
    if (btnCopyRebuiltUrl && urlRebuilt) {
      btnCopyRebuiltUrl.addEventListener('click', () => copyToClipboard(urlRebuilt.textContent));
    }
  }

  // 36. CSS GENERATOR (BOX SHADOW & GLASS)
  const shadowX = document.getElementById('shadow-x');
  const shadowY = document.getElementById('shadow-y');
  const shadowBlur = document.getElementById('shadow-blur');
  const shadowSpread = document.getElementById('shadow-spread');
  const shadowColor = document.getElementById('shadow-color');
  const shadowOpacity = document.getElementById('shadow-opacity');
  const shadowInset = document.getElementById('shadow-inset');
  const shadowTargetEl = document.getElementById('shadow-target-el');
  const shadowCssCode = document.getElementById('shadow-css-code');
  const btnCopyShadowCss = document.getElementById('btn-copy-shadow-css');

  const updateShadow = () => {
    if (!shadowX || !shadowTargetEl) return;
    const x = parseInt(shadowX.value, 10);
    const y = parseInt(shadowY.value, 10);
    const blur = parseInt(shadowBlur.value, 10);
    const spread = parseInt(shadowSpread.value, 10);
    const color = shadowColor.value;
    const opacity = parseFloat(shadowOpacity.value);
    const inset = shadowInset ? shadowInset.checked : false;

    const res = CSS_GENERATOR.generateBoxShadow(x, y, blur, spread, color, opacity, inset);
    shadowTargetEl.style.boxShadow = res.rule;
    if (shadowCssCode) shadowCssCode.textContent = res.cssCode;
  };

  [shadowX, shadowY, shadowBlur, shadowSpread, shadowColor, shadowOpacity, shadowInset].forEach(el => {
    if (el) el.addEventListener('input', updateShadow);
  });
  if (btnCopyShadowCss && shadowCssCode) {
    btnCopyShadowCss.addEventListener('click', () => copyToClipboard(shadowCssCode.textContent));
  }
  updateShadow();

  // 37. CLT VS PJ CALCULATOR
  const inputSalarioClt = document.getElementById('calc-salario-clt');
  const inputBeneficiosClt = document.getElementById('calc-beneficios-clt');
  const inputFatPj = document.getElementById('calc-faturamento-pj');
  const inputContadorPj = document.getElementById('calc-contador-pj');
  const btnCalcCltPj = document.getElementById('btn-calc-clt-pj');

  const cltLiqEl = document.getElementById('m-clt-liq');
  const cltInssEl = document.getElementById('m-clt-inss');
  const cltIrpfEl = document.getElementById('m-clt-irpf');
  const cltFgtsEl = document.getElementById('m-clt-fgts');
  const cltAnualEl = document.getElementById('m-clt-anual');

  const pjLiqEl = document.getElementById('m-pj-liq');
  const pjSimplesEl = document.getElementById('m-pj-simples');
  const pjProLaboreEl = document.getElementById('m-pj-prolabore');
  const pjAnualEl = document.getElementById('m-pj-anual');
  const verdictBanner = document.getElementById('clt-pj-verdict');

  if (btnCalcCltPj && inputSalarioClt) {
    const runCltPjCalc = () => {
      const sClt = parseFloat(inputSalarioClt.value) || 0;
      const bClt = parseFloat(inputBeneficiosClt ? inputBeneficiosClt.value : 0) || 0;
      let fPj = parseFloat(inputFatPj ? inputFatPj.value : 0);
      if (!fPj || fPj === 0) fPj = sClt * 1.5; // sugestão inteligente inicial
      if (inputFatPj && (!inputFatPj.value || inputFatPj.value == '0')) inputFatPj.value = fPj.toFixed(0);

      const cPj = parseFloat(inputContadorPj ? inputContadorPj.value : 150) || 150;

      const res = CLT_PJ_CALCULATOR.calculate(sClt, bClt, fPj, cPj);

      const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      if (cltLiqEl) cltLiqEl.textContent = fmt(res.clt.liquidoMensal);
      if (cltInssEl) cltInssEl.textContent = fmt(res.clt.inss);
      if (cltIrpfEl) cltIrpfEl.textContent = fmt(res.clt.irpf);
      if (cltFgtsEl) cltFgtsEl.textContent = fmt(res.clt.fgtsMensal);
      if (cltAnualEl) cltAnualEl.textContent = fmt(res.clt.totalAnual);

      if (pjLiqEl) pjLiqEl.textContent = fmt(res.pj.liquidoMensal);
      if (pjSimplesEl) pjSimplesEl.textContent = fmt(res.pj.impostoSimples);
      if (pjProLaboreEl) pjProLaboreEl.textContent = fmt(res.pj.proLabore);
      if (pjAnualEl) pjAnualEl.textContent = fmt(res.pj.totalAnual);

      if (verdictBanner) {
        const diff = Math.abs(res.comparativo.diferencaAnual);
        const melhor = res.comparativo.vantagem;
        verdictBanner.innerHTML = `
          <div>
            <strong style="color: var(--accent-emerald); font-size: 1.1rem;">Veredito: Opção ${melhor} é financeiramente mais vantajosa</strong>
            <p style="margin-top: 4px; font-size: 0.9rem; color: var(--text-secondary);">
              Diferença estimada de <strong>${fmt(diff)}</strong> a mais por ano (${fmt(diff / 12)}/mês). Para igualar a proposta CLT, o faturamento PJ ideal seria de aproximadamente <strong>${fmt(res.comparativo.pjEquivalente)}/mês</strong>.
            </p>
          </div>
        `;
      }
    };

    btnCalcCltPj.addEventListener('click', runCltPjCalc);
    runCltPjCalc();
  }

  // 38. STORAGE & TRANSFER CALC
  const inputStorageVal = document.getElementById('storage-val');
  const selectStorageUnit = document.getElementById('storage-unit');
  const inputStorageSpeed = document.getElementById('storage-speed');
  const btnCalcStorage = document.getElementById('btn-calc-storage');
  const storageResultsTbody = document.getElementById('storage-results-tbody');
  const storageTimeDisplay = document.getElementById('storage-time-display');

  if (btnCalcStorage && inputStorageVal) {
    const runStorageCalc = () => {
      const val = parseFloat(inputStorageVal.value) || 1;
      const unit = selectStorageUnit.value;
      const speed = parseFloat(inputStorageSpeed ? inputStorageSpeed.value : 100) || 100;

      const conv = STORAGE_CALC.convert(val, unit);
      const time = STORAGE_CALC.calculateTransferTime(val, unit, speed);

      if (storageTimeDisplay) {
        storageTimeDisplay.textContent = `Tempo estimado: ${time.formatted} (a ${speed} Mbps)`;
      }

      if (storageResultsTbody) {
        storageResultsTbody.innerHTML = `
          <tr><td>Bytes (B)</td><td>${conv.bytes.toLocaleString('pt-BR')} B</td></tr>
          <tr><td>Kilobytes (KB - 1000)</td><td>${conv.KB.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} KB</td></tr>
          <tr><td>Megabytes (MB - 1000)</td><td>${conv.MB.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} MB</td></tr>
          <tr><td>Gigabytes (GB - 1000)</td><td>${conv.GB.toLocaleString('pt-BR', { maximumFractionDigits: 4 })} GB</td></tr>
          <tr><td>Terabytes (TB - 1000)</td><td>${conv.TB.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} TB</td></tr>
          <tr style="border-top: 2px solid var(--border-subtle);"><td>Kibibytes (KiB - 1024)</td><td>${conv.KiB.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} KiB</td></tr>
          <tr><td>Mebibytes (MiB - 1024)</td><td>${conv.MiB.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} MiB</td></tr>
          <tr><td>Gibibytes (GiB - 1024)</td><td>${conv.GiB.toLocaleString('pt-BR', { maximumFractionDigits: 4 })} GiB</td></tr>
          <tr><td>Tebibytes (TiB - 1024)</td><td>${conv.TiB.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} TiB</td></tr>
        `;
      }
    };

    btnCalcStorage.addEventListener('click', runStorageCalc);
    runStorageCalc();
  }

  // 39. SVG OPTIMIZER & DATA URI
  const svgInput = document.getElementById('svg-input');
  const btnSvgOpt = document.getElementById('btn-svg-opt');
  const btnSvgCssUri = document.getElementById('btn-svg-css-uri');
  const btnSvgB64 = document.getElementById('btn-svg-b64');
  const svgOutput = document.getElementById('svg-output');
  const svgPreviewBox = document.getElementById('svg-preview-box');
  const btnCopySvgOutput = document.getElementById('btn-copy-svg-output');

  if (svgInput && svgOutput) {
    const updateSvgPreview = (code) => {
      if (svgPreviewBox) svgPreviewBox.innerHTML = code || svgInput.value;
    };

    if (btnSvgOpt) {
      btnSvgOpt.addEventListener('click', () => {
        const opt = SVG_TOOL.optimize(svgInput.value);
        svgOutput.value = opt;
        updateSvgPreview(opt);
        showToast('SVG Minificado!');
      });
    }
    if (btnSvgCssUri) {
      btnSvgCssUri.addEventListener('click', () => {
        svgOutput.value = SVG_TOOL.toCssDataUri(svgInput.value);
        showToast('Data URI CSS gerado!');
      });
    }
    if (btnSvgB64) {
      btnSvgB64.addEventListener('click', () => {
        svgOutput.value = SVG_TOOL.toBase64Uri(svgInput.value);
        showToast('Base64 URI gerado!');
      });
    }
    if (btnCopySvgOutput) {
      btnCopySvgOutput.addEventListener('click', () => copyToClipboard(svgOutput.value));
    }

    svgInput.value = SVG_TOOL.SAMPLE;
    updateSvgPreview(SVG_TOOL.SAMPLE);
  }

  // 40. MOCK DATA BATCH GENERATOR
  const inputMockQty = document.getElementById('mock-qty');
  const inputMockTable = document.getElementById('mock-table-name');
  const btnGenMock = document.getElementById('btn-gen-mock');
  const mockOutputDisplay = document.getElementById('mock-output-display');
  const btnMockJson = document.getElementById('btn-mock-json');
  const btnMockCsv = document.getElementById('btn-mock-csv');
  const btnMockSql = document.getElementById('btn-mock-sql');
  const btnCopyMock = document.getElementById('btn-copy-mock');

  if (btnGenMock && mockOutputDisplay) {
    let currentBatch = null;
    let currentFormat = 'json';

    const runGenBatch = () => {
      const qty = parseInt(inputMockQty ? inputMockQty.value : 10, 10) || 10;
      const tbl = inputMockTable ? inputMockTable.value : 'usuarios';
      currentBatch = MOCK_DATA_TOOL.generateBatch(qty, tbl);
      renderMockFormat();
    };

    const renderMockFormat = () => {
      if (!currentBatch) return;
      if (currentFormat === 'json') mockOutputDisplay.value = currentBatch.toJSON();
      else if (currentFormat === 'csv') mockOutputDisplay.value = currentBatch.toCSV();
      else if (currentFormat === 'sql') mockOutputDisplay.value = currentBatch.toSQL();
    };

    btnGenMock.addEventListener('click', runGenBatch);
    if (btnMockJson) btnMockJson.addEventListener('click', () => { currentFormat = 'json'; renderMockFormat(); });
    if (btnMockCsv) btnMockCsv.addEventListener('click', () => { currentFormat = 'csv'; renderMockFormat(); });
    if (btnMockSql) btnMockSql.addEventListener('click', () => { currentFormat = 'sql'; renderMockFormat(); });
    if (btnCopyMock) btnCopyMock.addEventListener('click', () => copyToClipboard(mockOutputDisplay.value));

    runGenBatch();
  }
}

// ========================
// FAQ ACCORDION
// ========================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isVisible = answer.style.display === 'block';
      answer.style.display = isVisible ? 'none' : 'block';
    });
  });
}

// ========================
// UTILITÁRIOS & TOAST
// ========================
function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copiado para a área de transferência! ✨');
  }).catch(() => {
    showToast('Falha ao copiar texto.');
  });
}

window.copyToClipboard = copyToClipboard;

function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 2500);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ========================
// CONSENTIMENTO DE COOKIES (LGPD / GOOGLE ADSENSE)
// ========================
function initCookieConsent() {
  const banner = document.getElementById('cookie-consent-banner');
  const btnAccept = document.getElementById('btn-cookie-accept-all');
  const btnEssential = document.getElementById('btn-cookie-essential');

  if (!banner) return;

  const consent = localStorage.getItem('caixadodev_cookie_consent');
  if (!consent) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 800);
  }

  const closeBanner = (type) => {
    localStorage.setItem('caixadodev_cookie_consent', type);
    banner.classList.remove('show');
  };

  if (btnAccept) btnAccept.addEventListener('click', () => closeBanner('all'));
  if (btnEssential) btnEssential.addEventListener('click', () => closeBanner('essential'));
}

