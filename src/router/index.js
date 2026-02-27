import { createRouter, createWebHistory } from 'vue-router';
import RacketList from '../views/user/RacketList.vue';
import RacketDetail from '../views/user/RacketDetail.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import RacketManage from '../views/admin/RacketManage.vue';
import RacketForm from '../views/admin/RacketForm.vue';
import Login from '../views/Login.vue';
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
    path: '/admin',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin: true }, // 관리자 역할 필요!
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

// 네비게이션 가드 강화!
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const { data: { user } } = await supabase.auth.getUser();

  if (requiresAdmin) {
    if (user) {
      // 'profiles' 테이블에서 사용자 프로필을 가져옵니다.
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: single() did not return a record
        console.error('Error fetching profile:', error);
        alert('프로필 정보를 가져오는 중 오류가 발생했습니다.');
        next('/');
        return;
      }

      // is_admin이 true인지 확인합니다.
      if (profile && profile.is_admin) {
        next(); // 관리자면 통과
      } else {
        alert('관리자만 접근할 수 있습니다.');
        next('/'); // 관리자가 아니면 메인 페이지로 리디렉션
      }
    } else {
      alert('로그인이 필요합니다.');
      next({ name: 'Login' }); // 로그인하지 않았다면 로그인 페이지로
    }
  } else if (requiresAuth) {
    if (user) {
      next(); // 로그인했다면 통과
    } else {
      next({ name: 'Login' }); // 로그인 안했다면 로그인 페이지로
    }n  } else {
    next();
  }
});

export default router;
