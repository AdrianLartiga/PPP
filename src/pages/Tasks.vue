<template>
  <div class="task-view">
    <!-- Encabezado -->
    <div class="page-header">
      <h1>Tareas de Cuenta</h1>
    </div>

    <!-- Filtros avanzados -->
    <div class="filters-container">
      <!-- Filtros por fecha -->
      <div class="filter-group">
        <div class="filter-subtitle">Fecha de actualización:</div>
        <div class="filter-item">
          <input id="filter-today" type="checkbox" v-model="filters.today" @change="applyFilters" class="filter-checkbox" />
          <label for="filter-today" class="filter-label">Hoy</label>
        </div>
        <div class="filter-item">
          <input id="filter-yesterday" type="checkbox" v-model="filters.yesterday" @change="applyFilters" class="filter-checkbox" />
          <label for="filter-yesterday" class="filter-label">Ayer</label>
        </div>
        <div class="filter-item">
          <input id="filter-older" type="checkbox" v-model="filters.older" @change="applyFilters" class="filter-checkbox" />
          <label for="filter-older" class="filter-label">Hace 2+ días</label>
        </div>
      </div>

      <!-- Filtros por cuenta y tipo -->
      <div class="filter-group">
        <div class="filter-subtitle">Cuenta:</div>
        <Dropdown
          v-model="filters.account"
          :options="accountOptions"
          option-label="name"
          option-value="id"
          placeholder="Todas las cuentas"
          @change="applyFilters"
          style="min-width: 180px"
        />
      </div>

      <div class="filter-group">
        <div class="filter-subtitle">Tipo de actividad:</div>
        <Dropdown
          v-model="filters.type"
          :options="typeOptions"
          placeholder="Todos los tipos"
          @change="applyFilters"
          style="min-width: 180px"
        />
      </div>

      <!-- Botón limpiar -->
      <div class="filter-actions">
        <Button
          label="Limpiar filtros"
          icon="pi pi-filter-slash"
          class="p-button-outlined p-button-sm"
          @click="clearFilters"
        />
      </div>
    </div>

    <!-- Pestañas (opcional: podrías usarlas para ordenar, pero aquí las mantenemos) -->
    <div class="tabs-container">
      <Button
        v-for="tab in tabs"
        :key="tab.key"
        :label="tab.label"
        @click="changeTab(tab.key)"
        :class="{ 'p-button-outlined': activeTab !== tab.key, 'p-button-secondary': activeTab === tab.key }"
        class="tab-button"
      />
    </div>

    <!-- Grupos por Cuenta -->
    <div v-for="account in groupedTasks" :key="account.id" class="account-section">
      <h2 class="account-title">{{ account.name }}</h2>

      <!-- Actividades por tipo -->
      <div v-for="type in account.types" :key="type.name" class="type-section">
        <h3 class="type-title">{{ type.name }}</h3>
        <div class="tasks-grid">
          <div
            v-for="task in type.tasks"
            :key="task.id"
            class="task-card"
            @click="openModal(task)"
          >
            <div class="task-avatar">
              <div class="avatar-bg">{{ task.name.charAt(0).toUpperCase() }}</div>
            </div>
            <div class="task-info">
              <h3>{{ task.name }}</h3>
              <p class="task-status">{{ task.statusLabel }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Archivos -->
    <Dialog
      v-model:visible="showModal"
      :header="selectedTask ? `Archivos de la actividad: ${selectedTask.name}` : ''"
      :modal="true"
      :closable="true"
      :style="{ width: '50vw' }"
      @hide="resetModal"
    >
      <div class="modal-content">
        <div class="activity-info">
          <p><strong>Cuenta:</strong> {{ selectedTask?.account }}</p>
          <p><strong>Tipo:</strong> {{ selectedTask?.type }}</p>
          <p><strong>Última actualización:</strong> {{ selectedTask?.statusLabel }}</p>
        </div>

        <!-- Drag and drop -->
        <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
          <div class="upload-content">
            <i class="pi pi-cloud-upload upload-icon"></i>
            <p class="upload-text">Arrastra y suelta tu archivo aquí</p>
            <p class="upload-subtext">o haz clic para seleccionar un archivo</p>
            <input 
              type="file" 
              ref="fileInputRef" 
              style="display: none;" 
              @change="onFileSelect" 
              accept=".xlsx, .xls, .pdf, .doc, .docx"
            />
          </div>
        </div>

        <!-- Historial de archivos -->
        <div class="file-history-section">
          <h3 class="history-title">Historial de Archivos</h3>
          <div class="file-history-list">
            <div 
              v-for="(file, index) in fileHistory" 
              :key="index" 
              class="file-history-item"
            >
              <div class="file-info">
                <i class="pi pi-file file-icon"></i>
                <div class="file-details">
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-meta">{{ file.size }} • {{ file.date }} • Subido por {{ file.uploader }}</span>
                </div>
              </div>
              <Button
                icon="pi pi-download"
                class="p-button-text p-button-plain download-btn"
                @click="downloadFile(file)"
                title="Descargar archivo"
              />
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

// Pestañas (se mantienen, aunque la agrupación ya organiza los datos)
const tabs = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'tarea', label: 'Tarea' },
  { key: 'planning', label: 'Planning' },
  { key: 'reporte', label: 'Reporte' }
];
const activeTab = ref('tarea');

// Filtros
const filters = ref({
  today: true,
  yesterday: true,
  older: true,
  account: null,
  type: null
});

// Datos de ejemplo mejorados
const tasks = ref([
  { id: 1, name: 'Informe Mensual', account: 'Cuenta Nestlé', type: 'Reporte', status: 'today' },
  { id: 2, name: 'Planning Semanal', account: 'Cuenta Nestlé', type: 'Planning', status: 'yesterday' },
  { id: 3, name: 'Análisis de Datos', account: 'Cuenta Nestlé', type: 'Tarea', status: 'older' },
  { id: 4, name: 'Resumen Ejecutivo', account: 'Cuenta Kimberly Clark', type: 'Reporte', status: 'today' },
  { id: 5, name: 'Agenda de Reuniones', account: 'Cuenta Kimberly Clark', type: 'Planning', status: 'yesterday' },
  { id: 6, name: 'Revisión de KPIs', account: 'Cuenta Brandisco', type: 'Reporte', status: 'older' },
  { id: 7, name: 'Seguimiento Clientes', account: 'Cuenta Nestlé', type: 'Tarea', status: 'today' },
  { id: 8, name: 'Presupuesto 2025', account: 'Cuenta Kimberly Clark', type: 'Planning', status: 'today' }
]);

// Mapeo de estado a etiqueta legible
const getStatusLabel = (status) => {
  if (status === 'today') return 'Actualizado hoy';
  if (status === 'yesterday') return 'Actualizado ayer';
  return 'Actualizado hace 2+ días';
};

// Agregar label legible a las tareas
tasks.value.forEach(task => {
  task.statusLabel = getStatusLabel(task.status);
});

// Opciones de filtro
const accountOptions = computed(() =>
  [...new Set(tasks.value.map(t => t.account))]
    .map(acc => ({ id: acc, name: acc }))
);

const typeOptions = computed(() =>
  [...new Set(tasks.value.map(t => t.type))]
);

// Agrupación con filtros aplicados
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // Filtro por fecha
    const matchDate = 
      (task.status === 'today' && filters.value.today) ||
      (task.status === 'yesterday' && filters.value.yesterday) ||
      (task.status === 'older' && filters.value.older);

    // Filtro por cuenta
    const matchAccount = !filters.value.account || task.account === filters.value.account;

    // Filtro por tipo
    const matchType = !filters.value.type || task.type === filters.value.type;

    return matchDate && matchAccount && matchType;
  });
});

const groupedTasks = computed(() => {
  const groups = {};
  filteredTasks.value.forEach(task => {
    const acc = task.account || 'Sin cuenta';
    if (!groups[acc]) {
      groups[acc] = {
        id: acc,
        name: acc,
        types: {}
      };
    }
    if (!groups[acc].types[task.type]) {
      groups[acc].types[task.type] = {
        name: task.type,
        tasks: []
      };
    }
    groups[acc].types[task.type].tasks.push(task);
  });

  // Convertir a array para v-for
  return Object.values(groups).map(group => ({
    ...group,
    types: Object.values(group.types)
  }));
});

// Modal
const showModal = ref(false);
const selectedTask = ref(null);
const fileInputRef = ref(null);

const fileHistory = ref([
  { name: 'informe_mensual.xlsx', size: '2.4 MB', date: '15 Nov 2025', uploader: 'Juan Pérez' },
  { name: 'informe_mensual.xlsx', size: '1.8 MB', date: '12 Nov 2025', uploader: 'María López' },
  { name: 'informe_mensual.xlsx', size: '3.2 MB', date: '10 Nov 2025', uploader: 'Carlos García' }
]);

// Funciones
const changeTab = (tabKey) => {
  activeTab.value = tabKey;
  // Puedes extender lógica si deseas reordenar por pestaña
};

const applyFilters = () => { /* computed lo maneja */ };

const clearFilters = () => {
  filters.value = {
    today: true,
    yesterday: true,
    older: true,
    account: null,
    type: null
  };
};

const openModal = (task) => {
  selectedTask.value = task;
  showModal.value = true;
};

const resetModal = () => {
  selectedTask.value = null;
};

const triggerFileInput = () => {
  fileInputRef.value.click();
};

const handleDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    console.log('Archivo soltado:', files[0].name);
  }
};

const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log('Archivo seleccionado:', file.name);
  }
};

const downloadFile = (file) => {
  console.log(`Descargando archivo: ${file.name}`);
};
</script>

<style scoped>
.task-view {
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
.filters-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 180px;
}

.filter-subtitle {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #3498db;
  cursor: pointer;
}

.filter-label {
  font-size: 0.9rem;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
}

.filter-actions .p-button {
  height: 38px;
}

/* Pestañas */
.tabs-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tab-button {
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-width: 80px;
  text-align: center;
}

.tab-button.p-button-secondary {
  background: #ffaa7a !important;
  color: white !important;
  border-color: #ffaa7a !important;
}

/* Agrupación */
.account-section {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.account-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.25rem;
}

.type-section {
  margin-bottom: 1.5rem;
}

.type-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

/* Grid de tareas */
.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.task-card {
  background: #3498db;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.task-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.task-status {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Modal */
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-info {
  background: #f1f8ff;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
}

.activity-info p {
  margin: 0.25rem 0;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #3498db;
  background: #f1f8ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 3rem;
  color: #94a3b8;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.upload-subtext {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.file-history-section {
  margin-top: 1rem;
}

.history-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.file-history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  transition: box-shadow 0.2s;
}

.file-history-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.file-icon {
  font-size: 1.5rem;
  color: #3498db;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: #1e293b;
}

.file-meta {
  font-size: 0.8rem;
  color: #64748b;
}

.download-btn {
  color: #3498db;
  padding: 0.5rem;
}

.download-btn:hover {
  color: #2980b9;
}
</style>