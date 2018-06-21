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
  Alert,
  Tag
} from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import QRCode from 'qrcode.react';
import styles from './TestRecordDetail.less';
import TestRecordList from './TestRecordList';
import defaultImg from '../../../assets/default.png';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
class RealName extends PureComponent {
  state = {
    isEdit:false,
    name:''
  }
  confirm=(value)=>{
    this.props.confirm(this.props.index,this.props.item.userId,value,()=>{
      
      this.setState({isEdit:false})
    })
  }
  valid=()=>{
    this.setState({isEdit:true})
  }
  cancel=()=>{
    this.setState({isEdit:false})
  }
  render() {
    const item = this.props.item
    const sign = item.sign
    const user = item.user
    const score= item.version.score
    const goal = item.goal
    return( this.state.isEdit?<div>正确率:<Progress format={(percent)=>{return (score==0?100:goal/score*100).toFixed(2)+"%"}} percent={100}  style={{width:180}} successPercent={score==0?100:goal/score*100} width={50} status="exception"  strokeWidth={6}  />
    &nbsp;&nbsp;<Search defaultValue={this.props.value} style={{width:200}} placeholder="请输入真实姓名" onSearch={this.confirm} enterButton="确定" /><Button onClick={this.cancel}>取消</Button>          
    </div>:
<div>正确率:<Progress  format={(percent)=>{return (score==0?100:goal/score*100).toFixed(2)+"%"}} percent={100}  style={{width:180}} successPercent={score==0?100:goal/score*100} width={50} status="exception"  strokeWidth={6}  /> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;{item.isAuth?<Button onClick={this.confirm.bind(sign)}>确定</Button>:''}
<Button onClick={this.valid.bind(user.id,sign)}>{item.realname?'重新认证':'去认证'}</Button>

       
     
               

</div>
 )
  }

}
@connect(({ list, loading, fyTestRecord}) => ({
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
    sort:'desc',
    visible: true,
    loadingMore: false,
    showLoadingMore: true,
  };
  confirm=(index,userId,realname,back)=>{
   
    this.props.dispatch({
      type: 'fyTestRecord/confirmSign',
      payload: {
        index:index,
        userId:userId,
        realname:realname
      },
      callback:back
    })
  }
  componentDidMount() {
    this.getPage(null,20);
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
  getPage = (page, pageSize,search,status,code,callback,sort) => {
    
    const detailData = this.props.fyTestRecord.detailData;
    var params = {
      code: code?code:this.state.code,
      sort:sort?sort:this.state.sort,
      pageSize: pageSize
        ? pageSize
        : detailData.pagination.pageSizepageSize ? detailData.pagination.pageSize : 10,
      pageNo: page!=null ? page :1,
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
      callback:callback?callback:(total)=>{
        this.setState({showLoadingMore:total>20})
  
      }
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
    this.getPage(null,null,null,null,code)
    this.getTotal(code)
    this.setState({showList:false,code:code})
  }
  back=()=>{
    this.props.dispatch(routerRedux.push(`/question-manage/test-list`));
  }
  handleClose=()=>{
    this.setState({ visible: false });
  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    const length = this.props.fyTestRecord.detailData.pagination.current+1
    const pageSize= this.props.fyTestRecord.detailData.pagination.pageSize
    
    this.getPage(length,pageSize,null,null,null,(total)=>{
     
      const showLoadingMore =length<total 
      
      this.setState({
        loadingMore: false,
        showLoadingMore
      }, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
    })
  
  }
  onChangeScore=(e)=>{
    this.setState({sort:e.target.value})
    this.getPage(null,null,null,null,null,null,e.target.value)
  }
  render() {
    const { fyTestRecord: { detailData ,testRecordStatistics}, loading} = this.props;


    const { loadingMore, showLoadingMore}=this.state
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
        &nbsp; &nbsp;
        <RadioGroup onChange={this.onChangeScore} defaultValue="desc">
          <RadioButton value="desc">分数降序</RadioButton>
          <RadioButton value="asc">分数升序</RadioButton>
          
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={(value) => {
            this.getPage(null,null,value)
            this.setState({search:value})
        }} />
      </div>
    );

   /*  const paginationProps = {
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
    }; */
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
      
        {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
      </div>
    ) : null;
    const ListContent = ({ data: { version:{ score},goal, createTime,endTime, percent, status } }) => (
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
       
           
       
        
          <Card bordered={false}>
            <Row>
            <Col sm={1} xs={24}>
            <div className={styles.headerInfo}>
       
        <p>{testRecordStatistics.code?<QRCode value={testRecordStatistics.code} size={60} />:""}</p>
   
      </div>
            
              </Col>
              <Col sm={7} xs={24}>
                <Info title={`当前版本:${testRecordStatistics.code} 更新时间:${moment(testRecordStatistics.updateTime).format('YYYY/MM/DD HH:mm')}`} value={<div><Button type="primary" onClick={this.open}>切换历史版本</Button>&nbsp;&nbsp;
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
 
          <Alert showIcon
              message="每次对试卷基本信息或者其包含的题目进行调整都会自动生成该试卷的一个新版本;真实姓名绑定一次后可在熟人管理里进行修改"
              type="info"
              closable
              afterClose={this.handleClose}
              style={{marginTop:5}}
            />
          <Card
            className={styles.listCard}
            bordered={false}
            title={testRecordStatistics.title+'('+(testRecordStatistics.mode == 'free'? '自由模式': testRecordStatistics.mode == 'singleLimit'? '单题限时': testRecordStatistics.mode == 'totalLimit' ? '总限时' : '竞赛') +')-做题记录'}
            style={{ marginTop: 5 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              loadMore={loadMore}
              
              dataSource={detailData.list}
              renderItem={(item,index)=> (
                <List.Item key={item.id} actions={[<a>主观题打分</a>]}>
                  <List.Item.Meta 
                    avatar={<Avatar src={item.user.avatarUrl?item.user.avatarUrl:defaultImg} shape="square" size="large" />}
              title={<span> 昵称:{item.user.nickName}&nbsp;&nbsp;&nbsp;&nbsp;  署名:{item.friend?item.friend.realname:(item.sign?item.sign:'匿名')} &nbsp;&nbsp;&nbsp;&nbsp; {item.friend?<Tag color="green">已实名认证</Tag>:""}{item.friend&&item.friend.group?"分组"+item.friend.group.name:""}</span>}
                    description={<RealName value={item.realname?item.realname:(item.sign?item.sign:'')} index={index} item={item} confirm={this.confirm}/> }
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
