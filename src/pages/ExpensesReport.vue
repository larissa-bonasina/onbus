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
      <h2 class="title">Prestação de Contas</h2>
    </div>

    <div class="expenses-container">
      <div
        v-for="expense in expenses"
        :key="expense.id"
        class="expense-card"
      >
        <div class="expense-line">
          <span class="label">Descrição:</span>
          <span class="value">{{ expense.description }}</span>
        </div>
        <div class="expense-line">
          <span class="label">Valor:</span>
          <span class="value">R$ {{ parseFloat(expense.amount).toFixed(2) }}</span>
        </div>
      </div>

      <div v-if="expenses.length === 0" class="nenhuma-despesa">
        <q-icon name="sentiment_dissatisfied" size="32px" class="q-mb-sm" />
        <div>Nenhuma despesa cadastrada.</div>
      </div>
    </div>

    <div class="add-btn-container">
      <q-btn
        label="Adicionar Nova Despesa"
        color="primary"
        icon="add"
        rounded
        unelevated
        @click="showAddExpenseForm = true"
      />
    </div>

    <!-- Modal para adicionar despesa -->
    <q-dialog v-model="showAddExpenseForm" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section>
          <div class="text-h6 text-primary">Nova Despesa</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="newExpense.description"
            label="Descrição"
            outlined
            dense
            autofocus
            clearable
          />
          <q-input
            v-model.number="newExpense.amount"
            label="Valor (R$)"
            type="number"
            outlined
            dense
            prefix="R$"
            min="0"
            clearable
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pt-none">
          <q-btn flat label="Cancelar" color="negative" @click="cancelAdd" />
          <q-btn flat label="Adicionar" color="primary" @click="addExpense" :disable="!isFormValid" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'PrestacaoContas',
  data() {
    return {
      expenses: [
        { id: 1, description: 'Transporte - Outubro', amount: 500 },
        { id: 2, description: 'Manutenção', amount: 200 },
      ],
      showAddExpenseForm: false,
      newExpense: {
        description: '',
        amount: null,
      },
    };
  },
  computed: {
    isFormValid() {
      return this.newExpense.description.trim() !== '' && this.newExpense.amount > 0;
    },
  },
  methods: {
    voltarTelaPrincipal() {
      this.$router.push('/principal');
    },
    addExpense() {
      if (!this.isFormValid) return;
      const newRecord = { ...this.newExpense, id: Date.now() };
      this.expenses.push(newRecord);
      this.cancelAdd();
    },
    cancelAdd() {
      this.showAddExpenseForm = false;
      this.newExpense = { description: '', amount: null };
    },
  },
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

.expenses-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.expense-card {
  border: 1px solid #dcdcdc;
  border-radius: 15px;
  padding: 15px 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.expense-line {
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

.nenhuma-despesa {
  text-align: center;
  margin-top: 40px;
  color: #888;
}

.add-btn-container {
  display: flex;
  justify-content: flex-end;
}
</style>
