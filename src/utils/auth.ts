interface TokenPayload {
  role?: 'admin' | 'aluno';
  exp?: number;
  [key: string]: unknown;
}

// Lê o payload do JWT sem validar assinatura — só pra decidir navegação no cliente.
// A validação de verdade (assinatura + expiração) sempre acontece no backend.
function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function getRole(): 'admin' | 'aluno' | null {
  const token = getToken();
  if (!token) return null;
  const payload = decodeToken(token);
  return payload?.role === 'admin' ? 'admin' : payload ? 'aluno' : null;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('aluno');
}
