import { tdc } from '../boot/app'

export let rotas = [
  { 
    path: '/rotas', 
    component: () => import('../components/MyTest.vue'), 
    name: 'list_test', 
    meta: { title: tdc('Lista de') + ' ' + tdc('Tests'), 
    requiresAuth: true, 
    requiredRole: 'list_test' } 
  },
]

export const mytech = {
  path: '/',
  component: () => import('../layouts/MainLayout.vue'),
  children: { 
    path: '/Teste', 
    component: () => import('../components/MyTest.vue'), 
    name: 'list_test', 
    meta: { title: tdc('Lista de') + ' ' + tdc('Tests'), 
    requiresAuth: true, 
    requiredRole: 'list_test' } 
  },
}

export const auth = {
  path: '/',
  component: () => import('../layouts/AuthLayout.vue'),
  children: [
    { path: 'login', component: () => import('./auth/LoginPage.vue'), name: 'login' },
  ],
}