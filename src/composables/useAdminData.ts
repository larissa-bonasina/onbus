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
  checkedIn?: boolean;
  checkinTime?: { _seconds: number } | null;
}

// O backend guarda só o último check-in de cada aluno; "presente" = check-in feito hoje.
export function checkinDeHoje(a: AlunoAdmin, hoje = new Date()): Date | null {
  const ts = a.checkinTime?._seconds;
  if (!a.checkedIn || !ts) return null;
  const d = new Date(ts * 1000);
  return d.toDateString() === hoje.toDateString() ? d : null;
}

export const hora = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

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
