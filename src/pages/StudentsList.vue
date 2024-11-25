<template>
  <div>
    <h2>Lista de Alunos</h2>
    <q-table
      :rows="students"
      :columns="columns"
      row-key="cpf"
      class="students-table"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            label="Adicionar Boleto"
            color="primary"
            @click="openBoletoForm(props.row)"
            :disable="props.row.boletoEnviado"
          />
        </q-td>
      </template>
    </q-table>


    <q-dialog v-model="showBoletoForm">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Gerar Boleto para {{ selectedStudent.nome }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="boletoValor"
            label="Valor do Boleto"
            type="number"
            autofocus
          />
          <q-input
            v-model="boletoData"
            label="Data de Vencimento"
            type="date"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancelar" @click="closeBoletoForm" />
          <q-btn flat label="Gerar" color="primary" @click="submitBoleto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      students: [],
      columns: [
        { name: 'cpf', label: 'CPF', align: 'left', field: 'cpf' },
        { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
        { name: 'curso', label: 'Curso', align: 'left', field: 'curso' },
        { name: 'email', label: 'Email', align: 'left', field: 'email' },
        { name: 'action', label: 'Ação', align: 'center', field: 'action' },
      ],
      showBoletoForm: false,
      selectedStudent: null,
      boletoValor: '',
      boletoData: '',
    };
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {

    async fetchStudents() {
      try {
        const response = await axios.get('http://localhost:3000/alunos');
        this.students = response.data;
      } catch (error) {
        console.error('Erro ao buscar os alunos:', error);
      }
    },


    openBoletoForm(student) {
      this.selectedStudent = student;
      this.boletoValor = '';
      this.boletoData = '';
      this.showBoletoForm = true;
    },


    closeBoletoForm() {
      this.showBoletoForm = false;
    },


    async submitBoleto() {
  const student = this.selectedStudent;


  if (!this.boletoValor || !this.boletoData) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const formData = {
    aluno: { cpf: student.cpf },
    valor: this.boletoValor,
    vencimento: this.boletoData,
  };

  try {
    const response = await axios.post(
      'http://localhost:3000/admin/gerar-boleto',
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      }
    );

    if (response.status === 200) {
      alert('Boleto gerado com sucesso!');
      student.boletoEnviado = true; // Marca o boleto como enviado
      this.closeBoletoForm(); // Fecha o modal
    }
  } catch (error) {
    alert('Erro ao gerar boleto. Verifique suas credenciais ou tente novamente.');
    console.error('Erro ao gerar boleto:', error);
  }
}
  },
};
</script>

<style scoped>
.students-table {
  margin-top: 20px;
}
</style>
