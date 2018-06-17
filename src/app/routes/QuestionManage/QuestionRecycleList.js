import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {
  Tooltip,
  Row,
  Col,
  Tag,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Rate,
} from 'antd';
import Ellipsis from 'components/Ellipsis';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import SingleView from '../../components/QuestionItem/SingleView';
import JudgeView from '../../components/QuestionItem/JudgeView';
import MutiplyView from '../../components/QuestionItem/MutiplyView';
import FillView from '../../components/QuestionItem/FillView';
import AskView from '../../components/QuestionItem/AskView';
import styles from './QuestionRecycleList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['create', 'check', 'complete'];
const status = ['创建中', '审核中', '已上线'];

@connect(({ rule, loading, fyQuestion,user }) => ({
  fyQuestion,
  rule,user,
  loading: loading.models.fyQuestion,
}))
@Form.create()
export default class QuestionRecycleList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    currentObj: {},
  };

  componentDidMount() {
    this.getPage();
  }
  getPage = params => {
    const pagination = this.props.fyQuestion.data.pagination;

    if (params == null) {
      params = {
        pageNo: pagination.current ? pagination.current : 1,
        pageSize: pagination.pageSize ? pagination.pageSize : 10,
        alreadyIds: this.props.alreadyIds ? this.props.alreadyIds : [],
        ...this.state.formValues,
      };
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'fyQuestion/fetchRe',
      payload: params,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      alreadyIds: this.props.alreadyIds ? this.props.alreadyIds : [],
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.getPage(params);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    this.getPage();
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        this.batchDelete(e);
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
    if (this.props.handleSelect) {
      this.props.handleSelect(rows.map(row => row.id).join(','));
    }
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      const pagination=this.props.fyQuestion.data.pagination
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...values,
      
      };
      this.getPage(params);
    });
  };

  handleModalVisible = flag => {
    if (flag) {
      this.setState({
        modalVisible: !!flag,
      });
    } else {
      this.setState({
        modalVisible: !!flag,
        currentObj: {},
      });
    }
  };

  handleAdd = fields => {
    var params = {
      title: fields.title,
    };
    if (this.state.currentObj.id) {
      params.id = this.state.currentObj.id;
    }
    this.props.dispatch({
      type: 'fyQuestion/add',
      payload: params,
      callback: () => {
        message.success(this.state.currentObj.id ? '修改成功' : '添加成功');
        this.setState({
          modalVisible: false,
        });
        this.getPage();
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title',{
                initialValue: '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标签">
              {getFieldDecorator('tag',{
                initialValue:'',
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  modify = record => {
    this.setState({
      currentObj: record,
      modalVisible: true,
    });
  };
  delete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fyQuestion/remove',
      payload: {
        ids: [id],
      },
      callback: () => {
        dispatch({
          type: 'user/fetchCurrent',
        });
        this.getPage();
      },
    });
  }
  recovery = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fyQuestion/recovery',
      payload: {
        ids: [id],
      },
      callback: () => {
        dispatch({
          type: 'user/fetchCurrent',
        });
        this.getPage();
      },
    });
  }
  batchRecovery= e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'fyQuestion/recovery',
      payload: {
        ids: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        if (this.props.handleSelect) {
          this.props.handleSelect([]);
        }
        dispatch({
          type: 'user/fetchCurrent',
        });
        this.getPage();
      },
    });
  }
  batchDelete = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'fyQuestion/remove',
      payload: {
        ids: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        if (this.props.handleSelect) {
          this.props.handleSelect([]);
        }
        dispatch({
          type: 'user/fetchCurrent',
        });
        this.getPage();
      },
    });
  };

  render() {
    const { fyQuestion: { dataRe }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      
      {
        title: '标题(点击可预览)',
        width: 400,
        render: record => (
          <Tooltip
            overlayStyle={{ minWidth: 400 }}
            title={
              record.type == 'single' ? (
                <SingleView
                  style={{ backgroundColor: 'white', color: 'black' }}
                  question={record}
                />
              ) : record.type == 'mutiply' ? (
                <MutiplyView
                  style={{ backgroundColor: 'white', color: 'black' }}
                  question={record}
                />
              ) : record.type == 'judge' ? (
                <JudgeView style={{ backgroundColor: 'white', color: 'black' }} question={record} />
              ) : record.type == 'fill' ? (
                <FillView style={{ backgroundColor: 'white', color: 'black' }} question={record} />
              ) : record.type == 'ask' ? (
                <AskView style={{ backgroundColor: 'white', color: 'black' }} question={record} />
              ) : (
                ''
              )
            }
          >
           <a> {record.isRich ? (
              <div  dangerouslySetInnerHTML={{ __html: record.title }} />
            ) : (
              <Ellipsis lines={3}>{record.title}</Ellipsis>
            )}</a>
          </Tooltip>
        ),
      },
      {
        title: '题型',
        dataIndex: 'type',
       
        render(val) {
          return (
            <span>
              {' '}
              {val == 'single'
                ? '单选'
                : val == 'mutiply'
                  ? '多选'
                  : val == 'judge' ? '判断' : val == 'fill' ? '填空' : '问答'}
            </span>
          );
        },
      },
      {
        title: '难度等级',
        dataIndex: 'difficulty',
       
        render(val) {
          return <Rate disabled={true} value={val / 25 + 1} />;
        },
      },
      {
        title: '标签',
        render(record) {
          return <div>{record.tags.map((tag)=>{
            return  <Tag color="blue">{tag}</Tag>
          })}</div>
        }
      },
      {
        title: '回收时间',
        dataIndex: 'recycleTime',
        sorter: true,
        render(val) {
          return new Date(val).toLocaleString();
        },
      },{
        title: '自动删除时间',
        render(record) {
          var x = new Date(record.recycleTime+1000*60*60*24*15).toLocaleString()
          var now = new Date().getTime();
    
          var color = now-record.recycleTime>1000*60*60*24*14?"red":now-record.recycleTime>1000*60*60*24*7?"orange":"black"
          return <span style={{color:`${color}`}}>{x}</span>
          
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
       
      
        render(val) {
          var x = 0;
          if (val == 'check') x = 1;
          if (val == 'complete') x = 2;

          return <Badge status={statusMap[x]} text={status[x]} />;
        },
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
              <a onClick={this.recovery.bind(this, record.id)}>恢复</a>
            <Divider type="vertical" />
            <a onClick={this.delete.bind(this, record.id)}>彻底清除</a>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (<PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
             
              {selectedRows.length > 0 && (
                <span>
                   <Button type="primary" onClick={this.batchRecovery.bind(this)}>批量恢复</Button>
                  <Button type="danger" onClick={this.batchDelete.bind(this)}>批量彻底清除</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={dataRe}
              columns={columns}
              rowKey="id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>)
  
  }
}
