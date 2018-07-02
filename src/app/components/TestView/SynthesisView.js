import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message,Popconfirm,Modal,Checkbox, Button, Radio,InputNumber , Switch } from 'antd';
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
import config from '../../config';
@DragDropContext(HTML5Backend)
export default class SynthesisView extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
        checkAll: false,
    }
  }

  render() {
    const { size, question, answer } = this.props;

    const isQuestionnaire = question.isQuestionnaire;
    const items = question.items;
    var defaultValue = -1;
    if (answer) {
      defaultValue = answer.indexs[0]
    } else {
      for (var i = 0; i < items.length; i++) {
        if (items[i].isSolution) {
          defaultValue = i;
          break;
        }
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
          answer ? <RadioGroup defaultValue={defaultValue}>
            {answer.orders.map((r, i) => {
              return (
                <div key={i}>
                  {String.fromCharCode(i + 65)}、{' '}
                  <Radio value={r} key={r} disabled={r != defaultValue} />
                  {r.isRich ? <div dangerouslySetInnerHTML={{ __html:items[r].content }} /> :items[r].content}
                </div>
              );
            })}
          </RadioGroup>
            : <div>
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
        ) : ""}

        {answer ? <div style={{ color: `${answer.goal < question.score ? 'red' : ''}` }}>得分:{answer.goal} 分数:{question.score} 正确答案:
        {answer.orders.map((r, i) => {
            return items[r].isSolution ? <span key={i}>{String.fromCharCode(i + 65)}&nbsp; </span> : ""
          })}

        </div> : ""}

           {question.isAnalysisRich ? (question.analysis&&question.analysis!="<p><br></p>"?
          <div dangerouslySetInnerHTML={{ __html:"答案解析:"+ question.analysis }} />:"")
         : (question.analysis&&question.analysis!=""?<div>答案解析: {question.analysis}</div>:"")
          }

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
    );
  }
}
