import { createWebHistory, createRouter } from 'vue-router'
import IndexPage from '@/pages/IndexPage.vue'

export const routes = [
  { path: '/', component: IndexPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router