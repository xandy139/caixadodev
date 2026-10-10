/**
 * Ferramenta: Conversor de comandos cURL
 * Converte comandos cURL para JavaScript (fetch / axios), Python (requests) e PHP
 */

const CURL_CONVERTER = {
  SAMPLE: `curl -X POST https://api.exemplo.com/v1/usuarios \\
  -H "Authorization: Bearer token_secreto_123" \\
  -H "Content-Type: application/json" \\
  -d '{"nome": "João Silva", "email": "joao@email.com", "ativo": true}'`,

  parse(curlString) {
    if (!curlString) return null;
    let clean = curlString.replace(/\\\r?\n/g, ' ').trim();

    // Remove comando curl inicial
    if (clean.startsWith('curl')) {
      clean = clean.substring(4).trim();
    }

    let method = 'GET';
    let url = '';
    const headers = {};
    let data = null;

    // Detectar Método (-X ou --request)
    const methodMatch = clean.match(/(?:-X|--request)\s+([A-Z]+)/i);
    if (methodMatch) {
      method = methodMatch[1].toUpperCase();
    }

    // Detectar URL (procura primeira url http/https ou entre aspas)
    const urlMatch = clean.match(/(?:['"])(https?:\/\/[^'"]+)(?:['"])|(?:^|\s)(https?:\/\/[^\s]+)/i);
    if (urlMatch) {
      url = urlMatch[1] || urlMatch[2];
    }

    // Detectar Headers (-H ou --header)
    const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
    let hMatch;
    while ((hMatch = headerRegex.exec(clean)) !== null) {
      const parts = hMatch[1].split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        headers[key] = val;
      }
    }

    // Detectar Dados / Body (-d, --data, --data-raw)
    const dataMatch = clean.match(/(?:-d|--data|--data-raw)\s+['"]([\s\S]*?)['"](?:\s|$)/);
    if (dataMatch) {
      data = dataMatch[1];
      if (method === 'GET') method = 'POST'; // curl assume POST quando -d é passado
    }

    return { url: url || 'https://api.exemplo.com/endpoint', method, headers, data };
  },

  toFetch(parsed) {
    const { url, method, headers, data } = parsed;
    const hasHeaders = Object.keys(headers).length > 0;

    let code = `const options = {\n  method: '${method}',\n`;
    if (hasHeaders) {
      code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},\n`;
    }
    if (data) {
      // Se for JSON válido, formata
      try {
        const json = JSON.parse(data);
        code += `  body: JSON.stringify(${JSON.stringify(json, null, 4).replace(/\n/g, '\n  ')}),\n`;
      } catch (e) {
        code += `  body: ${JSON.stringify(data)},\n`;
      }
    }
    code += `};\n\n`;
    code += `fetch('${url}', options)\n`;
    code += `  .then(res => res.json())\n`;
    code += `  .then(data => console.log(data))\n`;
    code += `  .catch(err => console.error('Erro na requisição:', err));`;

    return code;
  },

  toAxios(parsed) {
    const { url, method, headers, data } = parsed;
    let code = `import axios from 'axios';\n\n`;
    code += `const config = {\n`;
    code += `  method: '${method.toLowerCase()}',\n`;
    code += `  url: '${url}',\n`;

    if (Object.keys(headers).length > 0) {
      code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},\n`;
    }

    if (data) {
      try {
        const json = JSON.parse(data);
        code += `  data: ${JSON.stringify(json, null, 4).replace(/\n/g, '\n  ')},\n`;
      } catch (e) {
        code += `  data: ${JSON.stringify(data)},\n`;
      }
    }

    code += `};\n\n`;
    code += `axios(config)\n`;
    code += `  .then(response => {\n    console.log(response.data);\n  })\n`;
    code += `  .catch(error => {\n    console.error(error);\n  });`;

    return code;
  },

  toPython(parsed) {
    const { url, method, headers, data } = parsed;
    let code = `import requests\n\n`;
    code += `url = "${url}"\n\n`;

    if (Object.keys(headers).length > 0) {
      code += `headers = ${JSON.stringify(headers, null, 4)}\n\n`;
    }

    if (data) {
      try {
        const json = JSON.parse(data);
        code += `payload = ${JSON.stringify(json, null, 4).replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None')}\n\n`;
        code += `response = requests.${method.toLowerCase()}(\n    url,\n`;
        if (Object.keys(headers).length > 0) code += `    headers=headers,\n`;
        code += `    json=payload\n)\n\n`;
      } catch (e) {
        code += `payload = """${data}"""\n\n`;
        code += `response = requests.${method.toLowerCase()}(\n    url,\n`;
        if (Object.keys(headers).length > 0) code += `    headers=headers,\n`;
        code += `    data=payload\n)\n\n`;
      }
    } else {
      code += `response = requests.${method.toLowerCase()}(url${Object.keys(headers).length > 0 ? ', headers=headers' : ''})\n\n`;
    }

    code += `print("Status:", response.status_code)\nprint(response.json())`;
    return code;
  },

  toPhp(parsed) {
    const { url, method, headers, data } = parsed;
    let code = `<?php\n\n$curl = curl_init();\n\n`;
    code += `$headers = [\n`;
    Object.entries(headers).forEach(([k, v]) => {
      code += `    "${k}: ${v}",\n`;
    });
    code += `];\n\n`;

    code += `curl_setopt_array($curl, [\n`;
    code += `    CURLOPT_URL => "${url}",\n`;
    code += `    CURLOPT_RETURNTRANSFER => true,\n`;
    code += `    CURLOPT_CUSTOMREQUEST => "${method}",\n`;
    if (Object.keys(headers).length > 0) {
      code += `    CURLOPT_HTTPHEADER => $headers,\n`;
    }
    if (data) {
      code += `    CURLOPT_POSTFIELDS => '${data.replace(/'/g, "\\'")}',\n`;
    }
    code += `]);\n\n`;
    code += `$response = curl_exec($curl);\n`;
    code += `curl_close($curl);\n\n`;
    code += `echo $response;\n`;

    return code;
  }
};

window.CURL_CONVERTER = CURL_CONVERTER;
