<!-- src/components/AppNavBar.vue -->
<template>
  <div class="app-navbar">
    <div class="navbar-left">
      <i class="pi pi-bars toggle-icon" @click="$emit('toggleSidebar')" />
      <!-- Logo en lugar de texto -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="PowerTask" class="logo-image" />
      </div>
    </div>
    <div class="navbar-right">
      <i class="pi pi-bell nav-icon" title="Notificaciones"></i>
      <i class="pi pi-user nav-icon" title="Perfil"></i>
    </div>
  </div>
</template>

<script setup>
// Emite el evento para abrir/cerrar el sidebar
defineEmits(['toggleSidebar']);
</script>

<style scoped>
.app-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFAA7A; /* 🍊 Naranja salmón suave - Coherente con tu logo */
  color: #111827; /* Negro oscuro para contraste */
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.toggle-icon {
  font-size: 1.4rem;
  cursor: pointer;
  transition: transform 0.2s;
  color: #111827; /* Asegura visibilidad sobre fondo naranja */
}

.toggle-icon:hover {
  transform: scale(1.1);
  color: #000;
}

.logo {
  height: 32px;
  display: flex;
  align-items: center;
}

.logo-image {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-icon {
  font-size: 1.3rem;
  cursor: pointer;
  transition: opacity 0.2s;
  color: #111827; /* Mismo color que el texto */
}

.nav-icon:hover {
  opacity: 0.8;
  color: #000;
}
</style>