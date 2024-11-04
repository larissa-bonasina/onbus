<template>
  <div>
    <h2>Lista de Presença</h2>
    <q-table
      :rows="attendanceRecords"
      :columns="columns"
      row-key="id"
      class="attendance-table"
    >
      <template v-slot:body-cell-present="props">
        <q-td :props="props">
          <q-checkbox v-model="props.row.present" />
        </q-td>
      </template>
    </q-table>
    <q-btn label="Adicionar Registro de Presença" @click="addAttendanceRecord" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      attendanceRecords: [
        { id: 1, studentName: 'João Silva', present: false },
        { id: 2, studentName: 'Maria Souza', present: true },
      ],
      columns: [
        { name: 'studentName', label: 'Nome do Aluno', field: 'studentName', align: 'left' },
        { name: 'present', label: 'Presente', align: 'center' },
      ],
    };
  },
  methods: {
    addAttendanceRecord() {
      // lógica para adicionar um novo registro de presença
      alert('Adicionar um novo registro de presença');
    },
  },
};
</script>

<style scoped>
.attendance-table {
  margin-top: 20px;
}
</style>
