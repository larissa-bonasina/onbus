<template>
  <div class="admin-page">
    <!-- Barra de navegação lateral -->
    <div class="sidebar">
      <q-btn
        class="sidebar-btn"
        icon="dashboard"
        label="Lista de Presença"
        @click="selectSection('attendance')"
      />
      <q-btn
        class="sidebar-btn"
        icon="person"
        label="Alunos"
        @click="selectSection('students')"
      />
      <q-btn
        class="sidebar-btn"
        icon="receipt"
        label="Prestação de Contas"
        @click="selectSection('expenses')"
      />
    </div>

    <!-- Conteúdo principal -->
    <div class="main-content">
      <component :is="currentSectionComponent"></component>
    </div>
  </div>
</template>

<script>
import AttendanceList from './AttendanceList.vue';
import StudentsList from './StudentsList.vue';
import ExpensesReport from './ExpensesReport.vue';

export default {
  name: 'AdminPage',
  data() {
    return {
      currentSection: 'attendance',
    };
  },
  computed: {
    currentSectionComponent() {
      return {
        attendance: AttendanceList,
        students: StudentsList,
        expenses: ExpensesReport,
      }[this.currentSection];
    },
  },
  methods: {
    selectSection(section) {
      this.currentSection = section;
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
  border-radius: 20px;
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
</style>
