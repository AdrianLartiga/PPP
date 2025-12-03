<!-- src/components/AppSidebar.vue -->
<template>
  <div class="app-sidebar" :class="{ collapsed }">
    <div class="sidebar-menu">
      <div
        v-for="item in menuItems"
        :key="item.label"
        class="menu-item"
        :class="{ active: $route.path === item.to }"
        @click="goTo(item.to)"
      >
        <i :class="item.icon"></i>
        <span v-if="!collapsed">{{ item.label }}</span>
      </div>

      <!-- Separador visual -->
      <div class="menu-divider" v-if="!collapsed"></div>

      <!-- Cerrar sesión -->
      <div class="menu-item logout-item" @click="logout">
        <i class="pi pi-sign-out"></i>
        <span v-if="!collapsed">Cerrar sesión</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Recibir el estado de colapso desde el layout
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const route = useRoute();

const menuItems = [
  { label: 'Perfil', icon: 'pi pi-user', to: '/profile' },
  { label: 'Tareas', icon: 'pi pi-check-circle', to: '/tasks' },
  { label: 'Equipo', icon: 'pi pi-users', to: '/team' }
];

const goTo = (path) => {
  router.push(path);
};

const logout = () => {
  // Aquí podrías limpiar tokens, localStorage, etc.
  // Ejemplo:
  // localStorage.removeItem('authToken');
  router.push('/');
};
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background: #ffffff;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  z-index: 998;
  transition: width 0.3s ease;
  overflow: hidden; /* Evita que el texto desborde al colapsar */
}

.app-sidebar.collapsed {
  width: 70px;
}

.sidebar-menu {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 100%;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.9rem 1.5rem;
  cursor: pointer;
  gap: 1rem;
  transition: all 0.2s ease;
  color: #4b5563;
  font-weight: 500;
  white-space: nowrap; /* Evita que el texto se envuelva */
}

.menu-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.menu-item.active {
  background: #f4ede6;
  color: #fa9039;
  border-left: 4px solid #ffa55b;
}

/* Separador */
.menu-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.75rem 1.5rem;
}

/* Estilo especial para cerrar sesión */
.logout-item {
  margin-top: auto;
  padding: 0.9rem 1.5rem;
}

.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

.logout-item i {
  color: inherit;
}
</style>