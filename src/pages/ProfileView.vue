<template>
  <div class="profile-view">
    <!-- Encabezado del perfil -->
    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar">
          <span class="avatar-initial">{{ username.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
      <div class="profile-meta">
        <h1 class="profile-name">{{ username }}</h1>
        <p class="join-date">Miembro desde {{ joinDate }}</p>
        <div class="rating-section">
          <Rating v-model="rating" :readonly="true" :cancel="false" />
          <span class="rating-text">{{ rating }}.0</span>
        </div>
      </div>
    </div>

    <!-- KPIs Globales del Analista -->
    <div class="kpi-section">
      <h2 class="section-title">Desempeño General</h2>
      <div class="kpi-grid">
        <div class="kpi-card primary">
          <div class="kpi-value">{{ globalKPIs.totalAccounts }}</div>
          <div class="kpi-label">Cuentas a cargo</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-value">{{ globalKPIs.completedTasks }}</div>
          <div class="kpi-label">Tareas completadas</div>
        </div>
        <div class="kpi-card warning">
          <div class="kpi-value">{{ globalKPIs.pendingTasks }}</div>
          <div class="kpi-label">Tareas pendientes</div>
        </div>
        <div class="kpi-card danger">
          <div class="kpi-value">{{ globalKPIs.overdueTasks }}</div>
          <div class="kpi-label">Tareas vencidas</div>
        </div>
      </div>
    </div>

    <!-- Cuentas a cargo -->
    <div class="accounts-section">
      <h2 class="section-title">Cuentas a cargo</h2>
      <div class="accounts-list">
        <div
          v-for="(account, index) in accounts"
          :key="index"
          class="account-card"
          @click="openTaskModal(account)"
        >
          <div class="account-avatar">
            <div class="avatar-bg">{{ account.name.charAt(0).toUpperCase() }}</div>
          </div>
          <div class="account-info">
            <h3 class="account-name">{{ account.name }}</h3>
            <p class="account-desc">{{ account.description }}</p>
            <div class="account-meta">
              <span class="time-indicator">
                <i class="pi pi-clock"></i> {{ account.time }}
              </span>
              <span class="task-count">{{ getAccountKPI(account.name).pendingTasks }} tareas pendientes</span>
            </div>
          </div>
          <i class="pi pi-chevron-right arrow-icon"></i>
        </div>
      </div>
    </div>

    <!-- Modal de Tareas por Cuenta -->
    <Dialog 
      v-model:visible="taskModalVisible" 
      :header="`Tareas para ${selectedAccount.name}`"
      :modal="true" 
      :closable="true"
      :style="{ width: '600px', maxWidth: '95vw' }"
      :draggable="false"
      @hide="closeTaskModal"
    >
      <!-- KPIs específicos de la cuenta -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value">{{ taskKPIs.totalTasks }}</div>
          <div class="kpi-label">Total Tareas</div>
        </div>
        <div class="kpi-card warning">
          <div class="kpi-value">{{ taskKPIs.pendingTasks }}</div>
          <div class="kpi-label">Pendientes</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-value">{{ taskKPIs.completedTasks }}</div>
          <div class="kpi-label">Completadas</div>
        </div>
        <div class="kpi-card danger">
          <div class="kpi-value">{{ taskKPIs.overdueTasks }}</div>
          <div class="kpi-label">Vencidas</div>
        </div>
      </div>

      <!-- Lista de tareas pendientes -->
      <div class="tasks-section">
        <h3 class="tasks-title">Tareas Pendientes</h3>
        <div class="tasks-list">
          <div 
            v-for="task in pendingTasks" 
            :key="task.id" 
            class="task-item"
          >
            <div class="task-content">
              <i class="pi pi-circle-fill task-status" :class="getStatusClass(task.status)"></i>
              <div class="task-details">
                <div class="task-name">{{ task.name }}</div>
                <div class="task-meta">
                  <span class="task-priority" :class="`priority-${task.priority}`">
                    {{ capitalize(task.priority) }}
                  </span>
                  <span class="task-due">{{ task.dueDate }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="pendingTasks.length === 0" class="no-tasks">
            ✅ ¡No hay tareas pendientes!
          </div>
        </div>
      </div>

      <!-- Footer del modal -->
      <template #footer>
        <div class="modal-footer">
          <Button
            label="Ver Todas las Tareas"
            icon="pi pi-external-link"
            class="p-button-primary"
            @click="navigateToTaskView"
          />
          <Button
            label="Cerrar"
            class="p-button-secondary"
            @click="closeTaskModal"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Rating from 'primevue/rating'
import Dialog from 'primevue/dialog'
// Si usas Vue Router, descomenta la siguiente línea:
// import { useRouter } from 'vue-router'
// const router = useRouter()

// Datos del perfil
const username = ref('Analista Ejemplo')
const joinDate = ref('Enero 2024')
const rating = ref(4.5)

// Cuentas
const accounts = ref([
  { name: 'Nestlé', description: 'Cuenta principal', time: 'Hoy • 23 min' },
  { name: 'Kimberly Clark', description: 'Cliente corporativo', time: 'Hoy • 30 min' },
  { name: 'Brandisco', description: 'Marca asociada', time: 'Hoy • 15 min' }
])

// Datos de tareas y KPIs
const taskData = {
  'Nestlé': {
    kpis: { totalTasks: 15, pendingTasks: 8, completedTasks: 7, overdueTasks: 2 },
    tasks: [
      { id: 1, name: 'Revisión de campañas', priority: 'alta', dueDate: 'Hoy', status: 'pending' },
      { id: 2, name: 'Análisis de métricas', priority: 'media', dueDate: 'Mañana', status: 'pending' },
      { id: 3, name: 'Actualización de contenido', priority: 'baja', dueDate: '20/11/2025', status: 'pending' }
    ]
  },
  'Kimberly Clark': {
    kpis: { totalTasks: 12, pendingTasks: 5, completedTasks: 7, overdueTasks: 1 },
    tasks: [
      { id: 1, name: 'Estrategia de contenido', priority: 'alta', dueDate: 'Hoy', status: 'pending' },
      { id: 2, name: 'Revisión de presupuesto', priority: 'media', dueDate: '19/11/2025', status: 'pending' }
    ]
  },
  'Brandisco': {
    kpis: { totalTasks: 8, pendingTasks: 3, completedTasks: 5, overdueTasks: 0 },
    tasks: [
      { id: 1, name: 'Optimización de anuncios', priority: 'media', dueDate: '21/11/2025', status: 'pending' }
    ]
  }
}

// KPIs globales del analista
const globalKPIs = computed(() => {
  let totalAccounts = accounts.value.length
  let completed = 0, pending = 0, overdue = 0

  accounts.value.forEach(acc => {
    const kpis = taskData[acc.name]?.kpis || { completedTasks: 0, pendingTasks: 0, overdueTasks: 0 }
    completed += kpis.completedTasks
    pending += kpis.pendingTasks
    overdue += kpis.overdueTasks
  })

  return { totalAccounts, completedTasks: completed, pendingTasks: pending, overdueTasks: overdue }
})

// Modal
const taskModalVisible = ref(false)
const selectedAccount = ref({ name: '' })

const taskKPIs = computed(() => {
  return taskData[selectedAccount.value.name]?.kpis || { totalTasks: 0, pendingTasks: 0, completedTasks: 0, overdueTasks: 0 }
})

const pendingTasks = computed(() => {
  return taskData[selectedAccount.value.name]?.tasks || []
})

const getAccountKPI = (accountName) => {
  return taskData[accountName]?.kpis || { pendingTasks: 0 }
}

const openTask_MODAL = (account) => {
  selectedAccount.value = account
  taskModalVisible.value = true
}

// Corregido: nombre de función
const openTaskModal = (account) => {
  selectedAccount.value = account
  taskModalVisible.value = true
}

const closeTaskModal = () => {
  taskModalVisible.value = false
  selectedAccount.value = { name: '' }
}

const navigateToTaskView = () => {
  // Si usas Vue Router:
  // router.push('/tasks')
  console.log('Navegando a la vista de tareas')
  closeTaskModal()
}

const getStatusClass = (status) => {
  return {
    'pending': 'status-pending',
    'completed': 'status-completed',
    'overdue': 'status-overdue'
  }[status] || 'status-pending'
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
</script>

<style scoped>
.profile-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e293b;
}

/* Perfil Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #3498db;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 2.2rem;
}

.profile-meta {
  flex: 1;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.join-date {
  margin: 0 0 0.75rem 0;
  color: #64748b;
  font-size: 0.95rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rating-text {
  color: #64748b;
  font-weight: 600;
}

/* KPIs */
.kpi-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #1e293b;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.25rem;
}

.kpi-card {
  text-align: center;
  padding: 1.25rem 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.kpi-value {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.kpi-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
}

/* Variants */
.kpi-card.primary .kpi-value { color: #3b82f6; }
.kpi-card.success .kpi-value { color: #10b981; }
.kpi-card.warning .kpi-value { color: #f59e0b; }
.kpi-card.danger .kpi-value { color: #ef4444; }

/* Cuentas */
.accounts-section {
  margin-bottom: 2rem;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.account-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.account-card:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  border-left: 4px solid #3498db;
}

.account-avatar {
  width: 60px;
  height: 60px;
  margin-right: 1.25rem;
  flex-shrink: 0;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  background: #3498db;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

.account-info {
  flex: 1;
}

.account-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #1e293b;
}

.account-desc {
  margin: 0 0 0.5rem 0;
  color: #64748b;
  font-size: 0.95rem;
}

.account-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.time-indicator, .task-count {
  font-size: 0.85rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.arrow-icon {
  color: #cbd5e1;
  font-size: 1.25rem;
  margin-left: auto;
  flex-shrink: 0;
}

/* Modal */
.kpi-card.warning { background: #fffbeb; border-color: #fde68a; }
.kpi-card.success { background: #f0fdf4; border-color: #bbf7d0; }
.kpi-card.danger { background: #fef2f2; border-color: #fecaca; }

.tasks-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.task-item {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  background: #fafbff;
}

.task-status {
  font-size: 0.55rem;
  margin-top: 0.35rem;
}

.status-pending { color: #f59e0b; }
.status-completed { color: #10b981; }
.status-overdue { color: #ef4444; }

.task-name {
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.task-meta {
  display: flex;
  gap: 1.25rem;
  font-size: 0.85rem;
  color: #94a3b8;
}

.task-priority {
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-Alta { background: #fee2e2; color: #dc2626; }
.priority-Media { background: #fef3c7; color: #d97706; }
.priority-Baja { background: #dcfce7; color: #16a34a; }

.no-tasks {
  text-align: center;
  padding: 1.5rem;
  color: #64748b;
  font-style: italic;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 1.25rem;
  }
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>