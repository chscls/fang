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
import styles from './AdList.less';
import AdSpaceList from './AdSpaceList';
import { beforeUpload } from '../../../utils/utils';
import { allSettled } from 'rsvp';

const uploadUrl = config.httpServer + '/services/PublicSvc/upload';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, currentObj, openAdSpace, space } = props;
  var url;


 
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      var x = fieldsValue.img;
      if (x == null || x.length == 0) {
        return
      }

      var y = x[x.length - 1].response
    
      handleAdd({
        ...fieldsValue,
        img: y
      },()=>{
        form.resetFields();
      });
    });
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  const sp = currentObj.id ? currentObj.adSpace : space
  return (
    <Modal
      title="新建"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="单词">
        {form.getFieldDecorator('name', {
          initialValue: currentObj.name,
          rules: [{ required: true, message: '请输入姓名...' }],
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="跳转路径">
        {form.getFieldDecorator('url', {
          initialValue: currentObj.url,
          rules: [{ required: true, message: '请输入url...' }],
        })(<Input placeholder="请输入url" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属版位">
        {sp.name} <Button onClick={openAdSpace} >选择版位</Button>
      </FormItem>
      {sp.id ? <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={`图片${sp.width}*${sp.height}`} >
        <div className="dropbox">
          {form.getFieldDecorator('img', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          })(
            <Upload.Dragger name="file" action={uploadUrl} multiple={false} beforeUpload={beforeUpload.bind(this, sp.width, sp.height, (msg) => {
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
      </FormItem> : ""}
    </Modal>
  );
});
@connect(({ rule, loading, fyAd }) => ({
  fyAd,
  rule,
  loading: loading.models.fyAd,
}))
@Form.create()
export default class AdList extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      modalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      currentObj: {},
      spaceVisible: false,
      selectQuestionIds: [],
      space: {}
    };
    window.say=()=>{
      alert("xxxxxxxxxx")
    }
  }
  
  
  componentDidMount() {
    this.getPage();
   
    
  }
  spaceCancel = () => {
    this.setState({ spaceVisible: false })
  }
  spaceOk = () => {
    if (this.state.selectQuestionIds.length == 0) {
      message.error("请选择一个版位")
      return
    }
    if (this.state.selectQuestionIds.length > 1) {
      message.error("请只选择一个版位")
      return
    }
    this.setState({ spaceVisible: false, space: this.state.selectQuestionIds[0] })
  }
  getPage = params => {
    const pagination = this.props.fyAd.data.pagination;

    if (params == null) {
      params = {
        pageNo: pagination.current ? pagination.current : 1,
        pageSize: pagination.pageSize ? pagination.pageSize : 10,
        ...this.state.formValues,
      };
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'fyAd/fetch',
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

      const pagination = this.props.fyAd.data.pagination
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
    if (this.state.space.id) {
      params.sid = this.state.space.id;
    }
    if (this.state.currentObj.id) {
      params.id = this.state.currentObj.id;
    }
    this.props.dispatch({
      type: 'fyAd/add',
      payload: params,
      callback: res => {
        
          message.success(this.state.currentObj.id ? '修改成功' : '添加成功');
          this.setState({
            modalVisible: false,
            currentObj: {}
          });
          this.getPage();
          if(back) back();
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
      type: 'fyAd/remove',
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
      type: 'fyAd/remove',
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
  openAdSpace = () => {
    this.setState({ spaceVisible: true })
  }
  handleSelect = rows => {

    this.setState({ selectQuestionIds: rows });

  };

  render() {
    const { fyAd: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      }, {
        title: '图片',
        dataIndex: 'img',
        render: val => (
          <img src={config.httpServer + val} style={{ width: 48, height: 27 }} />
        )
      }, {
        title: '高宽',

        render: record => (
          record.adSpace.width+"*"+record.adSpace.height
        )
      }, {
        title: '版位',

        render: record => (
          record.adSpace.name
        )
      }, {
        title: 'url',
        dataIndex: 'url',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        render: val => moment(val).format('YYYY-MM-DD HH:mm')
      },
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
      openAdSpace: this.openAdSpace,
      space: this.state.space
    };

    return (
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
          <iframe src="/text.html"  style={{width:'100%',minHeight:'400px',border:'solid 1px #0062d5'}} ></iframe>

        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <Modal
          title="选择版位"
          visible={this.state.spaceVisible}
          onOk={this.spaceOk}
          onCancel={this.spaceCancel}
          width={800}
        >
          <AdSpaceList isSelect={true} handleSelect={this.handleSelect} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
