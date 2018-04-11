import { isUrl } from '../utils/utils';

const menuData = [{
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
    children: [{
      name: '管理员管理',
      path: 'admin-list',
    },
      {
        name: '医生管理',
        path: 'doctor-list',
      },
      {
        name: '患者管理',
        path: 'patient-list',
      }
    ],
  },
  {
    name: '问卷管理',
    icon: 'solution',
    path: 'questionnaire-manage',
    children: [{
      name: '问卷列表',
      path: 'admin-list5',
    }
    ],
  },
  {
    name: '宣传管理',
    icon: 'sound',
    path: 'course-manage',
    children: [{
      name: '课程管理',
      path: 'admin-list4',
    },{
      name: '康复知识管理',
      path: 'admin-list3',
    }
    ],
  },
  {
    name: '处方管理',
    icon: 'medicine-box',
    path: 'prescription-manage',
    children: [{
      name: '类型管理',
      path: 'admin-list2',
    }
    ],
  },
  {
    name: '系统管理',
    icon: 'tool',
    path: 'system-manage',
    children: [{
      name: '问题反馈',
      path: 'admin-list2',
    }
    ],
  }
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
