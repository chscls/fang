import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider,Switch } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  constructor(props){
    super(props)
    this.state={
      isRich:false
    }
  }
  onChange=(checked)=>{
    this.setState({isRich:checked})
  }
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          dispatch(routerRedux.push('/question-manage/question-add/confirm'));
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="题型">
            {getFieldDecorator('type', {
              initialValue: "single",
              rules: [{ required: true, message: '请选择题型' }],
            })(
              <Select placeholder="单选">
                <Option value="single">单选</Option>
                <Option value="mutiply">多选</Option>
                <Option value="judge">判断</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="标题富文本">
            {getFieldDecorator('title1', {
              initialValue: false
            })(<Switch checked={this.state.isRich} onChange={this.onChange} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              initialValue: "",
              rules: [{ required: true, message: '请输入标题' }],
            })(<TextArea rows={4} placeholder="请输入标题" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="分数">
            {getFieldDecorator('amount', {
              initialValue: 1,
              rules: [
                { required: true, message: '请输入分数' },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输入合法数字',
                },
              ],
            })(<Input  placeholder="请输入分数" />)}
          </Form.Item>
        
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>如何创建题目</h4>
          <p>
            先选择题型，再根据题型填写相应的选项。
            </p>
         
        </div>
      </Fragment>
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step1);
