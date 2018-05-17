import React,{ Fragment } from 'react';
import { connect } from 'dva';
import { Form,Icon, Input, Button, Alert, Divider ,List,Avatar,Checkbox} from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import Single from '../../../components/mycom/QuestionItem/Single';
import Judge from '../../../components/mycom/QuestionItem/Judge';
import Mutiply from '../../../components/mycom/QuestionItem/Mutiply';
import Fill from '../../../components/mycom/QuestionItem/Fill';
import Ask from '../../../components/mycom/QuestionItem/Ask';
import styles from './style.less';
import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';

const formItemLayout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 23,
  },
};
const plainOptions=[]
const defaultCheckedList = [];
@Form.create()
class TestStep2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      isRich: false,
      isQuestionnaire:false,
      title: '',
      isReady: false,
      items: [],
      type:"single",
      checkedList: [],
      indeterminate: true,
      checkAll: false,
     
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.dispatch({
      type: 'fyTest/clear',
      payload: null,
    });
    if (id == 0) {
      this.setState({ isReady: true });
    } else {
      this.props.dispatch({
        type: 'fyTest/find',
        payload: { id: id },
        callback: test => {

        

          this.setState({
            isReady: true,
            id: test.id,
            isQuestionnaire:test.isQuestionnaire,
          });
        },
      });
    }
  }
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  render() {
    const { form, data, dispatch, submitting ,fyTest: { test } } = this.props;
    const { getFieldDecorator, validateFields } = form;



    const data2 = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
    ];

    const onPrev = () => {
      dispatch(routerRedux.push(`/question-manage/test-add/info/${this.state.id}`));
    };
    const onValidateForm = e => {
      
      e.preventDefault();
      validateFields((err, values) => {
        
        if (!err) {
          dispatch({
            type: 'fyTest/updateQuestions',
            payload: {
              id:this.state.id,
             
            },
            callback: id => {
              dispatch(routerRedux.push(`/question-manage/test-add/result/${id}`));
            },
          });
        }
      });
    };
    return (
      <Fragment>
        {this.state.isReady ? 
          <Form layout="horizontal" className={styles.stepForm} style={{ maxWidth: 1000 }}>
            
            <Form.Item {...formItemLayout} label="标题">
            
                <div> {test.title}</div>
            
            </Form.Item>
            <Form.Item {...formItemLayout} label="题目">
            <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
            <Checkbox.Group style={{ width: '100%' }} options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange}>
            <List
    itemLayout="horizontal"
    dataSource={data2}
    renderItem={item => (
     
      <List.Item>
     <Checkbox value="D"/><span > {item.title}<Icon type="close" /><Icon type="pause" /></span>
      </List.Item>
     
    )}
  />
   </Checkbox.Group>
          </Form.Item>  
            <Form.Item
              style={{ marginBottom: 8 }}
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
            <div style={{ margin:"auto",width:200 }}>
              <Button   type="primary" onClick={onValidateForm} loading={submitting}>
                提交
              </Button>
              <Button onClick={onPrev} style={{ marginLeft: 8 }}>
                上一步
              </Button>
              </div>
            </Form.Item>
          </Form>
         : 
          ''
        }
         <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>问卷模式</h4>
          <p>问卷模式无需选择或填写正确答案</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ form, loading, fyTest }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
  fyTest,
}))(TestStep2);
