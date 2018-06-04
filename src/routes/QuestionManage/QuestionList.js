import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {
  Tooltip,
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
  Rate,
} from 'antd';
import Ellipsis from 'components/Ellipsis';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SingleView from '../../components/mycom/QuestionItem/SingleView';
import JudgeView from '../../components/mycom/QuestionItem/JudgeView';
import MutiplyView from '../../components/mycom/QuestionItem/MutiplyView';
import FillView from '../../components/mycom/QuestionItem/FillView';
import AskView from '../../components/mycom/QuestionItem/AskView';
import styles from './QuestionList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['create', 'check', 'complete'];
const status = ['创建中', '审核中', '已上线'];

@connect(({ rule, loading, fyQuestion }) => ({
  fyQuestion,
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class QuestionList extends PureComponent {
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
      type: 'fyQuestion/fetch',
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
      type: 'fyQuestion/remove',
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
        this.getPage();
      },
    });
  };

  render() {
    const { fyQuestion: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '标题',
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
            {record.isRich ? (
              <div dangerouslySetInnerHTML={{ __html: record.title }} />
            ) : (
              <Ellipsis lines={3}>{record.title}</Ellipsis>
            )}
          </Tooltip>
        ),
      },
      {
        title: '题型',
        dataIndex: 'type',
        filters: [
          {
            text: '单选',
            value: 'single',
          },
          {
            text: '多选',
            value: 'mutiply',
          },
          {
            text: '判断',
            value: 'judge',
          },
          {
            text: '填空',
            value: 'fill',
          },
          {
            text: '问答',
            value: 'ask',
          },
        ],
        onFilter: (value, record) => record.type == value,
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
        filters: [
          {
            text: '易',
            value: 0,
          },
          {
            text: '偏易',
            value: 25,
          },
          {
            text: '中等',
            value: 50,
          },
          {
            text: '偏难',
            value: 75,
          },
          {
            text: '难',
            value: 100,
          },
        ],
        onFilter: (value, record) => record.difficulty == value,
        render(val) {
          return <Rate disabled={true} value={val / 25 + 1} />;
        },
      },
      {
        title: '分数',
        dataIndex: 'score',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render(val) {
          return new Date(val).toLocaleDateString();
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 'create',
          },
          {
            text: status[1],
            value: 'check',
          },
          {
            text: status[2],
            value: 'complete',
          },
        ],
        onFilter: (value, record) => record.status == value,
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
            <Link to={`/question-manage/question-add/info/${record.id}`}>修改</Link>
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
    return this.props.isSelect ? (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
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
    ) : (
      <PageHeaderLayout title="题目管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Link to="/question-manage/question-add/info/0">
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
