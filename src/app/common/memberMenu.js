 var questionMng='question-manage/'
 
 const memeberMenu = 
    [
      {
        name: '题库管理',
        icon:'database',
        path: `${questionMng}question-list`,
      },
      {
        name: '试卷管理',
        icon:'schedule',
        path: `${questionMng}test-list`,
      },
      {
        name: '做题记录',
        icon:'form',

        path: `${questionMng}testRecord-list`,
      },{
        name: '订单管理',
        icon: 'shopping-cart',
        path: `${questionMng}order-list`
      } ,{
        name: '回收站',
        icon:'delete',
        path: `${questionMng}recovery`,
        children: [
          {
            name: '题目回收',
            path: 'question-recycle-list',
          },
          {
            name: '试卷回收',
            path: 'test-recycle-list',
          },
        ]
      }]
      export default function setToken(isAdmin){
          if(isAdmin){
            questionMng=''
          }else{
            return memeberMenu
          }
      }