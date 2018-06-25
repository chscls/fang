import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch, Checkbox } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import SingleView from '../../components/TestView/SingleView';
import JudgeView from '../../components/TestView/JudgeView';
import MutiplyView from '../../components/TestView/MutiplyView';
import FillView from '../../components/TestView/FillView';
import AskView from '../../components/TestView/AskView';
import moment from 'moment';
export default class TestView extends PureComponent {

    render() {
        if (this.props.testRecord) {
            const { testRecord: { answers, questions,goal,score,createTime,endTime } } = this.props;
            var xx=''
            if(endTime){
            const du=moment.duration(moment(endTime)-moment(createTime), 'ms')
            const years = du.get('years')
            const days = du.get('days')
            const hours = du.get('hours')
            const mins = du.get('minutes')
            const ss = du.get('seconds')
            xx =(years==0?'':years+'年')+(years==0&&days==0?'':days+'天')+(years==0&&days==0&&hours==0?'':hours+'时') + (years==0&&days==0&&hours==0&&mins==0?'':mins+'分') +  (years==0&&days==0&&hours==0&&mins==0&&ss==0?'':ss+'秒') 
        }
            return (
                <div>
             <h2> 得分: {goal} 总分:{score} 开始:{moment(createTime).format('YYYY-MM-DD HH:mm')} 结束:{moment(endTime).format('YYYY-MM-DD HH:mm')} 耗时:{xx}</h2>
                    <ul>
                        {answers.map((answer, i) => {
                            return (
                                <li key={i} type="1">
                                    {questions[answer.index].type == 'single' ? (
                                        <SingleView question={questions[answer.index]} answer={answer} />
                                    ) : questions[answer.index].type == 'mutiply' ? (
                                        <MutiplyView question={questions[answer.index]} answer={answer}/>
                                    ) : questions[answer.index].type == 'judge' ? (
                                        <JudgeView question={questions[answer.index]} answer={answer}/>
                                    ) : questions[answer.index].type == 'fill' ? (
                                        <FillView question={questions[answer.index]} answer={answer}/>
                                    ) : questions[answer.index].type == 'ask' ? (
                                        <AskView question={questions[answer.index]} answer={answer}/>
                                    ) : (
                                                            <SingleView question={questions[answer.index]} answer={answer}/>
                                                        )}

                                    
                                </li>
                            );
                        })}
                    </ul>
</div>
               )
        } else {
            var questions=[]
            if(this.props.question){
                questions.push(this.props.question)
            }else{
            questions= this.props.test.questions
             }
            return (
              
                    <ul>
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
                                    ) : (
                                                            <SingleView question={question} />
                                                        )}
                                </li>
                            );
                        })}
                    </ul>

               )
        }
    }
}