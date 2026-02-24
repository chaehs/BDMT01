
import { createRouter, createWebHistory } from 'vue-router';
import RacketList from '../components/RacketList.vue';
import RacketDetail from '../components/RacketDetail.vue';
import Admin from '../components/Admin.vue';

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
    name: 'Admin',
    component: Admin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
