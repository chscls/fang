import React, { PureComponent } from 'react';
import { Form, Input, Select, message, Button, Radio ,Switch} from 'antd';
import RichEditor from '../../../components/mycom/RichEditor/RichEditor';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
 class SingleItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state={isRich:false}
    }
    onChange=(checked)=>{
        this.setState({isRich:checked})
    }
    render(){
        const i = this.props.index
        const r = this.props.item
        return<div><Button type="primary" onClick={this.props.delete} >删除</Button> <Switch onChange={this.onChange} defaultChecked={false} checkedChildren="富文本" unCheckedChildren="常规" />
        
        {this.state.isRich?<RichEditor/>:
        <Input addonBefore={<span style={{ width: 30 }}>{String.fromCharCode(i + 65)}</span>} defaultValue={r.content} placeholder="请输入选项" />}</div>
         
    }

}
export default class Single extends PureComponent {

    constructor(props) {
        super(props);

        const value = props.value || {};
        var x = value.items

        if (x.length == 0) {
            x.push({ content: "", isSolution: false });
            x.push({ content: "", isSolution: false });
        } else if (x.length == 1) {
            x.push({ content: "", isSolution: false });
        }
        this.state = {
            items: x

        };
    }
    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }
    add = () => {
        var items = this.state.items;
        items.push({ content: "", isSolution: false });
        if (!('value' in this.props)) {
            this.setState({ items });
        }
        this.triggerChange({ items });
    }
    delete = (index) => {

        var items = this.state.items;
        if (items.length <= 2) {
            message.error('至少保留2个选项');
            return
        }
        items.splice(index, 1);

        if (!('value' in this.props)) {
            this.setState({ items });
        }
        this.triggerChange({ items });
    }
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }
    render() {
        const { size } = this.props;
        const state = this.state;

        return (
            <div>
                <Button type="primary" onClick={this.add} >新增选项</Button>
                <RadioGroup>
                    {state.items.map((r, i) => {

                        return (<p><Radio  value={i} key={i}/><SingleItem item={r}  index={i} delete={this.delete.bind(this,i)}/></p>)
                    })
                    }
                </RadioGroup>
            </div>
        );
    }
}

