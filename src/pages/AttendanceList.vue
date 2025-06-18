<template>
  <div>
    <h2>Lista de Presença</h2>

    <q-table
      :rows="attendanceRecords"
      :columns="columns"
      class="attendance-table"
    >
      <template v-slot:body-cell-actions="props">
        <q-td align="center">
          <q-toggle
            v-model="props.row.checkedIn"
            @update:model-value="val => togglePresenca(val, props.row.cpf)"
            color="green"
            checked-icon="check"
            unchecked-icon="close"
          />
        </q-td>
      </template>
    </q-table>

    <q-btn
      label="Atualizar Lista"
      color="primary"
      icon="refresh"
      class="q-mt-md"
      @click="fetchPresentes"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AttendanceList',
  data() {
    return {
      attendanceRecords: [],
      columns: [
        { name: 'studentName', label: 'Nome do Aluno', field: 'studentName', align: 'left' },
        { name: 'date', label: 'Data do Check-in', field: 'date', align: 'left' },
        { name: 'checkinTime', label: 'Hora do Check-in', field: 'checkinTime', align: 'left' },
        { name: 'actions', label: 'Presente', field: 'checkedIn', align: 'center' }
      ],
    };
  },
  methods: {
    async fetchPresentes() {
      try {
        const response = await axios.get('http://localhost:3000/checkin/presentes');
        this.attendanceRecords = response.data.map((aluno, index) => {
          const checkinDate = aluno.checkinTime?.seconds
            ? new Date(aluno.checkinTime.seconds * 1000)
            : new Date();

          return {
            id: index + 1,
            studentName: aluno.nome || 'Desconhecido',

            date: checkinDate.toISOString().substring(0, 10),
            checkinTime: checkinDate.toLocaleTimeString(),
            checkedIn: true
          };
        });
      } catch (error) {
        console.error('Erro ao buscar alunos presentes:', error);
      }
    },

    async togglePresenca(marcado, cpf) {
      try {
        if (marcado) {
          await axios.post('/checkin/checkin', { cpf });
        } else {
          await axios.post('/checkin/checkout', { cpf });
        }
        this.fetchPresentes(); // Atualiza a tabela
      } catch (error) {
        console.error('Erro ao atualizar presença:', error);
      }
    }
  },
  mounted() {
    this.fetchPresentes();
  }
};
</script>

<style scoped>
.attendance-table {
  margin-top: 20px;
}
</style>
