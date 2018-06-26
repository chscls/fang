import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch, Checkbox } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { connect } from 'dva';
import { truncate } from 'fs';
const FormItem = Form.Item;
import config from '../../config';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import SingleView from '../../components/TestView/SingleView';
import JudgeView from '../../components/TestView/JudgeView';
import MutiplyView from '../../components/TestView/MutiplyView';
import FillView from '../../components/TestView/FillView';
import AskView from '../../components/TestView/AskView';
import moment from 'moment';
@connect(({ loading, fyTestRecord }) => ({

    loading: loading.models.fyTestRecord,
    fyTestRecord,
}))
export default class TestView extends PureComponent {
    componentDidMount() {
        if (this.props.match) {

            this.props.dispatch({
                type: 'fyTestRecord/find',
                payload: {
                    id: this.props.match.params.id
                },
                callback: () => {
                    window.print()
                }
            })

        }
    }
    print = (id, type) => {
        const cfg = 'fullscreen=0,toolbar=0.scrollbars=1,location=0,directories=0,status=0,menubar=0,resizable=0,top=0,left=0'
        const url = `${config.webServer}/#/user/${id}/${type}`
        const myWin = window.open(url, '_blank', cfg, false)
        myWin.moveTo(0, 0)
        myWin.resizeTo(screen.availWidth, screen.availHeight)

    }
    render() {

        var testRecord;
        if (this.props.match) {
            testRecord = this.props.fyTestRecord.testRecord
        } else {
            testRecord = this.props.testRecord

        }


        if (testRecord) {
            const { answers, questions, goal, score, createTime, endTime, id } = testRecord;
            var xx = ''
            if (endTime) {
                const du = moment.duration(moment(endTime) - moment(createTime), 'ms')
                const years = du.get('years')
                const days = du.get('days')
                const hours = du.get('hours')
                const mins = du.get('minutes')
                const ss = du.get('seconds')
                xx = (years == 0 ? '' : years + '年') + (years == 0 && days == 0 ? '' : days + '天') + (years == 0 && days == 0 && hours == 0 ? '' : hours + '时') + (years == 0 && days == 0 && hours == 0 && mins == 0 ? '' : mins + '分') + (years == 0 && days == 0 && hours == 0 && mins == 0 && ss == 0 ? '' : ss + '秒')
            }
            return (
                <div style={{ margin: 'auto', width: 800 }} >  {this.props.match ? "" :testRecord.status=="complete"?<Button type="primary" onClick={this.print.bind(this, id, "record")}>打印</Button>:""}
                    {testRecord.status=="complete"?<h2> 得分: {goal} 总分:{score} 开始:{moment(createTime).format('YYYY-MM-DD HH:mm')} 结束:{moment(endTime).format('YYYY-MM-DD HH:mm')} 耗时:{xx}</h2>:""}
                    <ul>
                        {answers.map((answer, i) => {
                            if(testRecord.status=="complete"){
                            return (
                                <li key={i} type="1">
                                    {questions[answer.index].type == 'single' ? (
                                        <SingleView question={questions[answer.index]} answer={answer} />
                                    ) : questions[answer.index].type == 'mutiply' ? (
                                        <MutiplyView question={questions[answer.index]} answer={answer} />
                                    ) : questions[answer.index].type == 'judge' ? (
                                        <JudgeView question={questions[answer.index]} answer={answer} />
                                    ) : questions[answer.index].type == 'fill' ? (
                                        <FillView question={questions[answer.index]} answer={answer} />
                                    ) : questions[answer.index].type == 'ask' ? (
                                        <AskView question={questions[answer.index]} answer={answer}/>
                                    ) : <SingleView question={questions[answer.index]} answer={answer} />
                                    }


                                </li>
                            );
                            }else{
                                return (
                                    <li key={i} type="1">
                                       
                                        {questions[answer.index].type == 'ask' ? 
                                            <AskView question={questions[answer.index]} answer={answer} isCheck={true}/>
                                        :""
                                        }
    
    
                                    </li>
                                );
                            }      
                        })}
                    </ul>



                </div>
            )
        } else if (this.props.test||this.props.question) {
            var questions = []
            if (this.props.question) {
                questions.push(this.props.question)
            } else {
                questions = this.props.test.questions
            }
            return (

                <ul style={{backgroundColor:'#91d5ff'}}>
                    {questions.map((question, i) => {
                        return (
                            <li key={i}>
                                {question.type == 'single' ? (
                                    <SingleView question={question} />
                                ) : question.type == 'mutiply' ? (
                                    <MutiplyView question={question} />
                                ) : question.type == 'judge' ? (
                                    <JudgeView question={question} />
                                ) : question.type == 'fill' ? (
                                    <FillView question={question} />
                                ) : question.type == 'ask' ? (
                                    <AskView question={question} />
                                ) : <SingleView question={question} />
                                }
                            </li>
                        );
                    })}
                </ul>

            )
        } else {
            return (<div>加载中...</div>)
        }
    }
}