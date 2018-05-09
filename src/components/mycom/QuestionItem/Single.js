import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../../../components/mycom/RichEditor/RichEditor';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class SingleItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isRich: false };
  }
  onChange = (checked) => {
    this.setState({ isRich: checked });
  };

  render() {
    const i = this.props.index;
    const r = this.props.item;
    return (
      <div>
        <Button type="primary" onClick={this.props.delete}>
          删除
        </Button>
        <Switch
          onChange={this.onChange}
          defaultChecked={false}
          checkedChildren="富文本"
          unCheckedChildren="常规"
        />
        {this.state.isRich ? (
          <RichEditor className="ant-row ant-form-item" />
        ) : (
            <Input
              addonBefore={<span style={{ width: 30 }}>{String.fromCharCode(i + 65)}</span>}
              defaultValue={r.content}
              placeholder="请输入选项"
            />
          )}
      </div>
    );
  }
}
export default class Single extends PureComponent {
  constructor(props) {
    super(props);

    const value = props.value || {};
    var x = value.items;

    
    this.state = {
      items: x,
      isQuestionnaire: false
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
  add = () => {
    var items = this.state.items;
    items.push({ content: '', isSolution: false });
    if (!('value' in this.props)) {
      this.setState({ items });
    }
    this.triggerChange({ items });
  };
  delete = index => {
    var items = this.state.items;
    if (items.length <= 2) {
      message.error('至少保留2个选项');
      return;
    }
    items.splice(index, 1);

    if (!('value' in this.props)) {
      this.setState({ items });
    }
    this.triggerChange({ items });
  };
  changeRich = index => {
    var items = this.state.items;
    items[index].isRich = !items[index].isRich;
    if (!('value' in this.props)) {
      this.setState({ items });
    }
    this.triggerChange({ items });
  };
  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  render() {
    const { size } = this.props;
    const state = this.state;
    const isQuestionnaire = state.isQuestionnaire;

    return (
      <div>
        <Alert
          closable
          showIcon
          message="请选择一个正确答案,并保证至少有2个选项"
          style={{ marginBottom: 24 }}
        />
        {!isQuestionnaire ? <RadioGroup>
          {state.items.map((r, i) => {
            return (
              <ul>
                <li style={{ display: 'inline' }}>
                  <Radio value={i} key={i} />
                  {r.isRich ?
                    <span style={{ width: 30 }}>{String.fromCharCode(i + 65)} </span>
                    :
                    ''
                  }
                </li>

                {r.isRich ?
                  <li style={{ display: 'inline' }}>
                    <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                  </li>
                  :
                  ''}
                {r.isRich ?
                  <li style={{ display: 'inline' }}>

                    <Switch
                      onChange={this.changeRich.bind(this, i)}
                      checked={r.isRich}
                      checkedChildren="富"
                      unCheckedChildren="常"
                    />
                  </li>
                  :
                  ''
                }
                <li style={{ display: 'inline' }}>
                  {r.isRich ?
                    <div>

                      <RichEditor style={{ width: 500 }} className="ant-row ant-form-item" />
                    </div>
                    :
                    <Input
                      style={{ width: 500 }}
                      addonBefore={<span style={{ width: 30 }}>{String.fromCharCode(i + 65)}</span>}
                      defaultValue={r.content}
                      placeholder="请输入选项"
                    />
                  }
                </li>

                {r.isRich ?
                  '' :
                  <li style={{ display: 'inline' }}>
                    <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                  </li>
                }

                {r.isRich ? '' :
                  <li style={{ display: 'inline' }}>

                    <Switch
                      onChange={this.changeRich.bind(this, i)}
                      checked={r.isRich}
                      checkedChildren="富"
                      unCheckedChildren="常"
                    />
                  </li>
                }
              </ul>
            );
          })}
        </RadioGroup> : 
      
      <div>

    {state.items.map((r, i) => {
            return (
              <ul>
                <li style={{ display: 'inline' }}>
                
                  {r.isRich ?
                    <span style={{ width: 30 }}>{String.fromCharCode(i + 65)} </span>
                    :
                    ''
                  }
                </li>

                {r.isRich ?
                  <li style={{ display: 'inline' }}>
                    <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                  </li>
                  :
                  ''}
                {r.isRich ?
                  <li style={{ display: 'inline' }}>

                    <Switch
                      onChange={this.changeRich.bind(this, i)}
                      checked={r.isRich}
                      checkedChildren="富"
                      unCheckedChildren="常"
                    />
                  </li>
                  :
                  ''
                }
                <li style={{ display: 'inline' }}>
                  {r.isRich ?
                    <div>

                      <RichEditor style={{ width: 500 }} className="ant-row ant-form-item" />
                    </div>
                    :
                    <Input
                      style={{ width: 500 }}
                      addonBefore={<span style={{ width: 30 }}>{String.fromCharCode(i + 65)}</span>}
                      defaultValue={r.content}
                      placeholder="请输入选项"
                    />
                  }
                </li>

                {r.isRich ?
                  '' :
                  <li style={{ display: 'inline' }}>
                    <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                  </li>
                }

                {r.isRich ? '' :
                  <li style={{ display: 'inline' }}>

                    <Switch
                      onChange={this.changeRich.bind(this, i)}
                      checked={r.isRich}
                      checkedChildren="富"
                      unCheckedChildren="常"
                    />
                  </li>
                }
              </ul>
            );
          })}

        </div>
      
      
      }
        <div>
          <Button type="primary" icon="plus" onClick={this.add}>
            新增选项
          </Button> &nbsp;&nbsp;&nbsp;
          <Switch onChange={this.onChange}
            checkedChildren="问卷模式"
            unCheckedChildren="试卷模式"
          />
        </div>
      </div>
    );
  }
}
