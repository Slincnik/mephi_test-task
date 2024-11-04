import { createWebHistory, createRouter } from "vue-router";
import IndexPage from "@/pages/IndexPage.vue";
import CardPage from "@/pages/CardPage.vue";

export const routes = [
  { path: "/", component: IndexPage },
  { path: "/card/:number", component: CardPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
