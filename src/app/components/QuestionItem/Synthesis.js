import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Checkbox, Popconfirm } from 'antd';

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
  componentDidMount() { }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {

    const state = this.state;
    const isQuestionnaire = state.isQuestionnaire;

    return (
      <div>
        <QuestionSort 
        
        items={this.props.items}
        initLoading={false}
        confirmLoading={this.props.onfirmLoading}
        okHandle={this.props.okHandle}
        moveCard={this.props.moveCard}
        defaultScore={this.props.defaultRate}
        delete={this.props.delete}
        changeScore={this.props.changeScore}
    
        />
      </div>
    );
  }
}


