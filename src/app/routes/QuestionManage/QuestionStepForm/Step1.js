import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Slider, Button, Select, Divider, Switch, Tag, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import RichEditor from '../../../components/RichEditor/RichEditor';

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
class QuestionStep1 extends React.PureComponent {
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
        {this.state.isReady ? (
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
            <Form.Item {...formItemLayout} label="题型">
              {getFieldDecorator('type', {
                initialValue: question ? question.type : 'single',
                rules: [{ required: true, message: '请选择题型' }],
              })(
                <RadioGroup>
                  <RadioButton value="single">单选</RadioButton>
                  <RadioButton value="mutiply">多选</RadioButton>
                  <RadioButton value="judge">判断</RadioButton>
                  <RadioButton value="fill">填空</RadioButton>
                  <RadioButton value="ask">问答</RadioButton>
                </RadioGroup>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="标签">
              {tags.map((tag, index) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <Icon type="plus" /> 新标签
                </Tag>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="标题富文本">
              {getFieldDecorator('isRich', {
                initialValue: isRich,
              })(<Switch defaultChecked={isRich} onChange={this.onChange} />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="标题">
              {this.state.isRich ? (
                <RichEditor
                  defaultValue={question ? question.title : ''}
                  className="ant-row ant-form-item"
                  onChangeValue={this.onChangeValue}
                />
              ) : (
                getFieldDecorator('title', {
                  initialValue: question ? question.title : '',
                  rules: [{ required: true, message: '请输入标题' }],
                })(<TextArea rows={4} placeholder="请输入标题" />)
              )}
            </Form.Item>
          {/*   <Form.Item {...formItemLayout} label="分数">
              {getFieldDecorator('score', {
                initialValue: question ? question.score : 1,
                rules: [
                  { required: true, message: '请输入分数' },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输入合法数字',
                  },
                ],
              })(<Input placeholder="请输入分数" />)}
            </Form.Item> */}
            <Form.Item {...formItemLayout} label="难度">
              {getFieldDecorator('difficulty', {
                initialValue: question ? question.difficulty : 0,
                rules: [{ required: true, message: '难度' }],
              })(<Slider marks={marks} step={null} />)}
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

export default connect(({ form, fyQuestion }) => ({
  data: form.step,
  fyQuestion,
}))(QuestionStep1);
