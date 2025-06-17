<template>
  <q-page class="page-container">
    <div class="top-section">
      <q-btn
        flat
        icon="arrow_back"
        @click="voltarTelaPrincipal"
        class="back-btn"
        color="primary"
      />
      <h2 class="title">Meus Boletos</h2>
    </div>

    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="40px" />
    </div>

    <div v-else class="boletos-container">
      <div
        v-for="boleto in boletos"
        :key="boleto.id"
        class="boleto-card"
      >
        <div class="boleto-linha">
          <span class="label">Referente:</span>
          <span class="value">{{ boleto.mes }}/{{ boleto.ano }}</span>
        </div>
        <div class="boleto-linha">
          <span class="label">Vencimento:</span>
          <span class="value">{{ boleto.vencimento }}</span>
        </div>
        <div class="boleto-linha">
          <span class="label">Código de Barras:</span>
          <span class="value">{{ boleto.codigo_barras }}</span>
        </div>
        <div class="boleto-linha">
          <span class="label">Status:</span>
          <span
            class="value"
            :class="{
              'status-aberto': boleto.status.toLowerCase() === 'em aberto',
              'status-pago': boleto.status.toLowerCase() === 'pago',
              'status-vencido': boleto.status.toLowerCase() === 'vencido'
            }"
          >
            {{ boleto.status }}
          </span>
        </div>
        <div class="boleto-linha">
          <span class="label">Valor:</span>
          <span class="value">R$ {{ parseFloat(boleto.valor).toFixed(2) }}</span>
        </div>
      </div>

      <div v-if="boletos.length === 0" class="nenhum-boleto">
        <q-icon name="sentiment_dissatisfied" size="32px" class="q-mb-sm" />
        <div>Nenhum boleto disponível.</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BoletosAluno',
  data() {
    return {
      boletos: [],
      loading: true,
    };
  },
  methods: {
    voltarTelaPrincipal() {
      this.$router.push('/principal');
    },
    async carregarBoletos() {
      const aluno = JSON.parse(localStorage.getItem('aluno'));
      if (!aluno || !aluno.cpf) {
        console.error('Aluno ou CPF não encontrado no localStorage');
        this.loading = false;
        return;
      }

      const cpf = aluno.cpf;
      try {
        const response = await axios.get(`http://localhost:3000/boletos/${cpf}`);
        this.boletos = Array.isArray(response.data) ? response.data : [response.data];
      } catch (error) {
        console.error('Erro ao buscar boletos:', error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.carregarBoletos();
  }
};
</script>

<style scoped>
.page-container {
  background-color: #ffffff;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.back-btn {
  margin-bottom: 10px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.boletos-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.boleto-card {
  border: 1px solid #dcdcdc;
  border-radius: 15px;
  padding: 15px 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.boleto-linha {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  font-weight: 600;
  color: #555;
}

.value {
  font-weight: 500;
  color: #333;
}

.status-aberto {
  color: #ff9800;
}

.status-pago {
  color: #4caf50;
}

.status-vencido {
  color: #f44336;
}

.nenhum-boleto {
  text-align: center;
  margin-top: 40px;
  color: #888;
}
</style>
