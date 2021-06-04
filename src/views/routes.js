export default [
  {
    path: '',
    name: 'root',
    redirect: { name: 'report' },
    component: () => import('./Layout.vue'),
    children: [
      {
        name: 'report',
        path: '/report',
        component: () => import('./Report/Index.vue'),
        redirect: { name: 'report.list' },
        children: [
          { name: 'report.list', path: 'list', component: () => import('./Report/List.vue') },
          { name: 'report.view', path: '/:reportID', component: () => import('./Report/View.vue') },
          { name: 'report.create', path: 'new', component: () => import('./Report/Edit.vue') },
          { name: 'report.edit', path: '/reportID/edit', component: () => import('./Report/Edit.vue') },
          { name: 'report.builder', path: '/:reportID/builder', component: () => import('./Report/Builder.vue') },
        ],
      },
    ],
  },

  { path: '*', redirect: { name: 'root' } },
]
