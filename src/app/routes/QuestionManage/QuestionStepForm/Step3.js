import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux, Link } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';
import { single } from 'rxjs/operators';
import SingleView from '../../../components/mycom/QuestionItem/SingleView';
import JudgeView from '../../../components/mycom/QuestionItem/JudgeView';
import MutiplyView from '../../../components/mycom/QuestionItem/MutiplyView';
import FillView from '../../../components/mycom/QuestionItem/FillView';
import AskView from '../../../components/mycom/QuestionItem/AskView';
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
        {question.type == 'single' ? (
          <SingleView question={question} />
        ) : question.type == 'mutiply' ? (
          <MutiplyView question={question} />
        ) : question.type == 'judge' ? (
          <JudgeView question={question} />
        ) : question.type == 'fill' ? (
          <FillView question={question} />
        ) : question.type == 'ask' ? (
          <AskView question={question} />
        ) : (
          <SingleView question={question} />
        )}
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
