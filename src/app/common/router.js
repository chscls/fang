
const appRouter = [
    {path:'/user-manage/member-list',models: [require(`../models/fyUser`)],component:() =>import('../routes/UserManage/MemberList')}

]



/*     '/user-manage/member-list': {
      component: dynamicWrapper(app, ['fyUser'], () => import('../routes/UserManage/MemberList')),
      authority: 'admin',
    },
    '/user-manage/admin-list': {
      component: dynamicWrapper(app, ['fyUser'], () => import('../routes/UserManage/AdminList')),
      authority: 'admin',
    },
    '/system-manage/sensitive-list': {
      component: dynamicWrapper(app, ['fySensitive'], () =>
        import('../routes/SystemManage/SensitiveList')
      ),
      authority: 'admin',
    },
    '/question-manage/question-list': {
      component: dynamicWrapper(app, ['fyQuestion'], () =>
        import('../routes/QuestionManage/QuestionList')
      ),
    },
    '/question-manage/test-list': {
      component: dynamicWrapper(app, ['fyTest'], () => import('../routes/QuestionManage/TestList')),
    },
    '/question-manage/testRecord-list': {
      component: dynamicWrapper(app, ['fyTestRecord'], () =>
        import('../routes/QuestionManage/TestRecordList')
      ),
    },
    '/question-manage/testRecord-detail/:orgId': {
      component: dynamicWrapper(app, ['fyTestRecord'], () =>
        import('../routes/QuestionManage/TestRecordDetail')
      ),
    },

    '/question-manage/test-add': {
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/QuestionManage/TestStepForm')
      ),
    },
    '/question-manage/test-add/info/:id': {
      name: '分步建试卷（填写试卷基本信息）',
      component: dynamicWrapper(app, ['form', 'fyTest'], () =>
        import('../routes/QuestionManage/TestStepForm/Step1')
      ),
    },
    '/question-manage/test-add/confirm/:id': {
      name: '分步建试卷（填写试卷详情）',
      component: dynamicWrapper(app, ['form', 'fyTest'], () =>
        import('../routes/QuestionManage/TestStepForm/Step2')
      ),
    },
    '/question-manage/test-add/result/:id': {
      name: '分步建试卷（完成）',
      component: dynamicWrapper(app, ['form', 'fyTest'], () =>
        import('../routes/QuestionManage/TestStepForm/Step3')
      ),
    },
    '/question-manage/question-add': {
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/QuestionManage/QuestionStepForm')
      ),
    },
    '/question-manage/question-add/info/:id': {
      name: '分步建题（填写题目基本信息）',
      component: dynamicWrapper(app, ['form', 'fyQuestion'], () =>
        import('../routes/QuestionManage/QuestionStepForm/Step1')
      ),
    },
    '/question-manage/question-add/confirm/:id': {
      name: '分步建题（填写题目详情）',
      component: dynamicWrapper(app, ['form', 'fyQuestion'], () =>
        import('../routes/QuestionManage/QuestionStepForm/Step2')
      ),
    },
    '/question-manage/question-add/result/:id': {
      name: '分步建题（完成）',
      component: dynamicWrapper(app, ['form', 'fyQuestion'], () =>
        import('../routes/QuestionManage/QuestionStepForm/Step3')
      ),
    }, */
export default appRouter