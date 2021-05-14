import { components } from '@cortezaproject/corteza-vue'

export default [
  {
    path: '',
    name: 'root',
    redirect: { name: 'report.list' },
    component: () => import('./Layout.vue'),
    children: [
      { name: 'report.list', path: '/list', component: () => import('./Report/Index.vue') },
      { name: 'dataSource.list', path: '/list', component: () => import('./DataSource/Index.vue') },
    ],
  },

  { path: '/auth', name: 'auth', component: components.CDevAuth },

  { path: '*', redirect: { name: 'root' } },
]
