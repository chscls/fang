import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Checkbox ,Popconfirm} from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import QuestionList from '../../routes/QuestionManage/QuestionList';
import { InputNumber } from 'antd';
@DragDropContext(HTML5Backend)
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
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Checkbox
          disabled={confirmLoading}
          indeterminate={this.state.indeterminate}
          onChange={this.onCheckAllChange}
          checked={this.state.checkAll}
        >
          全选
        </Checkbox>
        
        <Button type="primary" onClick={this.openQuestions} loading={confirmLoading} >
          插入题目
        </Button>
        &nbsp; &nbsp;
        {this.checkLength(this.state.items)>0?
        
        
        
         <Popconfirm title={<InputNumber onChange={this.targetScore} defaultValue={1}/>} onConfirm={this.changeScore}  okText="确定" cancelText="取消">
         <Button loading={confirmLoading} type="primary" >
          调分
        </Button>
       </Popconfirm>
        
        :""}&nbsp; &nbsp;
        {this.checkLength(this.state.items)>0?<Button type="primary" onClick={this.delete} loading={confirmLoading} >
          剔除
        </Button>:""}
        <List
        loading={initLoading}
          itemLayout="horizontal"
          dataSource={data2}
          renderItem={item => (
            <List.Item key={item.index}>
              <Card index={item.index} id={item.index+1} moveCard={this.moveCard}  disabled={confirmLoading} checked={item.checked} handle={this.handle.bind(this,item.index)} delete={this.delete.bind(this,item.index)} item={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
