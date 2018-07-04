import React, { Fragment } from 'react';

import { Form, Icon, Input, Button, Popconfirm, Divider, List, Avatar, Checkbox, Modal } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import { InputNumber } from 'antd';
import QuestionList from '../../routes/QuestionManage/QuestionList';
var key = 1;
@DragDropContext(HTML5Backend)
export default class QuestionSort extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            indeterminate: true,
            checkAll: false,
            items: this.props.items ? this.props.items : [],
            defaultScore: this.props.defaultScore,
            selectQuestionIds: [],
            questionModal: false,
            flag:false,
        }
    }
    targetScore = (value) => {
        this.setState({ defaultScore: value })
    }
    onCheckAllChange = e => {
        const items = this.state.items;

        if (!e.target.checked) {
            for (var i = 0; i < items.length; i++) {
                items[i] = { index: items[i].index, q: items[i].q, checked: false };
            }
        } else {
            for (var i = 0; i < items.length; i++) {
                items[i] = { index: items[i].index, q: items[i].q, checked: true };
            }
        }

        this.setState({
            items,
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };
    openQuestions = () => {
        this.setState({
            questionModal: true,
        });
    };
    handleModalVisible = () => {
        this.setState({
            questionModal: false,
        });
    };
    changeScore = () => {

        var ids = []

        for (var i = 0; i < this.state.items.length; i++) {
            if (this.state.items[i].checked) {
                ids.push(this.state.items[i].q.id)
            }
        }
        if (this.props.changeScore) {

            this.props.changeScore(ids,this.state.defaultScore, test => {
                key = key + 1;
                const items = [];

                for (var i = 0; i < test.questions.length; i++) {
                    items[i] = { index: i, q: test.questions[i], checked: false };
                }
                this.setState({
                    items, defaultScore: 1
                });



            });



        }
    };
    moveCard = (dragIndex, hoverIndex) => {

        if (this.props.moveCard) {
            this.props.moveCard(dragIndex,hoverIndex, test => {
                const x = test.questions?test.questions:test.subQuestions

                key = key + 1;
                const items = [];
                for (var i = 0; i < x.length; i++) {
                    items[i] = { index: i, q: x[i], checked: false };
                }
                this.setState({
                    items,
                });


            });



        }

    }
    delete = () => {
        var ids = []
        for (var i = 0; i < this.state.items.length; i++) {
            if (!this.state.items[i].checked) {
                ids.push(this.state.items[i].q.id)
            }
        }
        if (this.props.delete) {

            this.props.delete(ids.map(id => id).join(','), test => {
                const x = test.questions?test.questions:test.subQuestions
                key = key + 1;
                const items = [];

                for (var i = 0; i < x.length; i++) {
                    items[i] = { index: i, q:x[i], checked: false };
                }
                this.setState({
                    questionModal: false,
                    items,
                });


            });


        }
    }
    handleSelect = ids => {

        this.setState({ selectQuestionIds: ids });

    };
    handle = (index, e) => {
        const items = this.state.items;
    
        items[index].checked = e.target.checked;
    
        this.setState({
          items,
          flag: !this.state.flag,
          indeterminate: this.checkLength(items) < items.length,
          checkAll: this.checkLength(items) === items.length,
        });
      };
    okHandle = () => {
        if (this.props.okHandle) {
            this.props.okHandle(this.state.selectQuestionIds, test => {
                key = key + 1;
                const items = [];
                const x = test.questions?test.questions:test.subQuestions
                for (var i = 0; i < x.length; i++) {
                    items[i] = { index: i, q: x[i], checked: false };
                }
                this.setState({
                    questionModal: false,
                    items,
                });

            })
        };
    }
    checkLength(items) {
        var count = 0;
        for (var i = 0; i < items.length; i++) {
          if (items[i].checked) {
            count++;
          }
        }
    
        return count;
      }
    render() {
        const { confirmLoading, initLoading } = this.props

        const data2 = this.state.items;
        var alreadyIds = data2.map(row => row.q?row.q.id:row.id).join(',')
      
       
        return(
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
                        <Card index={item.index} id={item.index + 1} moveCard={this.moveCard} disabled={confirmLoading} handle={this.handle.bind(this, item.index)} checked={item.checked} delete={this.delete.bind(this, item.index)} item={item} />
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
                    isQuestion={true}
                />
            </Modal>
        </div>)
    }

}
