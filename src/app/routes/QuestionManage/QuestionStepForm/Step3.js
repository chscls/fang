import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux, Link } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';
import { single } from 'rxjs/operators';


import TestView from '../../../components/TestView/TestView';
class QuestionStep3 extends React.PureComponent {
  render() {
    const { dispatch, data, fyQuestion } = this.props;
    const question = fyQuestion.question;
    const onFinish = () => {
      dispatch(routerRedux.push('/question-manage/question-add/info/0'));
    };
    const onViewList = () => {
      dispatch(routerRedux.push('/question-manage/question-list'));
    };
    const information = (
      <div className={styles.information}>
      <TestView question={question}/>
      </div>
    );
    const actions = (
      <Fragment>
        {/*  <Button type="primary" onClick={onFinish}>
          再建一题
        </Button> */}
        <Button onClick={onViewList}>查看题库</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description={question.status == 'check' ? '预计两小时通过审核' : ''}
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form, fyQuestion }) => ({
  data: form.step,
  fyQuestion,
}))(QuestionStep3);
