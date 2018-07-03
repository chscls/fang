import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../../utils/utils';
import Single from '../../../components/QuestionItem/Single';
import Judge from '../../../components/QuestionItem/Judge';
import Mutiply from '../../../components/QuestionItem/Mutiply';
import Fill from '../../../components/QuestionItem/Fill';
import Ask from '../../../components/QuestionItem/Ask';
import styles from './style.less';
import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';
import { createTrue } from 'typescript';
import config from '../../../config';
import Synthesis from '../../../components/QuestionItem/Synthesis';
const formItemLayout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 23,
  },
};

@Form.create()
class QuestionStep2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      isRich: false,
      isQuestionnaire: false,
      title: '',
      isReady: false,
      items: [],
      subQuestionConfigs:[],
      type: 'single',
      orgItems:[],
    };
  }
  preHandle = question => {};
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.dispatch({
      type: 'fyQuestion/clear',
      payload: null,
    });
    if (id == 0) {
      this.setState({ isReady: true });
    } else {
      this.props.dispatch({
        type: 'fyQuestion/find',
        payload: { id: id },
        callback: question => {
          const orgItems =[]
          const items = question.items;
          for (let i = 0; i < items.length; i++) {
            orgItems.push(items[i])
           }
          
         
          
          if (question.type == 'single' || question.type == 'mutiply') {
            if (items.length == 0) {
              items.push({ content: '', isSolution: false, isRich: false });
              items.push({ content: '', isSolution: false, isRich: false });
            } else if (items.length == 1) {
              items.push({ content: '', isSolution: false, isRich: false });
            }
          } else if (question.type == 'judge') {
            if (items.length == 0) {
              items.push({ content: '对', isSolution: false, isRich: false });
              items.push({ content: '错', isSolution: false, isRich: false });
            } else if (items.length == 1) {
              items[0].content == '对';
              items.push({ content: '错', isSolution: false, isRich: false });
            } else if (items.length >= 2) {
              if (items[0].isSolution) {
                items.splice(0, items.length);
                items.push({ content: '对', isSolution: true, isRich: false });
                items.push({ content: '错', isSolution: false, isRich: false });
              } else if (items[1].isSolution) {
                items.splice(0, items.length);
                items.push({ content: '对', isSolution: true, isRich: false });
                items.push({ content: '错', isSolution: false, isRich: false });
              } else {
                items.splice(0, items.length);
                items.push({ content: '对', isSolution: false, isRich: false });
                items.push({ content: '错', isSolution: false, isRich: false });
              }
            }
          }else if (question.type == 'synthesis') {
            const items = [];

            for (var i = 0; i < question.subQuestions.length; i++) {
              items[i] = { index: i, q: question.subQuestions[i], checked: false };
            }
  
            
          }else {
            if (items.length == 0) {
              items.push({ content: '', isSolution: false, isRich: false });
            }
          }

          this.setState({
            isReady: true,
            id: question.id,
            items,
            isRich: question.isRich,
            isQuestionnaire: question.isQuestionnaire,
            title: question.title,
            type: question.type,
            orgItems
          });
        },
      });
    }
  }
  check=(values,question)=>{
    
    if(values.options.isQuestionnaire!=question.isQuestionnaire){
    
      return true
    }
  
    if(values.options.items!=this.state.orgItems)
    {
     
      return true;
    }
    return false;
  }


  changeRate = (ids, score, back) => {
 
    this.props.dispatch({
      type: 'fyTest/updateTestQuestions',
      payload: {
        id: this.state.id,
        qids: ids,
        score: score
      },
      callback: question => {
        back(question)
      }
    });

  };
  delete = (ids, back) => {
    
    this.props.dispatch({
      type: 'fyTest/updateTestQuestions',
      payload: {
        id: this.state.id,
        qids: ids
      },
      callback: question => {
        back(question)
      },
    });
  }


  okHandle = (selectIds, back) => {
    var question= this.props.fyQuestion.question;
    var alreadyQids = question.subQuestionConfigs.map(cfg => cfg.id).join(',')
    alreadyQids = selectIds + "," + alreadyQids;

    this.props.dispatch({
      type: 'fyQuestion/updateQuestionQuestions',
      payload: {
        id: this.state.id,
        qids: alreadyQids
      },
      callback: qes => {
        back(qes)
      },
    });
  };

  moveCard = (dragIndex, hoverIndex, back) => {
    // console.log(dragIndex,hoverIndex)
    var question= this.props.fyQuestion.question;
    var alreadyQids = question.subQuestionConfigs;

    [alreadyQids[dragIndex], alreadyQids[hoverIndex]] = [alreadyQids[hoverIndex], alreadyQids[dragIndex]];
    alreadyQids = alreadyQids.map(cfg => cfg.id).join(',')
    this.props.dispatch({
      type: 'fyQuestion/updateQuestionQuestions',
      payload: {
        id: this.state.id,
        qids: alreadyQids
      },
      callback: qes => {
        back(qes)
      },
    });
  }
  render() {
    const { form, data, dispatch, submitting,fyQuestion:{question} } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const items = this.state.items;
    const subQuestionConfigs = this.state.subQuestionConfigs ;
    const isQuestionnaire = this.state.isQuestionnaire;
    const type = this.state.type;

    const onPrev = () => {
      dispatch(routerRedux.push(`/question-manage/question-add/info/${this.state.id}`));
    };
    const onValidateForm = e => {
     
      e.preventDefault();
      validateFields((err, values) => {
       if(!this.check(values,question)){
        dispatch(routerRedux.push(`/question-manage/question-add/result/${this.state.id}`));
        return
       }
        if (!err) {
          dispatch({
            type: 'fyQuestion/updateOptions',
            payload: {
              id: this.state.id,
              options: JSON.stringify(values.options.items),
              isQuestionnaire: values.options.isQuestionnaire,
            },
            callback: id => {
              dispatch(routerRedux.push(`/question-manage/question-add/result/${id}`));
            },
          });
        }
      });
    };
    return (
      <Fragment>
        {this.state.isReady ? (
          <Form layout="horizontal" className={styles.stepForm} style={{ maxWidth: 1000 }}>
            <Form.Item {...formItemLayout} label="标题">
              {this.state.isRich ? (
                <div dangerouslySetInnerHTML={{ __html: this.state.title }} />
              ) : (
                <div> {this.state.title}</div>
              )}
            </Form.Item>

            <Form.Item style={{ maxWidth: 1000 }} {...formItemLayout} label="选项">
              {getFieldDecorator('options', {
                initialValue: { items: items, isQuestionnaire: isQuestionnaire,subQuestionConfigs:subQuestionConfigs  },
              })(
                type == 'single' ? (
                  <Single />
                ) : type == 'judge' ? (
                  <Judge />
                ) : type == 'mutiply' ? (
                  <Mutiply />
                ) : type == 'fill' ? (
                  <Fill />
                ) : type == 'ask' ? (
                  <Ask />
                ) : type == 'single' ? (
                  <Single />
                ) :(
                  <Synthesis selfId={this.state.id} defaultRate={1} onfirmLoading={submitting} okHandle={this.okHandle} changeScore={this.changeRate} moveCard={this.moveCard} delete={this.delete} items= {items}/>
                )
              )}
            </Form.Item>

            <Form.Item
              style={{ marginBottom: 8 }}
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <div style={{ margin: 'auto', width: 200 }}>
                <Button type="primary" onClick={onValidateForm} loading={submitting}>
                  提交
                </Button>
                <Button onClick={onPrev} style={{ marginLeft: 8 }} loading={submitting}>
                  上一步
                </Button>
              </div>
            </Form.Item>
          </Form>
        ) : (
          ''
        )}
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>问卷模式</h4>
          <p>问卷模式无需选择或填写正确答案</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ form, loading, fyQuestion }) => ({
  submitting: loading.effects['fyQuestion/updateOptions'],
  data: form.step,
  fyQuestion,
}))(QuestionStep2);
