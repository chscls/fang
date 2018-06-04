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
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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
  loading: loading.models.rule,
}))
@Form.create()
export default class TestList extends PureComponent {
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

      this.getPage();
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
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
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
      type: 'fyTest/remove',
      payload: {
        ids: [id],
      },
      callback: () => {
        this.getPage();
      },
    });
  };
  batchDelete = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'fyTest/remove',
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
  render() {
    const { fyTest: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '唯一码',
        dataIndex: 'code',
      },
      {
        title: '标题',
        dataIndex: 'title',
      },
      ,
      {
        title: '是否问卷',
        render: record => (record.isQuestionnaire ? '是' : '否'),
      },
      ,
      {
        title: '答题模式',
        render: record =>
          record.mode == 'free'
            ? '自由'
            : record.mode == 'singleLimit'
              ? '单题限时'
              : record.mode == 'totalLimit' ? '总限时' : '竞赛',
      },
      {
        title: '试卷状态',
        render: record =>
          record.status == 'create' ? '创建中' : record.status == 'process' ? '进行中' : '已结束',
      },
      {
        title: '创建时间',
        render: record => new Date(record.createTime).toLocaleDateString(),
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <Link to={`/question-manage/test-add/info/${record.id}`}>修改</Link>
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

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const CreateForm = Form.create()(props => {
      const { modalVisible, form, handleAdd, handleModalVisible } = props;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          handleAdd(fieldsValue);
        });
      };
      return (
        <Modal
          title="新建"
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
            {form.getFieldDecorator('title', {
              initialValue: this.state.currentObj.title,
              rules: [{ required: true, message: '请输入标题...' }],
            })(<Input placeholder="请输入标题" />)}
          </FormItem>
        </Modal>
      );
    });
    return (
      <PageHeaderLayout title="试卷管理">
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
                  <Button onClick={this.batchDelete.bind(this)}>批量刪除</Button>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
