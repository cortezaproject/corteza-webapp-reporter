export default [
  {
    path: '',
    name: 'root',
    redirect: { name: 'report' },
    component: () => import('./Layout'),
    children: [
      {
        name: 'report',
        path: '/report',
        component: () => import('./Report'),
        redirect: { name: 'report.list' },
        children: [
          { name: 'report.list', path: 'list', component: () => import('./Report/List') },
          { name: 'report.view', path: '/:reportID', component: () => import('./Report/View') },
          { name: 'report.create', path: 'new', component: () => import('./Report/Edit') },
          { name: 'report.edit', path: '/:reportID/edit', component: () => import('./Report/Edit') },
          { name: 'report.builder', path: '/:reportID/builder', component: () => import('./Report/Builder') },
        ],
      },
    ],
  },

  { path: '*', redirect: { name: 'root' } },
]
