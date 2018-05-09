import React,{ Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import Single from '../../../components/mycom/QuestionItem/Single';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 23,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      isRich: false,
      isQuestionnaire:false,
      title: '',
      isReady: false,
      items: [],
    };
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.dispatch({
      type: 'fyQuestion/clear',
      payload: null,
    });
    if (id == 0) {
      this.setState({ isReady: true });
    } else {
      this.props.dispatch({
        type: 'fyQuestion/find',
        payload: { id: id },
        callback: question => {

         const items =  question.items
          if (items.length == 0) {
            items.push({ content: '', isSolution: false });
            items.push({ content: '', isSolution: false });
          } else if (x.length == 1) {
            items.push({ content: '', isSolution: false });
          }


          this.setState({
            isReady: true,
            id: question.id,
            items: items,
            isRich: question.isRich,
            isQuestionnaire:question.isQuestionnaire,
            title: question.title,
          });
        },
      });
    }
  }
  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const items = this.state.items;
    const isQuestionnaire = this.state.isQuestionnaire

  



    const onPrev = () => {
      dispatch(routerRedux.push(`/question-manage/question-add/info/${this.state.id}`));
    };
    const onValidateForm = e => {
      
      e.preventDefault();
      validateFields((err, values) => {
        
        if (!err) {
          dispatch({
            type: 'fyQuestion/updateOptions',
            payload: {
              id:this.state.id,
              options:JSON.stringify(values.options),
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
              {this.state.isRich ? (
                <div dangerouslySetInnerHTML={{ __html: this.state.title }} />
              ) : (
                <div> {this.state.title}</div>
              )}
            </Form.Item>

            <Form.Item style={{ maxWidth: 1000 }} {...formItemLayout} label="选项">
              {getFieldDecorator('options', {
                initialValue: { items: items,isQuestionnaire:isQuestionnaire }
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

export default connect(({ form, loading, fyQuestion }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
  fyQuestion,
}))(Step2);
