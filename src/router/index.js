import { createRouter, createWebHistory } from 'vue-router';
import RacketList from '../views/user/RacketList.vue';
import RacketDetail from '../views/user/RacketDetail.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import RacketManage from '../views/admin/RacketManage.vue';
import RacketForm from '../views/admin/RacketForm.vue';

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
  },
  {
    path: '/admin',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: { template: '<div class="p-6"><h2 class="text-2xl font-bold">대시보드 통계</h2><p class="text-gray-500 mt-2">준비 중입니다.</p></div>' }
      },
      {
        path: 'rackets',
        name: 'AdminRackets',
        component: RacketManage,
      },
      {
        path: 'racket/new',
        name: 'AdminRacketNew',
        component: RacketForm,
      },
      {
        path: 'racket/edit/:id',
        name: 'AdminRacketEdit',
        component: RacketForm,
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
