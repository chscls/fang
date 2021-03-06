import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './AdSpaceList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, currentObj } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue,()=>{
        form.resetFields();
      })
    });
  };
  return (
    <Modal
      title="新建"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: currentObj.name,
          rules: [{ required: true, message: '请输入名称...' }],
        })(<Input placeholder="请输入名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="关键字">
        {form.getFieldDecorator('keyword', {
          initialValue: currentObj.name,
          rules: [{ required: true, message: '请输入关键字...' }],
        })(<Input placeholder="请输入关键字" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="宽度">
        {form.getFieldDecorator('width', {
          initialValue: currentObj.height||1,
          
        })(<InputNumber  min={1} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="高度">
        {form.getFieldDecorator('height', {
          initialValue: currentObj.height||1,
         
        })(<InputNumber  min={1} />)}
      </FormItem>
    </Modal>
  );
});
@connect(({ rule, loading, fyAdSpace }) => ({
  fyAdSpace,
  rule,
  loading: loading.models.fyAdSpace,
}))
@Form.create()
export default class AdSpaceList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    currentObj: {},
    adSpace:{}
  };

  componentDidMount() {
    this.getPage();
  }

  getPage = params => {
    const pagination = this.props.fyAdSpace.data.pagination;

    if (params == null) {
      params = {
        pageNo: pagination.current ? pagination.current : 1,
        pageSize: pagination.pageSize ? pagination.pageSize : 10,
        ...this.state.formValues,
      };
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'fyAdSpace/fetch',
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
    if(this.props.handleSelect){
      this.props.handleSelect(rows)
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

      const pagination=this.props.fyAdSpace.data.pagination
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

  handleAdd = (fields,back) => {
    var params = {
      ...fields
    };
    if (this.state.currentObj.id) {
      params.id = this.state.currentObj.id;
    }
    this.props.dispatch({
      type: 'fyAdSpace/add',
      payload: params,
      callback: res => {
       
          message.success(this.state.currentObj.id ? '修改成功' : '添加成功');
          this.setState({
            modalVisible: false,
            currentObj:{}
          });
          this.getPage();
          if(back) back()
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入" />)}
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
             {/*  <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
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
            <FormItem label="单词">
              {getFieldDecorator('word')(<Input placeholder="请输入" />)}
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
      type: 'fyAdSpace/remove',
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
      type: 'fyAdSpace/remove',
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
    const { fyAdSpace: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns =[ 
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },{
        title: '关键字',
        dataIndex: 'keyword',
      },{
        title: '宽度',
        dataIndex: 'width',
      },{
        title: '高度',
        dataIndex: 'height',
      },{
        title: '创建时间',
        dataIndex: 'createTime',
        render: val =>    moment(val).format('YYYY-MM-DD HH:mm')
      },this.props.isSelect?{}:
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={this.modify.bind(this, record)}>修改</a>
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
      currentObj: this.state.currentObj,
    };

    return (this.props.isSelect?<Card bordered={false}>
      <div className={styles.tableList}>
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
    </Card>:
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.batchDelete.bind(this)}>批量刪除</Button>
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
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
