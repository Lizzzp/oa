export const staticRoute = [
  {
    path: '/link_management',
    name: 'link_management',
    meta: {
      title: '链接管理',
      icon: 'el:folder',
      rank: 1
    },
    children: [
      {
        path: '/link_management/link',
        name: 'link',
        meta: {
          title: '链接预览',
          roles: ['Administrator']
        }
      },
      {
        path: '/link_management/link_mark',
        name: 'link_mark',
        meta: {
          title: '链接标记',
          roles: ['Administrator']
        }
      }
    ]
  }
];
