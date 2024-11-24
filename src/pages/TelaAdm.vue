<template>
  <div class="admin-page">
    <!-- Botão de menu para abrir a barra de navegação -->
    <q-btn
      icon="menu"
      @click="toggleDrawer"
      class="menu-btn"
      flat
      color="black"
      size="lg"
    />

    <!-- Barra de navegação deslizante -->
    <q-drawer
      v-model="drawerOpen"
      side="left"
      bordered
      class="sidebar"
      :persistent="false"
      @click-outside="closeDrawer"
      width="250px"
      style="background-color: #354aff"
    >
      <!-- Ícone de fechar na parte superior -->
      <div class="close-icon">
        <q-btn
          icon="close"
          flat
          color="white"
          @click="toggleDrawer"
          class="close-btn"
        />
      </div>

      <q-list>
        <q-item clickable @click="selectSection('attendance')">
          <q-item-section avatar>
            <q-icon name="dashboard" color="#f0f0f0" size="lg" />
          </q-item-section>
          <q-item-section style="color: #f0f0f0">
            Lista de Presença
          </q-item-section>
        </q-item>
        <q-item clickable @click="selectSection('students')">
          <q-item-section avatar>
            <q-icon name="person" color="#f0f0f0" size="lg" />
          </q-item-section>
          <q-item-section style="color: #f0f0f0"> Alunos </q-item-section>
        </q-item>
        <q-item clickable @click="selectSection('expenses')">
          <q-item-section avatar>
            <q-icon name="receipt" color="#f0f0f0" size="lg" />
          </q-item-section>
          <q-item-section style="color: #f0f0f0">
            Prestação de Contas
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
      drawerOpen: false,
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
      this.closeDrawer();
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    closeDrawer() {
      this.drawerOpen = false;
    },
  },
};
</script>

<style scoped>
.admin-page {
  display: flex;
  position: relative;
  height: 100vh;
}

.menu-btn {
  position: absolute;
  top: 10px;
  left: 10px;
}

.close-icon {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.close-btn {
  color: white;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #e4e7ea;
}
</style>
