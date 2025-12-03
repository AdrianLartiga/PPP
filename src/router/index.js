import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'
import ProfileView from '../pages/ProfileView.vue'
import TaskView from '../pages/Tasks.vue'
import TeamView from '../pages/Team.vue'

const routes = [
  // Login sin layout
  { path: '/', name: 'Login', component: Login },

  // Rutas internas con el MainLayout
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/profile', name: 'Profile', component: ProfileView },
      { path: '/tasks', name: 'Task', component: TaskView },
      { path: '/team', name: 'Team', component: TeamView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
