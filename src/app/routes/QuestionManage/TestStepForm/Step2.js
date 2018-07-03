import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Popconfirm, Divider, List, Avatar, Checkbox, Modal } from 'antd';
import { routerRedux } from 'dva/router';

import styles from './style.less';

import QuestionList from '../QuestionList';

import QuestionSort from '../../../components/QuestionSort/QuestionSort';
const formItemLayout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 23,
  },
};

var key = 1;


@Form.create()
class TestStep2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      isRich: false,
      isQuestionnaire: false,
      title: '',
      isReady: false,
      items: [],
      type: 'single',
      indeterminate: true,
      checkAll: false,
      flag: false,
      selectQuestionIds: [],
      questionModal: false,
      defaultScore: 1
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
          const items = [];

          for (var i = 0; i < test.questions.length; i++) {
            items[i] = { index: i, q: test.questions[i], checked: false };
          }

          this.setState({
            isReady: true,
            id: test.id,
            isQuestionnaire: test.isQuestionnaire,
            items,
          });
        },
      });
    }
  }


  changeScore = (ids, score, back) => {

    this.props.dispatch({
      type: 'fyTest/updateTestQuestions',
      payload: {
        id: this.state.id,
        qids: ids,
        score: score
      },
      callback: test => {
        back(test)
      }
    });

  };
  delete = (ids, back) => {

    this.props.dispatch({
      type: 'fyTest/updateTestQuestions',
      payload: {
        id: this.state.id,
        qids: ids
      },
      callback: test => {
        back(test)
      },
    });
  }


  okHandle = (selectIds, back) => {
    var test = this.props.fyTest.test;
    var alreadyQids = test.questionConfigs.map(cfg => cfg.id).join(',')
    alreadyQids = selectIds + "," + alreadyQids;

    this.props.dispatch({
      type: 'fyTest/updateTestQuestions',
      payload: {
        id: this.state.id,
        qids: alreadyQids
      },
      callback: test => {
        back(test)
      },
    });
  };

  moveCard = (dragIndex, hoverIndex, back) => {
    // console.log(dragIndex,hoverIndex)
    var test = this.props.fyTest.test;
    var alreadyQids = test.questionConfigs;

    [alreadyQids[dragIndex], alreadyQids[hoverIndex]] = [alreadyQids[hoverIndex], alreadyQids[dragIndex]];
    alreadyQids = alreadyQids.map(cfg => cfg.id).join(',')
    this.props.dispatch({
      type: 'fyTest/updateTestQuestions',
      payload: {
        id: this.state.id,
        qids: alreadyQids
      },
      callback: test => {
        back(test)
      },
    });
  }

  render() {
    const { form, data, dispatch, submitting, confirmLoading, initLoading, fyTest: { test } } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const data2 = this.state.items;
    const alreadyIds = data2.map(row => row.q.id).join(',');

    const onPrev = () => {
      dispatch(routerRedux.push(`/question-manage/test-add/info/${this.state.id}`));
    };
    const onPreview = () => {
      dispatch(routerRedux.push(`/question-manage/test-add/result/${this.state.id}`));
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'fyTest/updateQuestions',
            payload: {
              id: this.state.id,
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
        {this.state.isReady ? (
          <Form layout="horizontal" className={styles.stepForm} style={{ maxWidth: 1000 }}>
            <Form.Item {...formItemLayout} label="标题" style={{ wordBreak: 'break-all' }}>
              {test.title}
            </Form.Item>
            <Form.Item {...formItemLayout} label="题目">


              <QuestionSort items={this.state.items}
                initLoading={initLoading}
                confirmLoading={confirmLoading}
                okHandle={this.okHandle}
                moveCard={this.moveCard}
                defaultScore={this.state.defaultScore}
              />

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
              <div style={{ margin: 'auto', width: 200 }}>
                <Button type="primary" onClick={onPreview} loading={confirmLoading}>
                  预览
                </Button>
                <Button onClick={onPrev} style={{ marginLeft: 8 }} loading={confirmLoading}>
                  上一步
                </Button>
              </div>
            </Form.Item>
          </Form>
        ) : (
            ''
          )}
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>问卷模式</h4>
          <p>问卷模式无需选择或填写正确答案</p>
        </div>

        <Modal
          title="插入题目"
          visible={this.state.questionModal}
          onOk={this.okHandle}
          width={1800}
          onCancel={() => this.handleModalVisible()}
          confirmLoading={confirmLoading}
        >
          <QuestionList
            key={key}
            alreadyIds={alreadyIds}
            isSelect={true}
            handleSelect={this.handleSelect}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default connect(({ form, loading, fyTest }) => ({
  initLoading: loading.effects['fyTest/find'],
  confirmLoading: loading.effects['fyTest/updateTestQuestions'],
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
  fyTest,
}))(TestStep2);
