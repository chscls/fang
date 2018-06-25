import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
          <div dangerouslySetInnerHTML={{ __html: question.title }} />
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
      </div>
    );
  }
}
