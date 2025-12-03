<template>
  <div class="team-view">
    <!-- Encabezado -->
    <div class="page-header">
      <h1>Equipo a cargo</h1>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Cuenta:</label>
        <Dropdown
          v-model="filters.account"
          :options="accountOptions"
          option-label="name"
          option-value="id"
          placeholder="Todas las cuentas"
          @change="applyFilters"
        />
      </div>
      <div class="filter-group">
        <label>Rol:</label>
        <Dropdown
          v-model="filters.role"
          :options="roleOptions"
          placeholder="Todos los roles"
          @change="applyFilters"
        />
      </div>
      <div class="filter-actions">
        <Button
          label="Limpiar filtros"
          icon="pi pi-filter-slash"
          class="p-button-outlined p-button-sm"
          @click="clearFilters"
        />
      </div>
    </div>

    <!-- Sección por Cuenta -->
    <div v-for="account in groupedUsers" :key="account.id" class="account-section">
      <h2 class="account-title">{{ account.name }}</h2>

      <!-- Supervisores -->
      <div v-if="account.supervisors.length" class="section">
        <div class="section-header">
          <h3>Supervisores</h3>
        </div>
        <div class="users-grid">
          <div
            v-for="user in account.supervisors"
            :key="user.id"
            class="user-card"
            @click="selectUser(user)"
            :class="{ 'selected': selectedUser?.id === user.id }"
          >
            <div class="user-avatar">
              <div class="avatar-bg">{{ user.name.charAt(0).toUpperCase() }}</div>
              <div v-if="user.online" class="status-dot online"></div>
            </div>
            <div class="user-info">
              <h3>{{ user.name }}</h3>
              <p class="user-role">Supervisor</p>
              <p class="user-account">{{ user.account }}</p>
            </div>
            <div class="user-actions">
              <Button icon="pi pi-bell" class="p-button-text p-button-sm" @click.stop="notifyUser(user)" />
              <Button icon="pi pi-cog" class="p-button-text p-button-sm" @click.stop="openConfigModal(user)" />
            </div>
          </div>
        </div>
      </div>

      <!-- Promotores -->
      <div v-if="account.promoters.length" class="section">
        <div class="section-header">
          <h3>Promotores</h3>
        </div>
        <div class="users-grid">
          <div
            v-for="user in account.promoters"
            :key="user.id"
            class="user-card"
            @click="selectUser(user)"
            :class="{ 'selected': selectedUser?.id === user.id }"
          >
            <div class="user-avatar">
              <div class="avatar-bg">{{ user.name.charAt(0).toUpperCase() }}</div>
              <div v-if="user.online" class="status-dot online"></div>
            </div>
            <div class="user-info">
              <h3>{{ user.name }}</h3>
              <p class="user-role">Promotor</p>
              <p class="user-account">{{ user.account }}</p>
            </div>
            <div class="user-actions">
              <Button icon="pi pi-bell" class="p-button-text p-button-sm" @click.stop="notifyUser(user)" />
              <!-- Solo supervisores pueden abrir configuración -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de información del usuario -->
    <Dialog
      v-model:visible="showUserModal"
      header="Detalles del Usuario"
      :modal="true"
      :closable="true"
      style="width: 450px"
    >
      <div v-if="selectedUser" class="user-modal-content">
        <div class="modal-avatar">
          <div class="avatar-bg">{{ selectedUser.name.charAt(0).toUpperCase() }}</div>
          <div v-if="selectedUser.online" class="status-dot online"></div>
        </div>
        <div class="modal-info">
          <h3>{{ selectedUser.name }}</h3>
          <p><strong>Rol:</strong> {{ selectedUser.role }}</p>
          <p><strong>Cuenta:</strong> {{ selectedUser.account }}</p>
          <p><strong>Última actividad:</strong> {{ selectedUser.lastActivity }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Teléfono:</strong> {{ selectedUser.phone }}</p>
          <p><strong>Ubicación:</strong> {{ selectedUser.location }}</p>
          <p><strong>Estado:</strong>
            <span :class="selectedUser.status === 'Activo' ? 'status-active' : 'status-inactive'">
              {{ selectedUser.status }}
            </span>
          </p>
        </div>
      </div>
    </Dialog>

    <!-- Modal de configuración (solo para supervisores) -->
    <Dialog
      v-model:visible="showConfigModal"
      :header="`Configuración de ${selectedUserForConfig?.name || ''}`"
      :modal="true"
      :closable="true"
      style="width: 650px"
    >
      <div v-if="selectedUserForConfig" class="config-modal-content">
        <div class="user-summary">
          <div class="summary-avatar">
            <div class="avatar-bg">{{ selectedUserForConfig.name.charAt(0).toUpperCase() }}</div>
            <div v-if="selectedUserForConfig.online" class="status-dot online"></div>
          </div>
          <div class="summary-info">
            <h3>{{ selectedUserForConfig.name }}</h3>
            <p class="summary-role">{{ selectedUserForConfig.role }}</p>
            <div class="summary-stats">
              <div class="stat-item">
                <span class="stat-value">{{ selectedUserForConfig.teamCount }}</span>
                <span class="stat-label">Colaboradores</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedUserForConfig.performance }}</span>
                <span class="stat-label">Rendimiento</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedUserForConfig.tasks }}</span>
                <span class="stat-label">Tareas</span>
              </div>
            </div>
          </div>
        </div>

        <div class="collaborators-section">
          <h4>Colaboradores Asignados</h4>
          <div class="collaborators-grid">
            <div
              v-for="(collaborator, index) in selectedUserForConfig.collaborators"
              :key="index"
              class="collaborator-card"
            >
              <div class="collaborator-avatar">
                <div class="avatar-bg">{{ collaborator.name.charAt(0).toUpperCase() }}</div>
                <div v-if="collaborator.online" class="status-dot online"></div>
              </div>
              <div class="collaborator-info">
                <h5>{{ collaborator.name }}</h5>
                <p class="collaborator-role">{{ collaborator.role }}</p>
              </div>
              <div class="collaborator-actions">
                <Button 
                  icon="pi pi-trash" 
                  class="p-button-danger p-button-text p-button-sm" 
                  @click="removeCollaborator(collaborator)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="add-collaborators-section">
          <h4>Agregar Colaboradores</h4>
          <div class="available-collaborators">
            <div
              v-for="(available, index) in availableCollaborators"
              :key="index"
              class="available-card"
            >
              <div class="collaborator-avatar">
                <div class="avatar-bg">{{ available.name.charAt(0).toUpperCase() }}</div>
                <div v-if="available.online" class="status-dot online"></div>
              </div>
              <div class="collaborator-info">
                <h5>{{ available.name }}</h5>
                <p class="collaborator-role">{{ available.role }}</p>
              </div>
              <div class="collaborator-actions">
                <Button 
                  icon="pi pi-plus" 
                  class="p-button-success p-button-text p-button-sm" 
                  @click="addCollaborator(available)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';

// --- Estados ---
const supervisors = ref([]);
const promoters = ref([]);
const selectedUser = ref(null);
const selectedUserForConfig = ref(null);
const showUserModal = ref(false);
const showConfigModal = ref(false);
const filters = ref({
  account: null,
  role: null
});

// --- Opciones de filtro ---
const roleOptions = ['Supervisor', 'Promotor'];

const accountOptions = computed(() =>
  [...new Set([...supervisors.value, ...promoters.value].map(u => u.account))]
    .filter(acc => acc)
    .map(acc => ({ id: acc, name: acc }))
);

// --- Agrupación por cuenta ---
const allUsers = computed(() => [...supervisors.value, ...promoters.value]);

const filteredUsers = computed(() => {
  return allUsers.value.filter(user => {
    const matchAccount = !filters.value.account || user.account === filters.value.account;
    const matchRole = !filters.value.role || user.role === filters.value.role;
    return matchAccount && matchRole;
  });
});

const groupedUsers = computed(() => {
  const groups = {};
  filteredUsers.value.forEach(user => {
    const acc = user.account || 'Sin cuenta';
    if (!groups[acc]) {
      groups[acc] = {
        id: acc,
        name: acc,
        supervisors: [],
        promoters: []
      };
    }
    if (user.role === 'Supervisor') {
      groups[acc].supervisors.push(user);
    } else if (user.role === 'Promotor') {
      groups[acc].promoters.push(user);
    }
  });
  return Object.values(groups);
});

// --- Colaboradores disponibles ---
const availableCollaborators = computed(() => {
  if (!selectedUserForConfig.value) return [];
  const assignedIds = selectedUserForConfig.value.collaborators.map(c => c.id);
  return promoters.value.filter(promoter =>
    !assignedIds.includes(promoter.id) &&
    !supervisors.value.some(sup =>
      sup.collaborators.some(c => c.id === promoter.id)
    )
  );
});

// --- Funciones ---
const selectUser = (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const openConfigModal = (user) => {
  if (user.role !== 'Supervisor') return;
  const originalRef = supervisors.value.find(sup => sup.id === user.id);
  if (originalRef) {
    selectedUserForConfig.value = originalRef;
    showConfigModal.value = true;
  }
};

const notifyUser = (user) => {
  console.log('Notificar a:', user.name);
};

const removeCollaborator = (collaborator) => {
  if (!selectedUserForConfig.value) return;
  const index = selectedUserForConfig.value.collaborators.findIndex(c => c.id === collaborator.id);
  if (index > -1) {
    selectedUserForConfig.value.collaborators.splice(index, 1);
    selectedUserForConfig.value.teamCount = selectedUserForConfig.value.collaborators.length;
  }
};

const addCollaborator = (collaborator) => {
  if (!selectedUserForConfig.value) return;
  const alreadyAssigned = selectedUserForConfig.value.collaborators.some(c => c.id === collaborator.id);
  if (!alreadyAssigned) {
    selectedUserForConfig.value.collaborators.push({ ...collaborator });
    selectedUserForConfig.value.teamCount = selectedUserForConfig.value.collaborators.length;
  }
};

const applyFilters = () => {
  // Los filtros se aplican automáticamente por computed
};

const clearFilters = () => {
  filters.value = {
    account: null,
    role: null
  };
};

// --- Carga de datos (simulada) ---
const fetchData = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));

  supervisors.value = [
    {
      id: 1,
      name: 'Ana Gómez',
      role: 'Supervisor',
      account: 'Cuenta Nestlé',
      online: true,
      lastActivity: 'Hoy',
      email: 'ana@empresa.com',
      phone: '+57 300 123 4567',
      location: 'Bogotá',
      status: 'Activo',
      teamCount: 3,
      performance: '92%',
      tasks: 12,
      collaborators: [
        { id: 101, name: 'Carlos Mendoza', role: 'Promotor', online: true },
        { id: 102, name: 'Ana López', role: 'Promotor', online: false },
        { id: 103, name: 'Pedro García', role: 'Promotor', online: true }
      ]
    },
    {
      id: 2,
      name: 'Luis Mora',
      role: 'Supervisor',
      account: 'Cuenta Kimberly Clark',
      online: false,
      lastActivity: 'Ayer',
      email: 'luis@empresa.com',
      phone: '+57 300 987 6543',
      location: 'Medellín',
      status: 'Activo',
      teamCount: 2,
      performance: '78%',
      tasks: 8,
      collaborators: [
        { id: 104, name: 'María Rodríguez', role: 'Promotor', online: true },
        { id: 105, name: 'Luis Fernández', role: 'Promotor', online: false }
      ]
    },
    {
      id: 3,
      name: 'Sofía Martínez',
      role: 'Supervisor',
      account: 'Cuenta Nestlé',
      online: true,
      lastActivity: 'Hoy',
      email: 'sofia@empresa.com',
      phone: '+57 300 555 1234',
      location: 'Cali',
      status: 'Activo',
      teamCount: 2,
      performance: '89%',
      tasks: 10,
      collaborators: [
        { id: 106, name: 'Jorge Pérez', role: 'Promotor', online: true },
        { id: 107, name: 'Valentina Gómez', role: 'Promotor', online: true }
      ]
    }
  ];

  promoters.value = [
    { id: 101, name: 'Carlos Mendoza', role: 'Promotor', account: 'Cuenta Nestlé', online: true, lastActivity: 'Hoy', email: 'carlos@empresa.com', phone: '+57...', location: 'Bogotá', status: 'Activo', teamCount: 0, performance: '87%', tasks: 5 },
    { id: 102, name: 'Ana López', role: 'Promotor', account: 'Cuenta Nestlé', online: false, lastActivity: 'Ayer', email: 'ana.l@empresa.com', phone: '+57...', location: 'Bogotá', status: 'Activo', teamCount: 0, performance: '79%', tasks: 4 },
    { id: 104, name: 'María Rodríguez', role: 'Promotor', account: 'Cuenta Kimberly Clark', online: true, lastActivity: 'Hoy', email: 'maria@empresa.com', phone: '+57...', location: 'Medellín', status: 'Activo', teamCount: 0, performance: '85%', tasks: 6 },
    { id: 105, name: 'Luis Fernández', role: 'Promotor', account: 'Cuenta Kimberly Clark', online: false, lastActivity: 'Ayer', email: 'luis.f@empresa.com', phone: '+57...', location: 'Medellín', status: 'Inactivo', teamCount: 0, performance: '75%', tasks: 3 },
    { id: 201, name: 'Diego Ramírez', role: 'Promotor', account: 'Cuenta Brandisco', online: true, lastActivity: 'Hoy', email: 'diego@empresa.com', phone: '+57...', location: 'Barranquilla', status: 'Activo', teamCount: 0, performance: '90%', tasks: 7 }
  ];
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.team-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0 0 1.5rem 0;
  font-weight: bold;
}

/* Filtros */
.filters-section {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
}

.filter-actions .p-button {
  height: 38px;
}

/* Cuenta */
.account-section {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.account-title {
  font-size: 1.4rem;
  color: #1f2937;
  margin-bottom: 1.25rem;
  font-weight: bold;
}

.section {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.15rem;
  color: #111827;
  margin: 0;
}

/* Grid de usuarios */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.user-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  height: 90px;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  border-color: #ffaa7a;
}

.user-card.selected {
  border-color: #3a8a70;
  background: #f0f9f5;
}

.user-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

.status-dot {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-dot.online {
  background: #10b981;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: #111827;
  font-weight: 600;
}

.user-role {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.user-account {
  margin: 0.15rem 0 0 0;
  font-size: 0.8rem;
  color: #9ca3af;
  font-style: italic;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.user-actions .p-button {
  padding: 0.35rem;
  border-radius: 50%;
  font-size: 1rem;
}

/* Modal de usuario */
.user-modal-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.modal-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 2rem;
}

.modal-info {
  flex: 1;
}

.modal-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #111827;
}

.modal-info p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #6b7280;
}

.status-active {
  color: #10b981;
  font-weight: bold;
}

.status-inactive {
  color: #ef4444;
  font-weight: bold;
}

/* Modal de configuración */
.config-modal-content {
  padding: 1rem;
}

.user-summary {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.summary-avatar {
  position: relative;
  width: 70px;
  height: 70px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 1.8rem;
}

.summary-info {
  flex: 1;
}

.summary-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.3rem;
  color: #111827;
}

.summary-role {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.collaborators-section,
.add-collaborators-section {
  margin-bottom: 1.5rem;
}

.collaborators-section h4,
.add-collaborators-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #111827;
  font-weight: 600;
}

.collaborators-grid,
.available-collaborators {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.collaborator-card,
.available-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.collaborator-card:hover,
.available-card:hover {
  border-color: #3498db;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.collaborator-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.collaborator-info {
  flex: 1;
}

.collaborator-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
}

.collaborator-role {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.collaborator-actions {
  display: flex;
  gap: 0.25rem;
}

.collaborator-actions .p-button {
  padding: 0.25rem;
  border-radius: 50%;
  font-size: 0.8rem;
}
</style>