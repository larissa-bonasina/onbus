<template>
  <div class="expenses-container">
    <!-- Título -->
    <h2 class="page-title">Prestação de Contas</h2>

    <!-- Tabela de despesas -->
    <q-table
      :rows="expenses"
      :columns="columns"
      row-key="id"
      class="q-mt-md shadow-1 rounded-borders"
      flat
      bordered
    />

    <!-- Botão de adicionar -->
    <div class="q-mt-md flex justify-end">
      <q-btn
        label="Adicionar Nova Despesa"
        color="primary"
        @click="showAddExpenseForm = true"
        rounded
        unelevated
        icon="add"
        class="add-btn"
      />
    </div>

    <!-- Formulário em modal -->
    <q-dialog v-model="showAddExpenseForm">
      <q-card class="q-pa-md" style="min-width: 300px;">
        <q-card-section>
          <div class="text-h6 text-primary">Nova Despesa</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-input
            v-model="newExpense.description"
            label="Descrição"
            outlined
            dense
          />
          <q-input
            v-model="newExpense.amount"
            label="Valor (R$)"
            outlined
            type="number"
            dense
            prefix="R$"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pt-none">
          <q-btn flat label="Cancelar" color="negative" @click="showAddExpenseForm = false" />
          <q-btn flat label="Adicionar" color="primary" @click="addExpense" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ExpensesReport',
  data() {
    return {
      expenses: [
        { id: 1, description: 'Transporte - Outubro', amount: 500 },
        { id: 2, description: 'Manutenção', amount: 200 },
      ],
      columns: [
        { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
        { name: 'amount', label: 'Valor (R$)', field: 'amount', align: 'left' },
      ],
      showAddExpenseForm: false,
      newExpense: {
        description: '',
        amount: null,
      },
    };
  },
  methods: {
    addExpense() {
      const newRecord = { ...this.newExpense, id: Date.now() };
      this.expenses.push(newRecord);
      this.showAddExpenseForm = false;
      this.newExpense = { description: '', amount: null };
    },
  },
};
</script>

<style scoped>
.expenses-container {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #000000;
}

.add-btn {
  min-width: 220px;
}
</style>
