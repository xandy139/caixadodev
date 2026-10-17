/**
 * Ferramenta: Inspetor e Decompositor de URL e Query Params
 * Decompõe URLs completas em componentes estruturados e tabela interativa de parâmetros
 */

const URL_PARSER = {
  get SAMPLE() {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    if (isEn) {
      return 'https://api.example.com:8080/v2/products/search?category=laptops&max_price=1200&sort=asc&utm_source=google_ads&utm_campaign=summer_sale#results';
    }
    return 'https://api.lojaexemplo.com.br:8080/v2/produtos/busca?categoria=notebooks&preco_max=4500.50&ordenar=menor_preco&utm_source=google_ads&utm_campaign=black_friday#produtos-lista';
  },

  parse(urlString) {
    if (!urlString) return null;
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    try {
      let raw = urlString.trim();
      if (!/^https?:\/\//i.test(raw)) {
        raw = 'https://' + raw;
      }

      const u = new URL(raw);
      const params = [];
      u.searchParams.forEach((val, key) => {
        params.push({ key, value: val });
      });

      return {
        success: true,
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? '443' : '80'),
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        origin: u.origin,
        params
      };
    } catch (e) {
      return {
        success: false,
        message: isEn ? 'Invalid URL. Please verify the format.' : 'URL inválida. Verifique o formato inserido.'
      };
    }
  },

  build(protocol, hostname, port, pathname, params, hash) {
    try {
      let portStr = '';
      if (port && port !== '80' && port !== '443') {
        portStr = `:${port}`;
      }
      let base = `${protocol}//${hostname}${portStr}${pathname.startsWith('/') ? pathname : '/' + pathname}`;
      
      const searchParams = new URLSearchParams();
      (params || []).forEach(p => {
        if (p.key && p.key.trim()) {
          searchParams.append(p.key.trim(), p.value || '');
        }
      });

      const qs = searchParams.toString();
      if (qs) base += `?${qs}`;

      if (hash) {
        base += hash.startsWith('#') ? hash : `#${hash}`;
      }

      return base;
    } catch (e) {
      return '';
    }
  }
};

window.URL_PARSER = URL_PARSER;
