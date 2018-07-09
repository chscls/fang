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
  Upload,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import config from '../../config';
import styles from './CatalogList.less';
import { beforeUpload } from '../../../utils/utils';
const uploadUrl = config.httpServer;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, currentObj,parent } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      var x = fieldsValue.img;
      if (x == null || x.length == 0) {
        return
      }

      var y = x[x.length - 1].response
      handleAdd(
        {...fieldsValue,
        img: y}
        , () => {
        form.resetFields();
      })
    });
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  return (
    <Modal
      title="新建"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
     {parent.id?<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父目录">
       {parent.name}
      </FormItem>:""}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: currentObj.name,
          rules: [{ required: true, message: '请输入姓名...' }],
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路径">
        {form.getFieldDecorator('path', {
          initialValue: currentObj.path,
          rules: [{ required: false, message: '请输入路径...' }],
        })(<Input placeholder="请输入路径" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模板">
        {form.getFieldDecorator('templete', {
          initialValue: currentObj.templete,
          rules: [{ required: false, message: '请输入模板...' }],
        })(<Input placeholder="请输入模板" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='标题图' >
        <div className="dropbox">
          {form.getFieldDecorator('img', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          })(
            <Upload.Dragger name="file" action={uploadUrl} multiple={false} beforeUpload={beforeUpload.bind(this, 120, 90, (msg) => {
              message.error("请选择" + msg + "宽度的图片")
            })} >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Upload.Dragger>
          )}
        </div>
      </FormItem>
    </Modal>
  );
});
@connect(({ rule, loading, fyCatalog }) => ({
  fyCatalog,
  rule,
  loading: loading.models.fyCatalog,
}))
@Form.create()
export default class CatalogList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    currentObj: {},
    parent:{}
    
  };

  componentDidMount() {
    this.getPage();
  }

  getPage = params => {
    const pagination = this.props.fyCatalog.data.pagination;

    if (params == null) {
      params = {
        pageNo: pagination.current ? pagination.current : 1,
        pageSize: pagination.pageSize ? pagination.pageSize : 10,
        ...this.state.formValues,
      };
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'fyCatalog/fetch',
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

      const pagination = this.props.fyCatalog.data.pagination
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...values,

      };
      this.getPage(params);
    });
  };
  addChild=(parent)=>{
    this.setState({modalVisible:true,parent:parent});
  }
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

  handleAdd = (fields, back) => {
    var params = {
      ...fields
    };
    if (this.state.currentObj.id) {
      params.id = this.state.currentObj.id;
    }
    if(this.state.parent.id){
      params.parentId = this.state.parent.id;
    }
    this.props.dispatch({
      type: 'fyCatalog/add',
      payload: params,
      callback: res => {

        message.success(this.state.currentObj.id ? '修改成功' : '添加成功');
        this.setState({
          modalVisible: false,
          parent:{}
        });
        this.getPage();
        if (back) back()
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="单词">
              {getFieldDecorator('word')(<Input placeholder="请输入" />)}
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
      type: 'fyCatalog/remove',
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
      type: 'fyCatalog/remove',
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
  formatTree = (list) => {
   
    for (var i = 0;  i < list.length;i++) {
    
      if (list[i].children&&list[i].children.length>0) {
        this.formatTree(list[i].children)
       

      }else{
        list[i]={
          ...list[i],
          children:null
        };
      }
    }
  
    return list
  }
  render() {
    const { fyCatalog: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    var list = this.formatTree(data.list)
   
    var datax = {
      ...data,
      list:list
    }
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '路径',
        dataIndex: 'path',
      }, {
        title: '图片',
        dataIndex: 'img',
        render: val => (
          <img src={config.httpServer + val} style={{ width: 48, height: 27 }} />
        )
      },
      {
        title: '模板',
        dataIndex: 'templete',
      },this.props.isSelect?{}:
      {
        title: '操作',
        render: record => (
          <Fragment>
             <a onClick={this.addChild.bind(this, record)}>添加子目录</a>
            <Divider type="vertical" />
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
      parent:this.state.parent
    };

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
         
           {this.props.isSelect?"": <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
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
            </div>}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={datax}
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
