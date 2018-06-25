import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
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
        {answer ? <div >{answer}
        </div> :
          <div >
            {item.isRich ? <div dangerouslySetInnerHTML={{ __html: item.content }} /> : item.content}
          </div>}
        {answer ? <div style={{ color: `${answer.goal < question.score ? 'red' : ''}` }}>得分:{answer.goal} 分数:{question.score} 参考答案:
        {answer.answers[0]}
          })}
        </div> : ""}

     {question.isAnalysisRich ? (question.analysis&&question.analysis!="<p><br></p>"?
          <div dangerouslySetInnerHTML={{ __html:"答案解析:"+ question.analysis }} />:"")
         : (question.analysis&&question.analysis!=""?<div>答案解析: {question.analysis}</div>:"")
          }

      </div>
    );
  }
}
