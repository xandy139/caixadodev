/**
 * Ferramenta: Conversor de JSON para TypeScript
 * Gera interfaces ou types em TypeScript a partir de qualquer estrutura JSON
 */

const JSON_TO_TS = {
  convert(jsonString, rootName = 'RootObject', useType = false) {
    if (!jsonString || !jsonString.trim()) {
      return { success: false, error: 'Insira um código JSON válido.' };
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      return { success: false, error: 'JSON inválido: ' + err.message };
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
        fields.push(`  ${key}: ${type};`);
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
    return JSON.stringify({
      id: 1042,
      nome: "Alexandre Silva",
      ativo: true,
      perfil: {
        cargo: "Tech Lead",
        salario: 14500.50,
        tags: ["TypeScript", "Node.js", "Docker"]
      },
      projetos: [
        {
          id: "proj-1",
          titulo: "Caixa do Dev",
          concluido: false
        }
      ]
    }, null, 2);
  }
};

window.JSON_TO_TS = JSON_TO_TS;
