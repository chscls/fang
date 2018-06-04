import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../../../components/mycom/RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class Single extends PureComponent {
  constructor(props) {
    super(props);

    const value = props.value || {};
    var x = value.items;
    var y = value.isQuestionnaire;

    this.state = {
      items: x,
      isQuestionnaire: y,
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
    items.push({ content: '', isSolution: false, isRich: false });
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
  changeRich = (index, e) => {
    var items = this.state.items;
    items[index].isRich = e;
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
  onChangeInput = (i, e) => {
    var items = this.state.items;
    items[i].content = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ items });
    }
    this.triggerChange({ items });
  };
  onChangeEditor = (i, value) => {
    var items = this.state.items;
    items[i].content = value;
    if (!('value' in this.props)) {
      this.setState({ items });
    }
    this.triggerChange({ items });
  };
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
        <Alert
          closable
          showIcon
          message="请选择一个正确答案,并保证至少有2个选项"
          style={{ marginBottom: 24 }}
        />
        {!isQuestionnaire ? (
          <RadioGroup onChange={this.onChangeRadio} defaultValue={defaultValue}>
            {state.items.map((r, i) => {
              return (
                <ul key={i}>
                  <li style={{ display: 'inline' }}>
                    <Radio value={i} key={i} />
                    {r.isRich ? (
                      <span style={{ width: 30 }}>{String.fromCharCode(i + 65)} </span>
                    ) : (
                      ''
                    )}
                  </li>

                  {r.isRich ? (
                    <li style={{ display: 'inline' }}>
                      <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                    </li>
                  ) : (
                    ''
                  )}
                  {r.isRich ? (
                    <li style={{ display: 'inline' }}>
                      <Switch
                        onChange={this.changeRich.bind(this, i)}
                        checked={r.isRich}
                        checkedChildren="富"
                        unCheckedChildren="常"
                      />
                    </li>
                  ) : (
                    ''
                  )}
                  <li style={{ display: 'inline' }}>
                    {r.isRich ? (
                      <RichEditor
                        defaultValue={r.content}
                        style={{ width: 500 }}
                        onChangeValue={this.onChangeEditor.bind(this, i)}
                        className="ant-row ant-form-item"
                      />
                    ) : (
                      <Input
                        onChange={this.onChangeInput.bind(this, i)}
                        style={{ width: 500 }}
                        addonBefore={
                          <span style={{ width: 30 }}>{String.fromCharCode(i + 65)}</span>
                        }
                        defaultValue={r.content}
                        placeholder="请输入选项"
                      />
                    )}
                  </li>

                  {r.isRich ? (
                    ''
                  ) : (
                    <li style={{ display: 'inline' }}>
                      <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                    </li>
                  )}

                  {r.isRich ? (
                    ''
                  ) : (
                    <li style={{ display: 'inline' }}>
                      <Switch
                        onChange={this.changeRich.bind(this, i)}
                        checked={r.isRich}
                        checkedChildren="富"
                        unCheckedChildren="常"
                      />
                    </li>
                  )}
                </ul>
              );
            })}
          </RadioGroup>
        ) : (
          <div>
            {state.items.map((r, i) => {
              return (
                <ul>
                  <li style={{ display: 'inline' }}>
                    {r.isRich ? (
                      <span style={{ width: 30 }}>{String.fromCharCode(i + 65)} </span>
                    ) : (
                      ''
                    )}
                  </li>

                  {r.isRich ? (
                    <li style={{ display: 'inline' }}>
                      <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                    </li>
                  ) : (
                    ''
                  )}
                  {r.isRich ? (
                    <li style={{ display: 'inline' }}>
                      <Switch
                        onChange={this.changeRich.bind(this, i)}
                        checked={r.isRich}
                        checkedChildren="富"
                        unCheckedChildren="常"
                      />
                    </li>
                  ) : (
                    ''
                  )}
                  <li style={{ display: 'inline' }}>
                    {r.isRich ? (
                      <div>
                        <RichEditor style={{ width: 500 }} className="ant-row ant-form-item" />
                      </div>
                    ) : (
                      <Input
                        style={{ width: 500 }}
                        addonBefore={
                          <span style={{ width: 30 }}>{String.fromCharCode(i + 65)}</span>
                        }
                        defaultValue={r.content}
                        placeholder="请输入选项"
                      />
                    )}
                  </li>

                  {r.isRich ? (
                    ''
                  ) : (
                    <li style={{ display: 'inline' }}>
                      <Button type="primary" icon="delete" onClick={this.delete.bind(this, i)} />
                    </li>
                  )}

                  {r.isRich ? (
                    ''
                  ) : (
                    <li style={{ display: 'inline' }}>
                      <Switch
                        onChange={this.changeRich.bind(this, i)}
                        checked={r.isRich}
                        checkedChildren="富"
                        unCheckedChildren="常"
                      />
                    </li>
                  )}
                </ul>
              );
            })}
          </div>
        )}
        <div>
          <Button type="primary" icon="plus" onClick={this.add}>
            新增选项
          </Button>{' '}
          &nbsp;&nbsp;&nbsp;
          <Switch
            onChange={this.onChange}
            checkedChildren="问卷模式"
            unCheckedChildren="试卷模式"
          />
        </div>
      </div>
    );
  }
}
