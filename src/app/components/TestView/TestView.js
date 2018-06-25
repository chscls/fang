import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch, Checkbox } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import SingleView from '../../components/QuestionItem/SingleView';
import JudgeView from '../../components/QuestionItem/JudgeView';
import MutiplyView from '../../components/QuestionItem/MutiplyView';
import FillView from '../../components/QuestionItem/FillView';
import AskView from '../../components/QuestionItem/AskView';
export default class TestView extends PureComponent {

    render() {
        if (this.props.testRecord) {
            const { testRecord: { answers, questions } } = this.props;
            console.log(questions)
            return (
             
                    <ul>
                        {answers.map((answer, i) => {
                            return (
                                <li key={i}>
                                    {questions[answer.index].type == 'single' ? (
                                        <SingleView question={questions[answer.index]} />
                                    ) : questions[answer.index].type == 'mutiply' ? (
                                        <MutiplyView question={questions[answer.index]} />
                                    ) : questions[answer.index].type == 'judge' ? (
                                        <JudgeView question={questions[answer.index]} />
                                    ) : questions[answer.index].type == 'fill' ? (
                                        <FillView question={questions[answer.index]} />
                                    ) : questions[answer.index].type == 'ask' ? (
                                        <AskView question={questions[answer.index]} />
                                    ) : (
                                                            <SingleView question={questions[answer.index]} />
                                                        )}
                                </li>
                            );
                        })}
                    </ul>

               )
        } else {
            const { test: { questions } } = this.props;

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