import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '控制台',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
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
      },
      {
        name: '会员管理',
        path: 'member-list',
      },
    ],
  },
  {
    name: '题库管理',
    icon: 'user',
    path: 'question-manage',
    children: [
      {
        name: '题库管理',
        path: 'admin-list2',
      },
      {
        name: '试卷管理',
        path: 'member-list2',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
