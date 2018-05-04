import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import  Single  from '../../../components/mycom/QuestionItem/Single';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  constructor(props){
    super(props)
    this.state={
     
      isReady:false,
      items:[],
    }
  }
  componentDidMount(){
    const id=this.props.match.params.id
    this.props.dispatch({
      type: 'fyQuestion/clear',
      payload: null
    });
    if(id==0){
      this.setState({isReady:true})
    }else{
      this.props.dispatch({
        type: 'fyQuestion/find',
        payload: {id:id},
        callback:(question)=>{
          this.setState({isReady:true,items:question.items});
        }
      });
    }
  }
  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const items = this.state.items;
    const onPrev = () => {
      dispatch(routerRedux.push('/question-manage/question-add/info'));
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };
    return (
      <div>
      {this.state.isReady? <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="请选择一个正确答案,并保证至少有2个选项"
          style={{ marginBottom: 24 }}
        />
        <Form.Item {...formItemLayout} label="选项">
          {getFieldDecorator('price', {
            initialValue: { items:items},
            rules: [{ validator: this.checkPrice }],
          })(<Single />)}
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
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>:""}
      </div>
    );
  }
}

export default connect(({ form, loading,fyQuestion }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,fyQuestion
}))(Step2);
