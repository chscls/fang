import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, Slider,message, Button, Radio, Switch } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import config from '../../config';
export default class FillView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { size, question,answer } = this.props;

    const isQuestionnaire = question.isQuestionnaire;
    const items = question.items;

    return (
      <div style={this.props.style}>
        {question.isRich ? (
          <div dangerouslySetInnerHTML={{ __html: question.title.replace("<img src=\"","<img src=\""+config.httpServer) }} />
        ) : (
          <div> {question.title}</div>
        )}
        {answer?answer.answers.map((r, i) => {
          return (
            <div key={i}>
              {'空' + (i + 1)}、
              {r}
            </div>
          );
        }):items.map((r, i) => {
          return (
            <div key={i}>
              {'空' + (i + 1)}、
              {r.content}
            </div>
          );
        })}

        {answer?<div style={{color:`${answer.goal<question.score?'red':''}`}}>得分:{answer.goal} 分数:{question.score} 正确答案:
        {items.map((r,i)=>{
          return <span>空{i+1}.{r.content}&nbsp;</span>
        })} 
        </div>:""}


     
          
          
          {question.isAnalysisRich ? (question.analysis&&question.analysis!="<p><br></p>"?
          <div dangerouslySetInnerHTML={{ __html:"答案解析:"+ question.analysis.replace("<img src=\"","<img src=\""+config.httpServer) }} />:"")
         : (question.analysis&&question.analysis!=""?<div>答案解析: {question.analysis}</div>:"")
          }
      </div>
    );
  }
}
