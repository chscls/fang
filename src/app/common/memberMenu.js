

export default function getMenu(isAdmin){
        var questionMng;
          if(isAdmin){
            questionMng=''
          }else{
            questionMng='question-manage/'
          }
            
          return  [
            {
              name: '题库管理',
              icon: questionMng==''?null:'database',
              path: `${questionMng}question-list`,
            },
            {
              name: '试卷管理',
              icon:questionMng==''?null:'schedule',
              path: `${questionMng}test-list`,
            },{
              name: '熟人管理',
              icon: questionMng==''?null:'shopping-cart',
              path: `${questionMng}person-list`
            } ,{
              name: '订单管理',
              icon: questionMng==''?null:'shopping-cart',
              path: `${questionMng}order-list`
            } ,{
              name: '回收站',
              icon:questionMng==''?null:'delete',
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
          
      }