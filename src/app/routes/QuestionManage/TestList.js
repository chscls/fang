import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Tooltip,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import QRCode from 'qrcode.react';
import styles from './TestList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({ rule, loading, fyTest }) => ({
  fyTest,
  rule,
  loading: loading.models.fyTest,
}))
@Form.create()
export default class TestList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    currentObj: {},
    code: '',
    screenTitle: '',
    screenVisible: false,
  };

  componentDidMount() {
    this.getPage();
  }
  getPage = params => {
    const pagination = this.props.fyTest.data.pagination;
    if (params == null) {
      params = {
        pageNo: pagination.current ? pagination.current : 1,
        pageSize: pagination.pageSize ? pagination.pageSize : 10,
        ...this.state.formValues,
      };
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'fyTest/fetch',
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
      const pagination=this.props.fyTest.data.pagination
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
      type: 'fyTest/add',
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
                initialValue:'',
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="唯一码">
              {getFieldDecorator('code',{
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
    dispatch({
      type: 'fyTest/recycle',
      payload: {
        ids: [id],
      },
      callback: () => {
        this.getPage();
      },
    });
  };
  screen = (code, title) => {
    this.setState({ code, screenVisible: true, screenTitle: title });
  };
  batchDelete = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'fyTest/recycle',
      payload: {
        ids: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.getPage();
      },
    });
  };
  upShop = id => {
    const { dispatch } = this.props;
  
    dispatch({
      type: 'fyTest/upShop',
      payload: {
        ids: [id],
      },
      callback: () => {
        this.getPage();
      },
    });
  };
  downShop = id => {
    const { dispatch } = this.props;
  
    dispatch({
      type: 'fyTest/downShop',
      payload: {
        ids: [id],
      },
      callback: () => {
        this.getPage();
      },
    });
  };
  batchUpShop= e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'fyTest/upShop',
      payload: {
        ids: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.getPage();
      },
    });
  };
  batchDownShop= e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'fyTest/downShop',
      payload: {
        ids: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.getPage();
      },
    });
  };
  
  cancelScreen = e => {
    this.setState({ screenVisible: false });
  };
  render() {
    const { fyTest: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      
      {
        title: '唯一码(点击可投屏)',
        render: record => (
          <a onClick={this.screen.bind(this, record.id+"", record.title)}>{record.code}</a>
        ),
      },
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '题量',
        dataIndex: 'count',
      },{
        title: '总分',
        dataIndex: 'score',
      },
      {
        title: '重做次数',
        dataIndex: 'allowTime'
      },
      {
        title: '问卷',
        dataIndex: 'isQuestionnaire',
        filters: [
          {
            text: '试题',
            value: false,
          },
          {
            text: '问卷',
            value: true,
          }],
       
        render: val => val? '是' : '否',
      },
      {
        title: '乱序',
        dataIndex: 'isNoOrder',
        filters: [
          {
            text: '否',
            value: false,
          },
          {
            text: '是',
            value: true,
          }],
       
        render: val => val? '是' : '否',
      },
      {
        title: '答题模式',
        dataIndex: 'mode',
        filters: [
          {
            text: '自由',
            value: 'free',
          },
          {
            text: '单题限时',
            value: 'singleLimit',
          },
          {
            text: '总限时',
            value: 'totalLimit',
          },
          {
            text: '竞赛',
            value: 'race',
          },
        ],
       
        render: val =>
        val== 'free'
            ? '自由'
            : val == 'singleLimit'
              ? '单题限时'
              : val == 'totalLimit' ? '总限时' : '竞赛',
      },
      {
        title: '试卷状态',
        dataIndex: 'status',
        filters: [
          {
            text: '创建中',
            value: 'create',
          },
          {
            text: '进行中',
            value: 'process',
          },
          {
            text: '已结束',
            value: 'complete',
          }
        ],
        render:val =>
        val == 'create' ? '创建中' : val == 'process' ? '进行中' : '已结束',
      },
      {
        title: '上架状态',
        dataIndex: 'saleStatus',
        render:val =>
        val == 'create' ? '待上架' : val == 'apply' ? '审核中' : val == 'refuse' ? '不通过':'已上架'
      },
      {
        title: '创建时间',
        sorter: true,
        dataIndex: 'createTime',
        render: val =>    moment(val).format('YYYY-MM-DD HH:mm')
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
               <Link to={`/question-manage/test-add/info/${record.id}`}>修改</Link>
               <Divider type="vertical" />
            {record.saleStatus=='sale'?<a onClick={this.downShop.bind(this, record.id)}>下架</a>:""}
            
            {record.saleStatus=='create'||record.saleStatus=='refuse'?<a onClick={this.upShop.bind(this, record.id)}>上架</a>:""}
            {record.saleStatus=='apply'?"":<Divider type="vertical" />}
            
            <Link to={`/question-manage/testRecord-detail/${record.code}`}>统计与批阅</Link>
           
            <Divider type="vertical" />
            <a onClick={this.delete.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Link to="/question-manage/test-add/info/0">
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </Link>
              {selectedRows.length > 0 && (
                <span>
                   <Button type="primary"  onClick={this.batchUpShop.bind(this)}>批量上架</Button>
                   <Button type="primary"  onClick={this.batchDownShop.bind(this)}>批量下架</Button>
                  <Button type="danger"  onClick={this.batchDelete.bind(this)}>批量刪除</Button>
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
              data={data}
              columns={columns}
              rowKey="id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title={this.state.screenTitle}
          visible={this.state.screenVisible}
          footer={null}
          width={640}
          onCancel={this.cancelScreen}
          maskClosable={false}
          okText="关闭"
        >
          <QRCode value={this.state.code} size={600} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
