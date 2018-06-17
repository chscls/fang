import memberMenu from './memberMenu';

const menuData = [
  {
    name: '控制台',
    icon: 'dashboard',
    path: 'dashboard',
    authority: 'admin',
    children: [
      {
        name: '分析页',
        path: 'analysis',
        authority: 'admin',
      },
      {
        name: '监控页',
        path: 'monitor',
        authority: 'admin',
      },
      {
        name: '工作台',
        path: 'workplace',
        authority: 'admin',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'user',
    path: 'user-manage',
    children: [
      {
        name: '管理员管理',
        path: 'admin-list',
        authority: 'admin',
      },
      {
        name: '会员管理',
        path: 'member-list',
        authority: 'admin',
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'setting',
    path: 'system-manage',
    children: [
      {
        name: '敏感词管理',
        path: 'sensitive-list',
        authority: 'admin',
      },
    ],
  },
  {
    name: '做题',
    icon: 'copy',
    path: 'question-manage',
    children: memberMenu(true)
  }
];

export default menuData;
