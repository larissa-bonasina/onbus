<template>
  <div class="admin-page">
    <!-- Barra de navegação lateral -->
    <div class="sidebar">
      <q-btn class="sidebar-btn" icon="dashboard" label="Lista de presença" />
      <q-btn class="sidebar-btn" icon="person" label="Alunos" />
      <!-- Outros botões da barra de navegação -->
    </div>

    <!-- Conteúdo principal -->
    <div class="main-content">
      <h2>Lista de Alunos</h2>
      <q-table
        :rows="students"
        :columns="columns"
        row-key="id"
        class="students-table"
      >
        <template v-slot:body-cell-upload="props">
          <q-td :props="props">
            <q-btn
              icon="cloud_upload"
              color="primary"
              @click="uploadBoleto(props.row)"
              label="Upload Boleto"
              class="rounded-btn"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      students: [
        { id: 1, name: 'João Silva', course: 'Engenharia' },
        { id: 2, name: 'Maria Souza', course: 'Direito' },
      ],
      columns: [
        { name: 'name', label: 'Nome', field: 'name', align: 'left' },
        { name: 'course', label: 'Curso', field: 'course', align: 'left' },
        { name: 'upload', label: 'Upload Boleto', align: 'center' },
      ],
    };
  },
  methods: {
    uploadBoleto(student) {
      alert(`Fazer upload do boleto para: ${student.name}`);
    },
  },
};
</script>

<style scoped>
.admin-page {
  display: flex;
}

.sidebar {
  width: 250px;
  background-color: #3139e9;
  height: 100vh;
  padding: 20px;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
}

.sidebar-btn {
  margin-bottom: 10px;
  width: 100%;
  border-radius: 20px; /* Borda mais arredondada */
  background-color: #fff;
  color: #3139e9;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f5f5f5;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
}

.students-table {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 20px; /* Borda mais arredondada */
  padding: 15px;
}

.rounded-btn {
  border-radius: 20px; /* Borda mais arredondada para os botões da tabela */
}
</style>
