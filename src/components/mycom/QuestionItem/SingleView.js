import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../../../components/mycom/RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class SingleView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { size, question } = this.props;

    const isQuestionnaire = question.isQuestionnaire;
    const items = question.items;
    var defaultValue = -1;
    for (var i = 0; i < items.length; i++) {
      if (items[i].isSolution) {
        defaultValue = i;
        break;
      }
    }
    return (
      <div style={this.props.style}>
        {question.isRich ? (
          <div dangerouslySetInnerHTML={{ __html: question.title }} />
        ) : (
          <div> {question.title}</div>
        )}
        {!isQuestionnaire ? (
          <RadioGroup defaultValue={defaultValue}>
            {items.map((r, i) => {
              return (
                <div key={i}>
                  {String.fromCharCode(i + 65)}、{' '}
                  <Radio value={i} key={i} disabled={i != defaultValue} />
                  {r.isRich ? <div dangerouslySetInnerHTML={{ __html: r.content }} /> : r.content}
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <div>
            {state.items.map((r, i) => {
              return (
                <div key={i}>
                  {String.fromCharCode(i + 65)}、
                  {r.isRich ? <div dangerouslySetInnerHTML={{ __html: r.content }} /> : r.content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
