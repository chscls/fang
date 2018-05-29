import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import QRCode from 'qrcode.react';
import {wsConnect,addListener} from '../../utils/websocket';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
function   generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
  };
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))

export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    old:true,
    qcode:generateUUID()
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  changeMode=()=>{
this.setState({old:!this.state.old})
  }

  componentDidMount(){
   
    wsConnect({type:"/qcode/login",body:this.state.qcode},(res)=>{
      const type = res.type
      if(type=="/qcode/wxloginSuc"){
        const user = res.body;
        console.log(res.body)
      }
     
    })
  }
  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div>
      {this.state.old? <div className={styles.main} style={{width:128}} >
      
      <h4>微信小程序扫码登录</h4>
      <QRCode value={this.state.qcode} />
      
      <a onClick={this.changeMode}>使用账号密码登录</a>
      </div>:
      
      <div className={styles.main} >






       <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误（15228888421/123456）')}
            <UserName name="userName" placeholder="15228888421" />
            <Password name="password" placeholder="123456" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式

            <a onClick={this.changeMode}><Icon className={styles.icon} type="qrcode" /></a>
            
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login> 
     
        </div>}
       
      </div>
    );
  }
}
