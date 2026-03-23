import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue'; 
import RacketList from '../views/user/RacketList.vue';
import RacketDetail from '../views/user/RacketDetail.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import RacketManage from '../views/admin/RacketManage.vue';
import RacketForm from '../views/admin/RacketForm.vue';
import Login from '../views/Login.vue';
import Profile from '../views/user/Profile.vue'; // 프로필 컴포넌트 임포트
import { supabase } from '../supabase';

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
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }, // 로그인 필수
  },
  {
    path: '/admin',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin: true }, 
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: { 
          render() { 
            return h('div', { class: 'p-6' }, [
              h('h2', { class: 'text-2xl font-bold' }, '대시보드 통계'),
              h('p', { class: 'text-gray-500 mt-2' }, '준비 중입니다.')
            ])
          } 
        }
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

// 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const { data: { user } } = await supabase.auth.getUser();

  if (requiresAdmin) {
    if (user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        alert('프로필 정보를 가져오는 중 오류가 발생했습니다.');
        next('/');
        return;
      }

      if (profile && profile.role === 'admin') {
        next();
      } else {
        alert('관리자만 접근할 수 있습니다.');
        next('/');
      }
    } else {
      alert('로그인이 필요합니다.');
      next({ name: 'Login' });
    }
  } else if (requiresAuth) {
    if (user) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router;
