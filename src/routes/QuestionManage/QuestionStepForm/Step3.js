import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux,Link } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  render() {
    const { dispatch, data } = this.props;
    const onFinish = () => {
      dispatch(routerRedux.push('/question-manage/question-add/info/0'));
    };
    const onViewList = () => {
      dispatch(routerRedux.push('/question-manage/question-list'));
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col span={8} className={styles.label}>
            付款账户：
          </Col>
          <Col span={16}>{data.payAccount}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>
            收款账户：
          </Col>
          <Col span={16}>{data.receiverAccount}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>
            收款人姓名：
          </Col>
          <Col span={16}>{data.receiverName}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>
            转账金额：
          </Col>
          <Col span={16}>
            <span className={styles.money}>{data.amount}</span> 元
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
      <Button type="primary" onClick={onFinish}>
          再建一题
        </Button>
        <Button onClick={onViewList}>查看题库</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="预计两小时通过审核"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step3);
