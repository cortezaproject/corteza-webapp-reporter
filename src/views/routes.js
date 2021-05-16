import { components } from '@cortezaproject/corteza-vue'

export default [
  {
    path: '',
    name: 'root',
    redirect: { name: 'reports' },
    component: () => import('./Layout.vue'),
    children: [
      { name: 'reports', path: '/reports', component: () => import('./Report/Index.vue') },
      { name: 'reports.view', path: '/reports/:reportID', component: () => import('./Report/Index.vue') },
      { name: 'reports.create', path: '/reports/new', component: () => import('./Report/Index.vue') },
      { name: 'reports.edit', path: '/reports/:reportID/edit', component: () => import('./Report/Index.vue') },
      { name: 'dataSources', path: '/data-sources', component: () => import('./DataSource/Index.vue') },
    ],
  },

  { path: '/auth', name: 'auth', component: components.CDevAuth },

  { path: '*', redirect: { name: 'root' } },
]
