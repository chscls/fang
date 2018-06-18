import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Slider, Button, Select, Divider, Switch, Tag, Radio,InputNumber } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
const marks = {
  0: '易',
  25: '偏易',
  50: '适中',
  75: '偏难',
  100: '难',
};
@Form.create()
class TestStep1 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isQuestionnaire: false,
      isReady: false,
      isNoOrder:false,
      inputVisible: false,
      inputValue: '',
      mode: 'free',
    };
  }
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);

    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };
  saveInputRef = input => (this.input = input);
  onChange = checked => {
    this.setState({ isQuestionnaire: checked });
  };
  onChangNoOrder = checked => {
    this.setState({ isNoOrder: checked });
  };
  onChangeMode = e => {
    this.setState({ mode: e.target.value });
  };
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
            isQuestionnaire: test.isQuestionnaire,
            isNoOrder:test.isNoOrder,
            mode: test.mode,
          });
        },
      });
    }
  }

  render() {
    const { inputVisible, inputValue, isQuestionnaire,isNoOrder } = this.state;
    const { form, dispatch, data, fyTest: { test },confirmLoading } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (test) {
          values = { ...values, id: test.id };
        }
        if (!err) {
          dispatch({
            type: 'fyTest/add',
            payload: values,
            callback: id => {
              dispatch(routerRedux.push(`/question-manage/test-add/confirm/${id}`));
            },
          });
        }
      });
    };
    return (
      <Fragment>
        {this.state.isReady ? (
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
            <Form.Item {...formItemLayout} label={<span style={{color:"red"}}>* 标题</span> }>
              {getFieldDecorator('title', {
                initialValue: test ? test.title : '',
                rules: [{ required: true, message: '请输入标题' }],
              })(<Input placeholder="请输入标题" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="允许重做次数">
              {getFieldDecorator('allowTime', {
                initialValue: test ? test.allowTime : 0,
                rules: [{ required: true, message: '请输入允许重做次数' }],
              })(<InputNumber placeholder="请输入允许重做次数" />)}
            </Form.Item>
            
            <Form.Item {...formItemLayout} label="模式">
              {getFieldDecorator('mode', {
                initialValue: test ? test.mode : 'free',
                rules: [{ required: true, message: '请选择模式' }],
              })(
                <RadioGroup onChange={this.onChangeMode}>
                  <RadioButton value="free">自由</RadioButton>
                  <RadioButton value="singleLimit">单题限时</RadioButton>
                  <RadioButton value="totalLimit">总限时</RadioButton>
                  <RadioButton value="race">竞赛</RadioButton>
                </RadioGroup>
              )}
            </Form.Item>
            {this.state.mode == 'singleLimit' || this.state.mode == 'totalLimit' ? (
              <Form.Item {...formItemLayout} label="限时秒数">
                {getFieldDecorator('limitSecond', {
                  initialValue: test ? test.limitSecond : -1,
                  rules: [
                    { required: true, message: '请输入秒数' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法数字',
                    },
                  ],
                })(<Input placeholder="请输入分数" />)}
              </Form.Item>
            ) : (
              ''
            )}
            <Form.Item {...formItemLayout} label="是否问卷">
              {getFieldDecorator('isQuestionnaire', {
                initialValue: isQuestionnaire,
              })(<Switch defaultChecked={isQuestionnaire} onChange={this.onChange} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="打乱题目顺序">
              {getFieldDecorator('isNoOrder', {
                initialValue: isNoOrder,
              })(<Switch defaultChecked={isNoOrder} onChange={this.onChangNoOrder} />)}
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
              <Button type="primary" onClick={onValidateForm} loading={confirmLoading}>
                下一步
              </Button>
            </Form.Item>
          </Form>
        ) : (
          ''
        )}
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>如何创建题目</h4>
          <p>先选择题型，再根据题型填写相应的选项。</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ form,loading, fyTest }) => ({
  confirmLoading:loading.effects['fyTest/add'],
  data: form.step,
  fyTest,
}))(TestStep1);
