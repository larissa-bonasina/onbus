<template>
  <div>
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
    <q-btn label="Adicionar Aluno" @click="addStudent" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [],
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
    addStudent() {
      // lógica para adicionar um novo aluno
      alert('Adicionar um novo aluno');
    },
  },
};
</script>
