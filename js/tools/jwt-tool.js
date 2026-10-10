/**
 * Ferramenta: Decodificador Seguro de JWT (JSON Web Token)
 * Decodificação 100% no cliente sem enviar o token para nenhum servidor
 */

const JWT_TOOL = {
  decode(token) {
    if (!token || !token.trim()) {
      return { success: false, error: 'Cole um token JWT para decodificar.' };
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { 
        success: false, 
        error: `Estrutura de token inválida. Um JWT deve conter exatamente 3 partes separadas por ponto (Header.Payload.Signature). Foram encontradas ${parts.length} partes.` 
      };
    }

    try {
      const headerStr = this.base64UrlDecode(parts[0]);
      const payloadStr = this.base64UrlDecode(parts[1]);

      const header = JSON.parse(headerStr);
      const payload = JSON.parse(payloadStr);

      const expInfo = this.checkExpiration(payload);

      return {
        success: true,
        header,
        payload,
        signature: parts[2],
        expiration: expInfo
      };
    } catch (err) {
      return { success: false, error: `Falha ao decodificar partes do token: ${err.message}` };
    }
  },

  base64UrlDecode(str) {
    // Normalizar base64url para base64 padrão
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    // Suporte a UTF-8
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  },

  checkExpiration(payload) {
    if (!payload.exp) return { hasExp: false };

    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    const isExpired = now > expDate;

    return {
      hasExp: true,
      expTimestamp: payload.exp,
      expDateFormatted: expDate.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      expUtcFormatted: expDate.toUTCString(),
      isExpired,
      statusLabel: isExpired ? 'Expirado' : 'Ativo e Válido'
    };
  },

  getSample() {
    // Token de exemplo (alg: HS256, typ: JWT)
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibm9tZSI6IlJvZHJpZ28gU2lsdmEiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiZW1haWwiOiJkZXZAY2FpeGFkb2Rldi5jb20uYnIiLCJpYXQiOjE3MDQxNTM2MDAsImV4cCI6MjA4Mzg0OTYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  }
};

window.JWT_TOOL = JWT_TOOL;
