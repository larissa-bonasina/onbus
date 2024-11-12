<template>
  <div>
    <h2>Lista de Presença</h2>
    <q-table
      :rows="attendanceRecords"
      :columns="columns"
      row-key="id"
      class="attendance-table"
    />

    <q-btn
      label="Adicionar Novo Registro"
      color="primary"
      @click="showAddAttendanceForm = true"
      class="add-btn"
    />

    <q-dialog v-model="showAddAttendanceForm">
      <q-card>
        <q-card-section>
          <div class="text-h6">Novo Registro de Presença</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newAttendance.studentName"
            label="Nome do Aluno"
            outlined
          />
          <q-input
            v-model="newAttendance.date"
            label="Data"
            outlined
            type="date"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="showAddAttendanceForm = false" />
          <q-btn flat label="Adicionar" color="primary" @click="addAttendance" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AttendanceList',
  data() {
    return {
      attendanceRecords: [
        { id: 1, studentName: 'João Silva', date: '2024-10-01' },
        { id: 2, studentName: 'Maria Souza', date: '2024-10-02' },
      ],
      columns: [
        { name: 'studentName', label: 'Nome do Aluno', field: 'studentName', align: 'left' },
        { name: 'date', label: 'Data', field: 'date', align: 'left' },
      ],
      showAddAttendanceForm: false,
      newAttendance: {
        studentName: '',
        date: '',
      },
    };
  },
  methods: {
    addAttendance() {
      const newRecord = { ...this.newAttendance, id: Date.now() };
      this.attendanceRecords.push(newRecord);
      this.showAddAttendanceForm = false;
      this.newAttendance = { studentName: '', date: '' };
    },
  },
};
</script>

<style scoped>
.add-btn {
  margin-top: 10px;
}
</style>
