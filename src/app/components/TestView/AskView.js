import React, { PureComponent } from 'react';
import { Form, Input, Select,Slider, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
import { InputNumber } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class AskView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { size, question, answer } = this.props;

    const isQuestionnaire = question.isQuestionnaire;
  
    const item = question.items[0];

    return (
      <div style={this.props.style}>
        {question.isRich ? (
          <div dangerouslySetInnerHTML={{ __html: question.title }} />
        ) : (
            <div> {question.title}</div>
          )}
        {answer ? <div >{answer.answers[0]}</div> :
          <div >
            {item.isRich ? <div dangerouslySetInnerHTML={{ __html: item.content }} /> : item.content}
          </div>}
        {answer ? <div style={{ color: `${answer.goal < question.score ? 'red' : ''}` }}>得分:{answer.goal} 分数:{question.score} 参考答案:
        {item.content}
          })}
        </div> : ""}
        {this.props.check?"":<Slider defaultValue={answer&&answer.goal?answer.goal:0} style={{width:600}} step={0.1} max={question.score}/>}
          
     {question.isAnalysisRich ? (question.analysis&&question.analysis!="<p><br></p>"?
          <div dangerouslySetInnerHTML={{ __html:"答案解析:"+ question.analysis }} />:"")
         : (question.analysis&&question.analysis!=""?<div>答案解析: {question.analysis}</div>:"")
          }

      </div>
    );
  }
}
