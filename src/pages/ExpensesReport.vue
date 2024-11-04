<template>
  <div>
    <h2>Prestação de Contas</h2>
    <q-table
      :rows="expenseRecords"
      :columns="columns"
      row-key="id"
      class="expenses-table"
    >
      <template v-slot:body-cell-details="props">
        <q-td :props="props">
          <q-btn
            label="Ver Detalhes"
            @click="viewExpenseDetails(props.row)"
            color="primary"
          />
        </q-td>
      </template>
    </q-table>
    <q-btn label="Adicionar Despesa" @click="addExpense" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      expenseRecords: [
        { id: 1, description: 'Gastos com combustível', amount: 200 },
        { id: 2, description: 'Manutenção do ônibus', amount: 150 },
      ],
      columns: [
        {
          name: 'description',
          label: 'Descrição',
          field: 'description',
          align: 'left',
        },
        {
          name: 'amount',
          label: 'Valor (R$)',
          field: 'amount',
          align: 'right',
        },
        { name: 'details', label: 'Ações', align: 'center' },
      ],
    };
  },
  methods: {
    viewExpenseDetails(expense) {
      // lógica para visualizar detalhes da despesa
      alert(`Ver detalhes da despesa: ${expense.description}`);
    },
    addExpense() {
      // lógica para adicionar uma nova despesa
      alert('Adicionar uma nova despesa');
    },
  },
};
</script>

<style scoped>
.expenses-table {
  margin-top: 20px;
}
</style>
