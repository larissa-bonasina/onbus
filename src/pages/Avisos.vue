<template>
  <div class="avisos-container">
    <header class="top-bar">
      <q-btn
        flat
        dense
        round
        icon="arrow_back"
        @click="voltar"
        color="primary"
        aria-label="Voltar"
      />
      <h2 class="page-title">Avisos da Associação</h2>
    </header>

    <q-card
      v-for="aviso in avisos"
      :key="aviso.id"
      class="q-mb-md shadow-2"
      bordered
    >
      <q-card-section>
        <div class="text-h6 text-primary">{{ aviso.titulo }}</div>
        <div class="text-caption text-grey-7 q-mb-sm">{{ aviso.data }}</div>
        <div class="text-body1">{{ aviso.mensagem }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'AvisosAlunos',
  setup() {
    const router = useRouter();
    const voltar = () => {
      router.push('/principal');
    };
    return { voltar };
  },
  data() {
    return {
      avisos: [
        { id: 1,
          titulo: 'Reunião Geral',
          mensagem: 'Teremos uma reunião no dia 20/06 às 19h para discutir melhorias no transporte.',
          data: '13/06/2025' },

        { id: 2,
          titulo: 'Pagamento Mensalidade',
          mensagem: 'O vencimento da mensalidade de junho é dia 15. Fique atento!',
          data: '10/06/2025' },

        { id: 3,
          titulo: 'Documentos Pendentes',
          mensagem: 'Alguns alunos ainda não entregaram os documentos exigidos. Verifique sua situação.',
          data: '08/06/2025' },
      ],
    };
  },
};
</script>

<style scoped>
.avisos-container {
  padding: 20px;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}
</style>
