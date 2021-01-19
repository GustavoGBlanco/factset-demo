import { createRouter, createWebHistory } from 'vue-router';

import GlobersList from './pages/globers/GlobersList.vue';
import GloberProfile from './pages/globers/GloberProfile.vue';
import NotFound from './pages/NotFound.vue';
import GloberAuth from './pages/auth/GloberAuth.vue';
import store from './store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/globers' },
    { path: '/globers', component: GlobersList, meta: { requiresAuth: true } },
    { path: '/profile', component: GloberProfile, meta: { requiresAuth: true } },
    { path: '/auth', component: GloberAuth, meta: { requiresUnauth: true } },
    { path: '/:notFound(.*)', component: NotFound }
  ]
});

router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/globers');
  } else {
    next();
  }
})

export default router;

