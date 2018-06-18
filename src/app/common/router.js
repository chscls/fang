const appRouter = [
  {
    path: '/user-manage/member-list',
    models: [require(`../models/fyUser`)],
    component: () => import('../routes/UserManage/MemberList'),
    authority: 'admin',
  },
  {
    path: '/user-manage/admin-list',
    models: [require(`../models/fyUser`)],
    component: () => import('../routes/UserManage/AdminList'),
    authority: 'admin',
  },
  {
    path: '/system-manage/sensitive-list',
    models: [require(`../models/fySensitive`)],
    component: () => import('../routes/SystemManage/SensitiveList'),
    authority: 'admin',
  },
  {
    path: '/question-manage/question-list',
    models: [require(`../models/fyQuestion`)],
    component: () => import('../routes/QuestionManage/QuestionList'),
  },
  {
    path: '/question-manage/test-list',
    models: [require(`../models/fyTest`)],
    component: () => import('../routes/QuestionManage/TestList'),
  },
  {
    path: '/question-manage/recovery/test-recycle-list',
    models: [require(`../models/fyTest`)],
    component: () => import('../routes/QuestionManage/TestRecycleList'),
  },
  {
    path: '/question-manage/recovery/question-recycle-list',
    models: [require(`../models/fyQuestion`)],
    component: () => import('../routes/QuestionManage/QuestionRecycleList'),
  },
  {
    path: '/question-manage/test-list',
    models: [require(`../models/fyTest`)],
    component: () => import('../routes/QuestionManage/TestList'),
  },

  {
    path: '/question-manage/testRecord-list/:orgId',
    models: [require(`../models/fyTestRecord`)],
    component: () => import('../routes/QuestionManage/TestRecordList'),
  },

  {
    path: '/question-manage/testRecord-detail/:orgId',
    models: [require(`../models/fyTestRecord`)],
    component: () => import('../routes/QuestionManage/TestRecordDetail'),
  },

  {
    path: '/question-manage/test-add',
    models:  [require(`../models/fyTest`)],
    component: () => import('../routes/QuestionManage/TestStepForm'),
  },
  {
    path: '/question-manage/test-add/info/:id',
    models:  [require(`../models/fyTest`)],
    component: () => import('../routes/QuestionManage/TestStepForm/Step1'),
  },
  {
    path: '/question-manage/test-add/confirm/:id',
    models: [require(`../models/fyTest`)],
    component: () => import('../routes/QuestionManage/TestStepForm/Step2'),
  },
  {
    path: '/question-manage/test-add/result/:id',
    models:  [require(`../models/fyTest`)],
    component: () => import('../routes/QuestionManage/TestStepForm/Step3'),
  },
  {
    path: '/question-manage/question-add',
    models: [require(`../models/fyQuestion`)],
    component: () => import('../routes/QuestionManage/QuestionStepForm'),
  },

  {
    path: '/question-manage/question-add/info/:id',
    models: [require(`../models/fyQuestion`)],
    component: () => import('../routes/QuestionManage/QuestionStepForm/Step1'),
  },

  {
    path: '/question-manage/question-add/confirm/:id',
    models: [require(`../models/fyQuestion`)],
    component: () => import('../routes/QuestionManage/QuestionStepForm/Step2'),
  },

  {
    path: '/question-manage/question-add/result/:id',
    models: [require(`../models/fyQuestion`)],
    component: () => import('../routes/QuestionManage/QuestionStepForm/Step3'),
  },

  {
    path: '/question-manage/order-list',
    models: [require(`../models/fyOrder`)],
    component: () => import('../routes/QuestionManage/OrderList'),
  }
];

export default appRouter;
