/**
 * Ferramenta: Formatador e Minificador de SQL
 * Suporte a dialetos padrão ANSI, PostgreSQL, MySQL e SQL Server
 */

const SQL_FORMATTER = {
  format(sql, options = { uppercase: true, indent: '  ' }) {
    if (!sql || !sql.trim()) return '';

    let text = sql.trim();

    // Palavras-chave principais que começam uma nova linha
    const majorKeywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'HAVING', 'GROUP BY', 'ORDER BY',
      'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
      'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'UNION', 'UNION ALL',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
      'ALTER TABLE', 'DROP TABLE', 'TRUNCATE TABLE', 'CASE', 'WHEN', 'THEN',
      'ELSE', 'END', 'AS', 'IN', 'EXISTS', 'NOT EXISTS', 'LIKE', 'BETWEEN'
    ];

    // Regex para identificar strings literais e não formatá-las por engano
    const strings = [];
    text = text.replace(/'(?:''|[^'])*'/g, (match) => {
      strings.push(match);
      return `__SQL_STR_${strings.length - 1}__`;
    });

    // Normalizar espaços
    text = text.replace(/\s+/g, ' ');

    // Uppercase ou Lowercase nas palavras-chave
    majorKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      text = text.replace(regex, options.uppercase ? kw.toUpperCase() : kw.toLowerCase());
    });

    // Quebra de linha antes das cláusulas principais
    const breakKeywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN',
      'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'
    ];

    breakKeywords.forEach((kw) => {
      const regex = new RegExp(`\\s*\\b(${kw})\\b\\s*`, 'gi');
      text = text.replace(regex, `\n$1 `);
    });

    // Quebra de linha para AND / OR dentro de WHERE
    text = text.replace(/\s*\b(AND|OR)\b\s*/gi, `\n${options.indent}$1 `);

    // Ajustar vírgulas na lista de colunas do SELECT
    text = text.replace(/,\s*/g, `,\n${options.indent}`);

    // Indentar linhas secundárias
    const lines = text.split('\n');
    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      const isMajor = breakKeywords.some(kw => trimmed.toUpperCase().startsWith(kw.toUpperCase()));
      if (isMajor) return trimmed;
      if (trimmed.toUpperCase().startsWith('AND') || trimmed.toUpperCase().startsWith('OR')) {
        return `${options.indent}${trimmed}`;
      }
      return `${options.indent}${trimmed}`;
    });

    let result = formattedLines.filter(l => l.length > 0).join('\n');

    // Restaurar strings literais preservadas
    strings.forEach((str, idx) => {
      result = result.replace(`__SQL_STR_${idx}__`, str);
    });

    return result;
  },

  minify(sql) {
    if (!sql || !sql.trim()) return '';
    let text = sql.trim();
    // Remover comentários de linha (-- ...)
    text = text.replace(/--.*$/gm, '');
    // Remover comentários de bloco (/* ... */)
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    // Colapsar espaços
    return text.replace(/\s+/g, ' ').trim();
  },

  getSample() {
    return "select u.id, u.nome, u.email, count(p.id) as total_pedidos, sum(p.valor_total) as receita from usuarios u left join pedidos p on p.usuario_id = u.id where u.ativo = 1 and p.status in ('pago', 'enviado') group by u.id, u.nome, u.email having total_pedidos > 2 order by receita desc limit 50;";
  }
};

window.SQL_FORMATTER = SQL_FORMATTER;
