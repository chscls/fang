import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Checkbox ,Popconfirm} from 'antd';

import { InputNumber } from 'antd';

import QuestionSort from '../QuestionSort/QuestionSort';
export default class Synthesis extends PureComponent {
  constructor(props) {
    super(props);

    const value = props.value || {};
    var x = value.subQuestionConfigs;
    var y = value.isQuestionnaire;
  
    this.state = {
        checkAll: false,
     subQuestionConfigs: x,
      isQuestionnaire: y,
      indeterminate: true,
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
  componentDidMount() {}

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
      items[i].isSolution = false;
      if (i == e.target.value) {
        items[i].isSolution = true;
      }
    }
    if (!('value' in this.props)) {
      this.setState({ items });
    }
    this.triggerChange({ items });
  };

  render() {
  
    const state = this.state;
    const isQuestionnaire = state.isQuestionnaire;
 
    return (
      <div>
      <QuestionSort />
      </div>
    );
  }
}
