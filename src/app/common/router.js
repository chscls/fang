
const appRouter = [
    {path:'/user-manage/member-list',models: [require(`../models/fyUser`)],component:() =>import('../routes/UserManage/MemberList'),authority: 'admin'},
    {path:'/user-manage/admin-list',models: [require(`../models/fyUser`)],component:() =>import('../routes/UserManage/AdminList'),authority: 'admin'},
    {path:'/system-manage/sensitive-list',models: [require(`../models/fySensitive`)],component:() =>import('../routes/SystemManage/SensitiveList'),authority: 'admin'},
    {path:'/question-manage/question-list',models: [require(`../models/fyQuestion`)],component:() =>import('../routes/QuestionManage/QuestionList')},
    {path:'/question-manage/test-list',models: [require(`../models/fyTest`)],component:() =>import('../routes/QuestionManage/TestList')},
    {path:'/question-manage/test-list',models: [require(`../models/fyTest`)],component:() =>import('../routes/QuestionManage/TestList')},

    {path:'/question-manage/testRecord-list',models: [require(`../models/fyTestRecord`)],component:() =>import('../routes/QuestionManage/TestRecordList')},

    {path:'/question-manage/testRecord-detail/:orgId',models: [require(`../models/fyTestRecord`)],component:() =>import('../routes/QuestionManage/TestRecordDetail')},

    {path:'/question-manage/test-add',models: [],component:() =>import('../routes/QuestionManage/TestStepForm')},
    {path:'/question-manage/test-add/info/:id',models: [],component:() =>import('../routes/QuestionManage/TestStepForm/Step1')},
    {path:'/question-manage/test-add/confirm/:id',models: [],component:() =>import('../routes/QuestionManage/TestStepForm/Step2')},
    {path:'/question-manage/test-add/result/:id',models: [],component:() =>import('../routes/QuestionManage/TestStepForm/Step3')},
]



/*  
   
    
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