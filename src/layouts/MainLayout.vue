<template>
  <div class="layout">
    <!-- AppBar fija en la parte superior -->
    <AppNavbar @toggle-sidebar="toggleSidebar" />

    <div class="layout-body">
      <!-- Sidebar fijo a la izquierda, debajo de la AppBar -->
      <AppSidebar :collapsed="sidebarCollapsed" />

      <!-- Contenido principal -->
      <div class="layout-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppNavbar from '@/components/AppNavbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';

const sidebarCollapsed = ref(false);
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
}

/* AppBar ya debe ser fixed desde su propio componente */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  /* Margen superior para dejar espacio a la AppBar (60px) */
  margin-top: 60px;
}

.layout-body :deep(.app-sidebar) {
  /* Aseguramos que el sidebar esté debajo de la AppBar */
  position: fixed;
  top: 60px;
  height: calc(100vh - 60px);
  z-index: 998;
}

.layout-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: #fff;
  /* Ajuste de margen izquierdo según estado del sidebar */
  margin-left: 240px; /* Ancho normal del sidebar */
  transition: margin-left 0.3s ease;
}

.layout-content.sidebar-collapsed {
  margin-left: 70px; /* Ancho colapsado */
}
</style>