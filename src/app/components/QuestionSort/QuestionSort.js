import React, { Fragment } from 'react';

import { Form, Icon, Input, Button, Popconfirm, Divider, List, Avatar, Checkbox, Modal } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import QuestionList from '../QuestionList';
import { InputNumber } from 'antd';
import QuestionList from '../../routes/QuestionManage/QuestionList';
export default class QuestionSort extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            indeterminate: true,
            checkAll: false,
            items: [],
            defaultScore:1
        }
    }
    targetScore=(value)=>{
        this.setState({defaultScore:value})
      }
    render() {

        return
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
              {this.checkLength(this.state.items) > 0 ?



                <Popconfirm title={<InputNumber onChange={this.targetScore} defaultValue={1} />} onConfirm={this.changeScore} okText="确定" cancelText="取消">
                    <Button loading={confirmLoading} type="primary" >
                        调分
              </Button>
                </Popconfirm>

                : ""}&nbsp; &nbsp;
              {this.checkLength(this.state.items) > 0 ? <Button type="primary" onClick={this.delete} loading={confirmLoading} >
                剔除
              </Button> : ""}
            <List
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={data2}
                renderItem={item => (
                    <List.Item key={item.index}>
                        <Card index={item.index} id={item.index + 1} moveCard={this.moveCard} disabled={confirmLoading} checked={item.checked} handle={this.handle.bind(this, item.index)} delete={this.delete.bind(this, item.index)} item={item} />
                    </List.Item>
                )}
            />

            <Modal
                title="插入题目"
                visible={this.state.questionModal}
                onOk={this.okHandle}
                width={1800}
                onCancel={() => this.handleModalVisible()}
                confirmLoading={confirmLoading}
            >
                <QuestionList
                    key={key}
                    alreadyIds={alreadyIds}
                    isSelect={true}
                    handleSelect={this.handleSelect}
                />
            </Modal>
        </div>
    }

}
