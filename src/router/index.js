
import { createRouter, createWebHistory } from 'vue-router';
import RacketList from '../views/user/RacketList.vue';
import RacketDetail from '../views/user/RacketDetail.vue';
import Dashboard from '../views/admin/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'RacketList',
    component: RacketList,
  },
  {
    path: '/racket/:id',
    name: 'RacketDetail',
    component: RacketDetail,
    props: true,
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
