import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Slider, Button, Select, Divider, Switch, Tag, Radio } from 'antd';
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
      text: '',
      isRich: false,
      isReady: false,
      loading: false,
      tags: [],
      inputVisible: false,
      inputValue: '',
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
    this.setState({ isRich: checked });
  };
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
          this.setState({
            isReady: true,
            tags: question.tags,
            text: question.title,
            isRich: question.isRich,
          });
        },
      });
    }
  }
  onChangeValue = text => {
    this.setState({ text: text });
  };

  render() {
    
    const { tags, inputVisible, inputValue, isRich } = this.state;
    const { form, dispatch, data, fyQuestion: { question } } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (question) {
          values = { ...values, id: question.id };
        }
        if (this.state.isRich) {
          values = { ...values, title: this.state.text };
        }
        values = { ...values, tags: tags };
        if (!err) {
          dispatch({
            type: 'fyQuestion/add',
            payload: values,
            callback: id => {
              dispatch(routerRedux.push(`/question-manage/question-add/confirm/${id}`));
            },
          });
        }
      });
    };
    return (
      <Fragment>
        {this.state.isReady ? 
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
           
           <Form.Item {...formItemLayout} label="标题">
              {
                getFieldDecorator('title', {
                  initialValue: question ? question.title : '',
                  rules: [{ required: true, message: '请输入标题' }],
                })(<Input  placeholder="请输入标题" />)
              }
            </Form.Item>
            <Form.Item {...formItemLayout} label="模式">
              {getFieldDecorator('type', {
                initialValue: question ? question.type : 'single',
                rules: [{ required: true, message: '请选择模式' }],
              })(
                <RadioGroup>
                  <RadioButton value="single">自由</RadioButton>
                  <RadioButton value="mutiply">单题限时</RadioButton>
                  <RadioButton value="judge">总限时</RadioButton>
                  <RadioButton value="fill">竞赛</RadioButton>
                
                </RadioGroup>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否问卷">
              {getFieldDecorator('isQuestionnaire', {
                initialValue: isRich,
              })(<Switch defaultChecked={isRich} onChange={this.onChange} />)}
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
              <Button type="primary" onClick={onValidateForm} loading={this.state.loading}>
                下一步
              </Button>
            </Form.Item>
          </Form>
         : ''}
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

export default connect(({ form, fyQuestion }) => ({
  data: form.step,
  fyQuestion,
}))(TestStep1);
