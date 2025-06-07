<template>
  <div class="admin-container">
    <aside class="sidebar">
      <div class="profile">
        <q-avatar size="60px" class="q-mb-sm">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" />
        </q-avatar>
        <div class="username">Administrador</div>
      </div>

      <q-list class="menu-list">
        <q-item
          v-for="item in sections"
          :key="item.key"
          clickable
          v-ripple
          @click="selectSection(item.key)"
          :active="currentSection === item.key"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </aside>

    <main class="content-area">
      <div class="content-card">
        <component :is="currentSectionComponent" />
      </div>
    </main>
  </div>
</template>

<script>
import AttendanceList from './AttendanceList.vue';
import StudentsList from './StudentsList.vue';
import MonthlyFees from './MonthlyFees.vue';

export default {
  name: 'AdminPage',
  components: {
    AttendanceList,
    StudentsList,
    MonthlyFees,
  },
  data() {
    return {
      currentSection: 'attendance',
      sections: [
        { key: 'attendance', label: 'Presença', icon: 'dashboard' },
        { key: 'students', label: 'Alunos', icon: 'school' },
        { key: 'monthlyfees', label: 'Mensalidades', icon: 'receipt_long' },
      ],
    };
  },
  computed: {
    currentSectionComponent() {
      return {
        attendance: 'AttendanceList',
        students: 'StudentsList',
        monthlyfees: 'MonthlyFees',
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
.admin-container {
  display: flex;
  min-height: 100vh;
  background: #f3f7fc;
  font-family: 'Roboto', sans-serif;
}

.sidebar {
  width: 250px;
  background: #2b3d63;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.profile {
  text-align: center;
  margin-bottom: 30px;
}

.username {
  font-size: 1.1rem;
  font-weight: bold;
}

.menu-list {
  width: 100%;
}

.q-item {
  color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.3s;
}

.q-item:hover,
.q-item--active {
  background: #3f5588 !important;
  font-weight: bold;
}

.content-area {
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f3f7fc;
}

.content-card {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1000px;
  min-height: 500px;
  transition: all 0.3s ease;
}
</style>
