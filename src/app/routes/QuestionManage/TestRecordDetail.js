import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Alert
} from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import QRCode from 'qrcode.react';
import styles from './TestRecordDetail.less';
import TestRecordList from './TestRecordList';
import defaultImg from '../../../assets/default.png';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ list, loading, fyTestRecord }) => ({
  list,
  loading: loading.models.fyTestRecord,
  fyTestRecord,
}))
export default class TestRecordDetail extends PureComponent {
  state = {
    search:null,
    state:'all',
    showList:false,
    code:this.props.match.params.code,
    visible: true,
  };
  componentDidMount() {
    this.getPage(1);
    this.getTotal()
  }
  getTotal=(code)=>{
    this.props.dispatch({
      type: 'fyTestRecord/queryTestRecordStatistics',
      payload: {
        code:code?code:this.state.code ,
      }
    })
  }
  getPage = (page, pageSize,search,status,code) => {
    const detailData = this.props.fyTestRecord.detailData;
    var params = {
      code: code?code:this.state.code,
      pageSize: pageSize
        ? pageSize
        : detailData.pagination.pageSizepageSize ? detailData.pagination.pageSize : 10,
      pageNo: page ? page : detailData.pagination.current,
    }
    if(search==null){
      search=this.state.search
    }
    if(search&&search!=''){
      params={
        userkey:search,
        ...params
      }
    }
    if(!status){
      status=this.state.status
    }
    
    if(status&&status!='all'){
      params={
        status:status,
        ...params
      }
    }


    this.props.dispatch({
      type: 'fyTestRecord/detail',
      payload: params,
    });
  };
  onChange=(e)=>{
    this.getPage(null,null,null,e.target.value)
    this.setState({status:e.target.value})
  }
  open=()=>{
    this.setState({showList:true})
  }
  cancelScreen=()=>{
    this.setState({showList:false})
  }
  selectOne=(code)=>{
    this.getPage(1,null,null,null,code)
    this.getTotal(code)
    this.setState({showList:false,code:code})
  }
  back=()=>{
    this.props.dispatch(routerRedux.push(`/question-manage/test-list`));
  }
  handleClose=()=>{
    this.setState({ visible: false });
  }
  render() {
    const { fyTestRecord: { detailData ,testRecordStatistics}, loading } = this.props;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup onChange={this.onChange} defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="check">等待批阅</RadioButton>
          <RadioButton value="create">待提交</RadioButton>
          <RadioButton value="complete">已完成</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={(value) => {
            this.getPage(null,null,value)
            this.setState({search:value})
        }} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: detailData.pagination.pageSize,
      total: detailData.pagination.total,
      current: detailData.pagination.current,
      onChange: (page, pageSize) => {
        this.getPage(page, pageSize,null);
      },
      onShowSizeChange: (current, size) => {
        this.getPage(current, size,null);
      },
    };

    const ListContent = ({ data: { score,goal, createTime,endTime, percent, status } }) => (
      <div className={styles.listContent}>
        
        <div className={styles.listContentItem}>
          <span>分数</span>
          <p> 得分:{goal} 总分:{score}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>状态</span>
          <p>{status=='create'?'待提交':status=='check'?'待批阅':'已完成'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(createTime).format('YYYY/MM/DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>结束时间</span>
          <p>{moment(endTime).format('YYYY/MM/DD HH:mm')}</p>
        </div>
       
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
    
        <div className={styles.standardList}>
        
        <Alert showIcon
              message="每次对试卷基本信息或者其包含的题目进行调整都会自动生成该试卷的一个新版本"
              type="info"
              closable
              afterClose={this.handleClose}
              style={{marginBottom:10}}
            />
           
       
        
          <Card bordered={false}>
            <Row>
            <Col sm={2} xs={24}>
            <div className={styles.headerInfo}>
       
        <p>{testRecordStatistics.code?<QRCode value={testRecordStatistics.code} size={60} />:""}</p>
   
       <em />
      </div>
            
              </Col>
              <Col sm={6} xs={24}>
                <Info title={`当前版本号:${testRecordStatistics.code}`} value={<div><Button type="primary" onClick={this.open}>切换历史版本</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={this.open}>导出成绩</Button>&nbsp;&nbsp;
       <Button type="primary" onClick={this.back}>返回</Button></div>} bordered />
              </Col>
              <Col sm={3} xs={24}>
                <Info title="参与人数" value={testRecordStatistics.count} bordered />
              </Col>
              <Col sm={3} xs={24}>
                <Info title="最低分" value={testRecordStatistics.minScore} bordered />
              </Col>
              <Col sm={3} xs={24}>
                <Info title="平均分" value={testRecordStatistics.avgScore} bordered />
              </Col>
              <Col sm={3} xs={24}>
                <Info title="最高分" value={testRecordStatistics.maxScore} bordered />
              </Col>
              <Col sm={3} xs={24}>
                <Info title="满分" value={testRecordStatistics.score} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title={testRecordStatistics.title+'('+(testRecordStatistics.mode == 'free'? '自由模式': testRecordStatistics.mode == 'singleLimit'? '单题限时': testRecordStatistics.mode == 'totalLimit' ? '总限时' : '竞赛') +')-做题记录'}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={detailData.list}
              renderItem={item => (
                <List.Item key={item.id} actions={[<a>主观题打分</a>]}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.user.avatarUrl?item.user.avatarUrl:defaultImg} shape="square" size="large" />}
                    title={item.user.realname}
                    description={  <Progress  format={(percent)=>{
                      return (item.score==0?100:item.goal/item.score*100).toFixed(2)+'%'
                      }} percent={100}  successPercent={item.score==0?100:item.goal/item.score*100} width={50} status="exception"  strokeWidth={6}  />}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
          
         <Modal
          title={"历史版本列表"}
          visible={this.state.showList}
          footer={null}
          width={1024}
          onCancel={this.cancelScreen}
          maskClosable={false}
          okText="关闭"
        >
          <TestRecordList orgId={testRecordStatistics.orgId} code={testRecordStatistics.code} selectOne={this.selectOne}/>
        </Modal>
        </div>


    );
  }
}
