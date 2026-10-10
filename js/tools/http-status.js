/**
 * Ferramenta: Catálogo e Guia de Códigos de Status HTTP
 * Tabela interativa com busca, filtros por família (1xx, 2xx, 3xx, 4xx, 5xx) e casos de uso em APIs REST
 */

const HTTP_STATUS_TOOL = {
  codes: [
    // 2xx Success
    { code: 200, phrase: 'OK', category: '2xx', desc: 'Requisição processada com sucesso. Resposta padrão para GET, PUT ou POST com retorno.' },
    { code: 201, phrase: 'Created', category: '2xx', desc: 'Recurso criado com sucesso no servidor. Usado como resposta de POST na criação de entidades.' },
    { code: 202, phrase: 'Accepted', category: '2xx', desc: 'Requisição aceita para processamento assíncrono (ex: fila ou job em background).' },
    { code: 204, phrase: 'No Content', category: '2xx', desc: 'Sucesso, mas sem corpo de resposta para retornar. Típico de operações DELETE com sucesso.' },
    
    // 3xx Redirection
    { code: 301, phrase: 'Moved Permanently', category: '3xx', desc: 'A URL solicitada mudou de endereço permanentemente. Mecanismos de busca atualizam o link.' },
    { code: 302, phrase: 'Found', category: '3xx', desc: 'Redirecionamento temporário para outra URI.' },
    { code: 304, phrase: 'Not Modified', category: '3xx', desc: 'O recurso não foi modificado desde a última requisição (usado para cache via ETag / If-Modified-Since).' },

    // 4xx Client Error
    { code: 400, phrase: 'Bad Request', category: '4xx', desc: 'Requisição inválida. Parâmetros ausentes, JSON corrompido ou validação de schema falhou.' },
    { code: 401, phrase: 'Unauthorized', category: '4xx', desc: 'Autenticação necessária. Token JWT ausente, expirado ou credenciais inválidas.' },
    { code: 403, phrase: 'Forbidden', category: '4xx', desc: 'O servidor entendeu quem você é, mas seu usuário não tem permissão para acessar este recurso.' },
    { code: 404, phrase: 'Not Found', category: '4xx', desc: 'O recurso ou endpoint solicitado não foi encontrado no servidor.' },
    { code: 405, phrase: 'Method Not Allowed', category: '4xx', desc: 'O método HTTP utilizado (ex: POST) não é permitido na rota solicitada.' },
    { code: 408, phrase: 'Request Timeout', category: '4xx', desc: 'O servidor esgotou o tempo de espera pela requisição do cliente.' },
    { code: 409, phrase: 'Conflict', category: '4xx', desc: 'Conflito de estado no servidor (ex: tentativa de cadastrar um e-mail já existente).' },
    { code: 422, phrase: 'Unprocessable Entity', category: '4xx', desc: 'Sintaxe válida, mas erros semânticos nos campos enviados (muito comum em frameworks modernos como Laravel e NestJS).' },
    { code: 429, phrase: 'Too Many Requests', category: '4xx', desc: 'Limite de taxa excedido (Rate Limit). O cliente fez muitas requisições em pouco tempo.' },

    // 5xx Server Error
    { code: 500, phrase: 'Internal Server Error', category: '5xx', desc: 'Erro genérico e inesperado no servidor (exceção não tratada no backend).' },
    { code: 502, phrase: 'Bad Gateway', category: '5xx', desc: 'O servidor proxy/gateway (ex: Nginx) recebeu uma resposta inválida do serviço upstream (Node/Python/PHP).' },
    { code: 503, phrase: 'Service Unavailable', category: '5xx', desc: 'O servidor está temporariamente indisponível por sobrecarga ou manutenção programada.' },
    { code: 504, phrase: 'Gateway Timeout', category: '5xx', desc: 'O proxy reverso esgotou o tempo esperando a resposta da aplicação interna.' }
  ],

  filter(query = '', category = 'all') {
    const q = query.toLowerCase().trim();
    return this.codes.filter(c => {
      const matchCat = category === 'all' || c.category === category;
      const matchQ = !q || String(c.code).includes(q) || c.phrase.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }
};

window.HTTP_STATUS_TOOL = HTTP_STATUS_TOOL;
