<template>
  <div>
    <h2>Prestação de Contas</h2>
    <q-table
      :rows="expenses"
      :columns="columns"
      row-key="id"
      class="expenses-table"
    />

    <q-btn
      label="Adicionar Nova Despesa"
      color="primary"
      @click="showAddExpenseForm = true"
      class="add-btn"
    />

    <q-dialog v-model="showAddExpenseForm">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nova Despesa</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newExpense.description"
            label="Descrição"
            outlined
          />
          <q-input
            v-model="newExpense.amount"
            label="Valor"
            outlined
            type="number"
          />
        </q-card-section>

        <q-card-actions align="right">
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
.add-btn {
  margin-top: 10px;
}
</style>
