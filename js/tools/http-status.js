/**
 * Ferramenta: Catálogo e Guia de Códigos de Status HTTP
 * Tabela interativa com busca, filtros por família (1xx, 2xx, 3xx, 4xx, 5xx) e casos de uso em APIs REST
 */

const HTTP_STATUS_TOOL = {
  codes: [
    // 2xx Success
    { code: 200, phrase: 'OK', category: '2xx', 
      desc: 'Requisição processada com sucesso. Resposta padrão para GET, PUT ou POST com retorno.',
      descEn: 'Standard response for successful HTTP requests. Default response for successful GET, PUT, or POST payloads.' },
    { code: 201, phrase: 'Created', category: '2xx', 
      desc: 'Recurso criado com sucesso no servidor. Usado como resposta de POST na criação de entidades.',
      descEn: 'The request succeeded and a new resource was created on the server. Standard response for entity creation POST requests.' },
    { code: 202, phrase: 'Accepted', category: '2xx', 
      desc: 'Requisição aceita para processamento assíncrono (ex: fila ou job em background).',
      descEn: 'The request has been accepted for processing, but processing has not been completed (typical for async queues and background jobs).' },
    { code: 204, phrase: 'No Content', category: '2xx', 
      desc: 'Sucesso, mas sem corpo de resposta para retornar. Típico de operações DELETE com sucesso.',
      descEn: 'The server successfully processed the request and is not returning any content. Typical for successful DELETE operations.' },
    
    // 3xx Redirection
    { code: 301, phrase: 'Moved Permanently', category: '3xx', 
      desc: 'A URL solicitada mudou de endereço permanentemente. Mecanismos de busca atualizam o link.',
      descEn: 'The requested resource has been assigned a new permanent URI. Search engines automatically update bookmarks and backlinks.' },
    { code: 302, phrase: 'Found', category: '3xx', 
      desc: 'Redirecionamento temporário para outra URI.',
      descEn: 'The target resource resides temporarily under a different URI. Browsers redirect without updating index bookmarks.' },
    { code: 304, phrase: 'Not Modified', category: '3xx', 
      desc: 'O recurso não foi modificado desde a última requisição (usado para cache via ETag / If-Modified-Since).',
      descEn: 'Indicates the client already has the latest cached version (validated via ETag or If-Modified-Since headers).' },

    // 4xx Client Error
    { code: 400, phrase: 'Bad Request', category: '4xx', 
      desc: 'Requisição inválida. Parâmetros ausentes, JSON corrompido ou validação de schema falhou.',
      descEn: 'The server cannot process the request due to apparent client error (malformed JSON syntax, invalid query parameters, or schema validation failure).' },
    { code: 401, phrase: 'Unauthorized', category: '4xx', 
      desc: 'Autenticação necessária. Token JWT ausente, expirado ou credenciais inválidas.',
      descEn: 'Authentication is required. Access token (Bearer JWT) is missing, expired, or credentials are invalid.' },
    { code: 403, phrase: 'Forbidden', category: '4xx', 
      desc: 'O servidor entendeu quem você é, mas seu usuário não tem permissão para acessar este recurso.',
      descEn: 'The client is authenticated, but lacks sufficient authorization or role permissions to access the requested resource.' },
    { code: 404, phrase: 'Not Found', category: '4xx', 
      desc: 'O recurso ou endpoint solicitado não foi encontrado no servidor.',
      descEn: 'The requested resource or endpoint could not be found on the server.' },
    { code: 405, phrase: 'Method Not Allowed', category: '4xx', 
      desc: 'O método HTTP utilizado (ex: POST) não é permitido na rota solicitada.',
      descEn: 'The request HTTP method (e.g. POST) is not supported for the target route.' },
    { code: 408, phrase: 'Request Timeout', category: '4xx', 
      desc: 'O servidor esgotou o tempo de espera pela requisição do cliente.',
      descEn: 'The server timed out waiting for the request from the client.' },
    { code: 409, phrase: 'Conflict', category: '4xx', 
      desc: 'Conflito de estado no servidor (ex: tentativa de cadastrar um e-mail já existente).',
      descEn: 'Request conflicts with the current state of the target resource (e.g., duplicate unique constraint violation like email already registered).' },
    { code: 422, phrase: 'Unprocessable Entity', category: '4xx', 
      desc: 'Sintaxe válida, mas erros semânticos nos campos enviados (muito comum em frameworks modernos como Laravel e NestJS).',
      descEn: 'The request syntax is valid, but semantic validation failed on specific fields (standard in modern frameworks like NestJS, Laravel, FastAPI).' },
    { code: 429, phrase: 'Too Many Requests', category: '4xx', 
      desc: 'Limite de taxa excedido (Rate Limit). O cliente fez muitas requisições em pouco tempo.',
      descEn: 'The client has exceeded the API rate limit quota. Often accompanied by Retry-After header.' },

    // 5xx Server Error
    { code: 500, phrase: 'Internal Server Error', category: '5xx', 
      desc: 'Erro genérico e inesperado no servidor (exceção não tratada no backend).',
      descEn: 'Generic server error indicating an unhandled exception or crash inside the backend application.' },
    { code: 502, phrase: 'Bad Gateway', category: '5xx', 
      desc: 'O servidor proxy/gateway (ex: Nginx) recebeu uma resposta inválida do serviço upstream (Node/Python/PHP).',
      descEn: 'The proxy or edge gateway (e.g. Cloudflare, Nginx) received an invalid response from the upstream application server.' },
    { code: 503, phrase: 'Service Unavailable', category: '5xx', 
      desc: 'O servidor está temporariamente indisponível por sobrecarga ou manutenção programada.',
      descEn: 'The server is currently unable to handle the request due to maintenance, cold starts, or temporary system overload.' },
    { code: 504, phrase: 'Gateway Timeout', category: '5xx', 
      desc: 'O proxy reverso esgotou o tempo esperando a resposta da aplicação interna.',
      descEn: 'The reverse proxy gateway did not receive a timely response from the internal upstream microservice.' }
  ],

  filter(query = '', category = 'all') {
    const q = query.toLowerCase().trim();
    return this.codes.filter(c => {
      const matchCat = category === 'all' || c.category === category;
      const matchQ = !q || String(c.code).includes(q) || c.phrase.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || (c.descEn && c.descEn.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }
};

window.HTTP_STATUS_TOOL = HTTP_STATUS_TOOL;
