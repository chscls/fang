import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class Judge extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { size, question,answer} = this.props;

    const isQuestionnaire = question.isQuestionnaire;
    const items = question.items;
    var defaultValue = -1;
    if(answer){
      defaultValue=answer.indexs[0]
    }else{
    for (var i = 0; i < items.length; i++) {
      if (items[i].isSolution) {
        defaultValue = i;
        break;
      }
    }
  }
    return (
      <div style={this.props.style}>
        {question.isRich ? (
          <div dangerouslySetInnerHTML={{ __html: question.title }} />
        ) : (
          <div> {question.title}</div>
        )}
        <RadioGroup defaultValue={defaultValue}>
          {items.map((r, i) => {
            return (
              <div>
                <Radio value={i} key={i} disabled={i != defaultValue} />
                {r.content}
              </div>
            );
          })}
        </RadioGroup>
        {answer?<div style={{color:`${answer.goal<question.score?'red':''}`}}>得分:{answer.goal} 分数:{question.score} 正确答案:
        {answer.orders.map((r,i)=>{
          return items[r].isSolution? <span key={i}>{items[r].content}</span>:""
        })}  
        </div>:""}
      </div>
    );
  }
}