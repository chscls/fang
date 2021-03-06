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
  Avatar,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import defaultImg from '../../../assets/default.png';
import styles from './FriendList.less';
import GroupList from './GroupList';
import { returnAtIndex } from 'lodash-decorators/utils';
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实名">
        {form.getFieldDecorator('realname', {
          initialValue: currentObj.realname,
          rules: [{ required: true, message: '请输入姓名...' }],
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
    </Modal>
  );
});
@connect(({ rule, loading, fyFriend }) => ({
  fyFriend,
  rule,
  loading: loading.models.fyFriend,
}))
@Form.create()
export default class FriendList extends PureComponent {
  state = {
    modalVisible: false,
    groupVisible:false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    currentObj: {},
    selectGroupIds:[]
  };

  componentDidMount() {
    this.getPage();
  }

  getPage = params => {
    const pagination = this.props.fyFriend.data.pagination;

    if (params == null) {
      params = {
        pageNo: pagination.current ? pagination.current : 1,
        pageSize: pagination.pageSize ? pagination.pageSize : 10,
        ...this.state.formValues,
      };
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'fyFriend/fetch',
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

      const pagination=this.props.fyFriend.data.pagination
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

  handleAdd = (fields,back)=> {
    var params = {
      word: fields.word,
    };
    if (this.state.currentObj.id) {
      params.id = this.state.currentObj.id;
    }
    this.props.dispatch({
      type: 'fyFriend/add',
      payload: params,
      callback: res => {
      
          message.success(this.state.currentObj.id ? '修改成功' : '添加成功');
          this.setState({
            modalVisible: false,
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
            <FormItem label="实名">
              {getFieldDecorator('realname')(<Input placeholder="请输入" />)}
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
            <FormItem label="实名">
              {getFieldDecorator('realname')(<Input placeholder="请输入" />)}
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
      type: 'fyFriend/remove',
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
      type: 'fyFriend/remove',
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

  batchGroup= e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    this.setState({groupVisible:true})
  }
  
  groupHandle=()=>{
    if(this.state.selectGroupIds.length>1){
      message.error("请只选择一个分组")
      return
    }
    if(this.state.selectGroupIds.length==0){
      message.error("请选择一个分组")
      return 
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'fyFriend/changeGroup',
      payload: {
        ids: this.state.selectedRows.map(row => row.id).join(','),
        groupId:this.state.selectGroupIds[0]
      },
      callback: () => {
        this.setState({
          selectedRows: [],groupVisible:false
        });
        this.getPage();
      },
    });
  }
  handleSelect = ids => {
    
    this.setState({ selectGroupIds: ids });
  
  };
  render() {
    const { fyFriend: { data }, loading } = this.props;
    const { selectedRows, modalVisible,groupVisible } = this.state;

    const columns = [
      
      {
        title: '实名',
       
        render: val => val.realname
      },
      {
        title: '分组',
       
        render: val => val.group?val.group.name:""
      },{
        title: '头像',
        render: val => (
          <Avatar src={val.user.avatarUrl?val.user.avatarUrl: defaultImg} size="small" />)
      },
      {
        title: '昵称',
       
        render: val => val.user.nickName 
      },
     
      {
        title: '账号',
      
        render: val => val.user.mobile
      },
      {
        title: '国籍',
      
        render: val => val.user.country
      },,
      {
        title: '省份',
       
        render: val => val.user.province
      },
      {
        title: '城市',
        render: val => val.user.city 
      },
      {
        title: '认证时间',
        sorter: true,
        dataIndex: 'createTime',
        render: val =>    moment(val).format('YYYY-MM-DD HH:mm')
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
                  <Button onClick={this.batchGroup.bind(this)}>调整分组</Button>
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
        <Modal
      title="分组列表"
      visible={groupVisible}
      onOk={this.groupHandle}
      width={600}
      onCancel={() => this.setState({groupVisible:false})}
    >
      <GroupList  handleSelect={this.handleSelect} isSelect={true}/>
    </Modal>
      </PageHeaderLayout>
    );
  }
}
