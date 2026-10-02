import { ref } from 'vue';
import { api } from 'boot/axios';
import { Boleto } from 'src/utils/boletos';

export interface AlunoAdmin {
  nome: string;
  cpf: string;
  email: string;
  curso: string;
  numero: string;
  endereco?: string;
  rotaId?: string | null;
}

export interface Presenca {
  cpf: string;
  nome: string;
  rotaId: string;
  rotaNome: string;
  em: Date;
}

export const hora = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

// AAAA-MM-DD no fuso do navegador (o mesmo dia que o admin vê no calendário).
export const isoDia = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Presenças de um dia, indexadas por CPF. Sem data, o backend usa o dia de hoje.
export function usePresencas() {
  const presencas = ref(new Map<string, Presenca>());
  const carregando = ref(true);
  const erro = ref(false);
  async function carregar(data?: string) {
    carregando.value = true;
    erro.value = false;
    try {
      const { data: res } = await api.get('/checkin/presencas', { params: data ? { data } : {} });
      presencas.value = new Map(
        (res.presencas as (Omit<Presenca, 'em'> & { checkinEm: string | null })[]).map((p) => [
          p.cpf,
          { ...p, em: new Date(p.checkinEm ?? 0) },
        ])
      );
    } catch {
      erro.value = true;
    } finally {
      carregando.value = false;
    }
  }
  return { presencas, carregando, erro, carregar };
}

export function useAlunos() {
  const alunos = ref<AlunoAdmin[]>([]);
  const carregando = ref(true);
  const erro = ref(false);
  async function carregar() {
    carregando.value = true;
    erro.value = false;
    try {
      const { data } = await api.get('/alunos');
      alunos.value = (data as AlunoAdmin[]).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    } catch {
      erro.value = true;
    } finally {
      carregando.value = false;
    }
  }
  return { alunos, carregando, erro, carregar };
}

export function useBoletos() {
  const boletos = ref<Boleto[]>([]);
  const carregando = ref(true);
  const erro = ref(false);
  async function carregar() {
    carregando.value = true;
    erro.value = false;
    try {
      const { data } = await api.get('/boletos');
      boletos.value = Array.isArray(data) ? data : [];
    } catch {
      erro.value = true;
    } finally {
      carregando.value = false;
    }
  }
  return { boletos, carregando, erro, carregar };
}

// Mensagem de erro da API (express-validator ou { message }) para mostrar ao usuário
export function mensagemDeErro(e: unknown, padrao: string): string {
  const data = (e as { response?: { data?: unknown } }).response?.data;
  if (typeof data === 'string' && data) return data;
  if (data && typeof data === 'object') {
    const d = data as { message?: string; errors?: { msg: string }[] };
    return d.errors?.[0]?.msg || d.message || padrao;
  }
  return padrao;
}
