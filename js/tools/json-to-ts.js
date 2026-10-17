/**
 * Ferramenta: Conversor de JSON para TypeScript
 * Gera interfaces ou types em TypeScript a partir de qualquer estrutura JSON
 */

const JSON_TO_TS = {
  convert(jsonString, rootName = 'RootObject', useType = false) {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    if (!jsonString || !jsonString.trim()) {
      return { success: false, error: isEn ? 'Please enter valid JSON code.' : 'Insira um código JSON válido.' };
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      return { success: false, error: (isEn ? 'Invalid JSON: ' : 'JSON inválido: ') + err.message };
    }

    const interfaces = new Map();

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const getType = (val, keyName) => {
      if (val === null) return 'any';
      if (typeof val === 'string') return 'string';
      if (typeof val === 'number') return 'number';
      if (typeof val === 'boolean') return 'boolean';

      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        const firstItem = val[0];
        const itemType = getType(firstItem, `${keyName}Item`);
        return `${itemType}[]`;
      }

      if (typeof val === 'object') {
        const interfaceName = capitalize(keyName);
        generateInterface(val, interfaceName);
        return interfaceName;
      }

      return 'any';
    };

    const generateInterface = (obj, name) => {
      if (interfaces.has(name)) return;
      
      const fields = [];
      for (const [key, val] of Object.entries(obj)) {
        const type = getType(val, key);
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        fields.push(`  ${safeKey}: ${type};`);
      }

      const declaration = useType
        ? `export type ${name} = {\n${fields.join('\n')}\n};`
        : `export interface ${name} {\n${fields.join('\n')}\n}`;

      interfaces.set(name, declaration);
    };

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null) {
        generateInterface(parsed[0], rootName);
      } else {
        return { success: true, code: `export type ${rootName} = ${getType(parsed, 'Item')};` };
      }
    } else if (typeof parsed === 'object' && parsed !== null) {
      generateInterface(parsed, rootName);
    } else {
      return { success: true, code: `export type ${rootName} = ${typeof parsed};` };
    }

    const allCode = Array.from(interfaces.values()).reverse().join('\n\n');
    return { success: true, code: allCode };
  },

  getSample() {
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
    if (isEn) {
      return JSON.stringify({
        userId: 1042,
        name: "Alexandre Marcelino",
        email: "alexandre@example.com",
        isActive: true,
        profile: {
          title: "Principal Software Engineer",
          skills: ["JavaScript", "TypeScript", "Node.js", "Python"],
          yearsOfExperience: 8
        },
        projects: [
          {
            id: "proj-01",
            name: "Caixa do Dev",
            version: "2.0",
            isOpenSource: true
          }
        ]
      }, null, 2);
    }

    return JSON.stringify({
      usuario_id: 1042,
      nome: "Alexandre Marcelino",
      email: "alexandre@exemplo.com",
      ativo: true,
      perfil: {
        cargo: "Engenheiro de Software",
        skills: ["JavaScript", "TypeScript", "Node.js", "Python"],
        anos_experiencia: 8
      },
      projetos: [
        {
          id: "proj-01",
          nome: "Caixa do Dev",
          versao: "2.0"
        }
      ]
    }, null, 2);
  }
};

if (typeof window !== 'undefined') {
  window.JSON_TO_TS = JSON_TO_TS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JSON_TO_TS;
}
