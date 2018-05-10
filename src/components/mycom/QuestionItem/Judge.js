import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../../../components/mycom/RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class Judge extends PureComponent {
  constructor(props) {
    super(props);

    const value = props.value || {};
    var x = value.items;
    var y = value.isQuestionnaire

    this.state = {
      items: x,
      isQuestionnaire: y
    };
  }
  onChange = checked => {
    this.setState({ isQuestionnaire: checked });
  };
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }
  componentDidMount() {

  }
 
 
  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  onChangeRadio = e => {
    var items = this.state.items;
    for (var i = 0; i < items.length; i++) {
      items[i].isSolution = false
      if (i == e.target.value) {
        items[i].isSolution = true
      }
    }
    if (!('value' in this.props)) {
      this.setState({ items });
    }
    this.triggerChange({ items });
  }
 
  render() {
    const { size } = this.props;
    const state = this.state;
    const isQuestionnaire = state.isQuestionnaire;
    var defaultValue = -1;
    for (var i = 0; i < state.items.length; i++) {

      if (state.items[i].isSolution) {
        defaultValue = i;
        break;
      }
    }
    return (
      <div>
         <RadioGroup onChange={this.onChangeRadio} defaultValue={defaultValue}>
          {state.items.map((r, i) => {
            return (
            
            <div><Radio value={i} key={i} />{r.content}</div>
               
            );
          })}
        </RadioGroup> 
       
        
      </div>
    );
  }
}
