import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux, Link } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

import TestView from '../../../components/TestView/TestView';
class TestStep3 extends React.PureComponent {
  render() {
    const { dispatch, data, fyTest } = this.props;
    const test = fyTest.test;
    const questions = test.questions;

    const onFinish = () => {
      dispatch(routerRedux.push('/question-manage/test-add/info/0'));
    };
    const onViewList = () => {
      dispatch(routerRedux.push('/question-manage/test-list'));
    };
    const information = (
      <div className={styles.information}>
       <TestView test={test}/>
      </div>
    );
    const actions = (
      <Fragment>
        {/*  <Button type="primary" onClick={onFinish}>
          再建一题
        </Button> */}
        <Button onClick={onViewList}>查看试卷库</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description={'预计两小时通过审核'}
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form, fyTest }) => ({
  data: form.step,
  fyTest,
}))(TestStep3);
