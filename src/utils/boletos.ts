export interface Boleto {
  id: string;
  aluno: string;
  valor: string | number;
  vencimento: string | null; // "dd/mm/aaaa", como o backend devolve
  mes: number;
  ano: number;
  codigo_barras: string;
  status: string;
}

export type StatusBoleto = 'pago' | 'vencido' | 'aberto';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function dataVencimento(b: Boleto): Date | null {
  const m = b.vencimento?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])) : null;
}

// O banco guarda "Em aberto" mesmo depois do vencimento; o status real é calculado aqui.
export function statusEfetivo(b: Boleto, hoje = new Date()): StatusBoleto {
  if (b.status?.toLowerCase() === 'pago') return 'pago';
  const venc = dataVencimento(b);
  if (b.status?.toLowerCase() === 'vencido') return 'vencido';
  if (venc) {
    const fimDoDia = new Date(venc);
    fimDoDia.setHours(23, 59, 59, 999);
    if (fimDoDia < hoje) return 'vencido';
  }
  return 'aberto';
}

export const ROTULO_STATUS: Record<StatusBoleto, string> = { pago: 'Pago', vencido: 'Vencido', aberto: 'Em aberto' };
export const CHIP_STATUS: Record<StatusBoleto, string> = { pago: 'ob-chip--ok', vencido: 'ob-chip--bad', aberto: 'ob-chip--warn' };

export const mesReferencia = (b: Boleto) => {
  const nome = MESES[(b.mes ?? 1) - 1] ?? '';
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${b.ano}`;
};

export const dataPorExtenso = (d: Date) =>
  d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

export const reais = (v: string | number) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
