<template>
  <div>
    <h2>Lista de Alunos</h2>
    <q-table
      :rows="students"
      :columns="columns"
      row-key="id"
      class="students-table"
    />

    <q-btn
      label="Adicionar Novo Aluno"
      color="primary"
      @click="showAddStudentForm = true"
      class="add-btn"
    />

    <q-dialog v-model="showAddStudentForm">
      <q-card>
        <q-card-section>
          <div class="text-h6">Novo Aluno</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newStudent.name" label="Nome" outlined />
          <q-input v-model="newStudent.course" label="Curso" outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="showAddStudentForm = false"
          />
          <q-btn flat label="Adicionar" color="primary" @click="addStudent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'StudentList',
  data() {
    return {
      students: [
        { id: 1, name: 'João Silva', course: 'Engenharia' },
        { id: 2, name: 'Maria Souza', course: 'Direito' },
      ],
      columns: [
        { name: 'name', label: 'Nome', field: 'name', align: 'left' },
        { name: 'course', label: 'Curso', field: 'course', align: 'left' },
      ],
      showAddStudentForm: false,
      newStudent: {
        name: '',
        course: '',
      },
    };
  },
  methods: {
    addStudent() {
      const newStudent = { ...this.newStudent, id: Date.now() };
      this.students.push(newStudent);
      this.showAddStudentForm = false;
      this.newStudent = { name: '', course: '' };
    },
  },
};
</script>

<style scoped>
.add-btn {
  margin-top: 10px;
}
</style>
