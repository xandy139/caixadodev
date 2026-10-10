/**
 * Ferramenta: Conversor JSON <> CSV
 * Conversão bidirecional com tratamento de delimitadores e escape de strings
 */

const JSON_CSV_TOOL = {
  jsonToCsv(jsonString, delimiter = ',') {
    if (!jsonString || !jsonString.trim()) {
      return { success: false, error: 'Insira um JSON válido.' };
    }

    try {
      let data = JSON.parse(jsonString);
      if (!Array.isArray(data)) {
        if (typeof data === 'object' && data !== null) {
          data = [data]; // Objeto único vira array de 1 linha
        } else {
          return { success: false, error: 'O JSON deve ser um array de objetos para ser convertido em CSV.' };
        }
      }

      if (data.length === 0) {
        return { success: true, csv: '' };
      }

      // Extrair todas as chaves (headers)
      const headers = Array.from(new Set(data.flatMap(item => Object.keys(item))));

      const escapeCell = (val) => {
        if (val === null || val === undefined) return '';
        let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
          str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = [
        headers.join(delimiter),
        ...data.map(item => headers.map(h => escapeCell(item[h])).join(delimiter))
      ];

      return { success: true, csv: rows.join('\n') };
    } catch (err) {
      return { success: false, error: 'Erro ao converter JSON para CSV: ' + err.message };
    }
  },

  csvToJson(csvString, delimiter = ',') {
    if (!csvString || !csvString.trim()) {
      return { success: false, error: 'Insira um texto CSV válido.' };
    }

    try {
      const lines = csvString.trim().split(/\r?\n/);
      if (lines.length < 2) {
        return { success: false, error: 'O CSV precisa ter pelo menos 1 linha de cabeçalho e 1 linha de dados.' };
      }

      // Parser simples de linha CSV respeitando aspas
      const parseLine = (line) => {
        const values = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
            insideQuotes = !insideQuotes;
          } else if (char === delimiter && !insideQuotes) {
            values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        return values;
      };

      const headers = parseLine(lines[0]);
      const jsonList = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const vals = parseLine(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => {
          let v = vals[idx] !== undefined ? vals[idx] : null;
          // Tentar converter números/booleanos
          if (v === 'true') v = true;
          else if (v === 'false') v = false;
          else if (!isNaN(Number(v)) && v !== '') v = Number(v);
          obj[h] = v;
        });
        jsonList.push(obj);
      }

      return { success: true, json: JSON.stringify(jsonList, null, 2) };
    } catch (err) {
      return { success: false, error: 'Erro ao converter CSV para JSON: ' + err.message };
    }
  },

  getSampleJson() {
    return JSON.stringify([
      { id: 1, nome: "Ana Santos", cargo: "Desenvolvedora Frontend", salario: 8500 },
      { id: 2, nome: "Carlos Lima", cargo: "Engenheiro DevOps", salario: 12000 },
      { id: 3, nome: "Beatriz Rocha", cargo: "Product Manager", salario: 14000 }
    ], null, 2);
  }
};

window.JSON_CSV_TOOL = JSON_CSV_TOOL;
