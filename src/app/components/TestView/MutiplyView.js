import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch, Checkbox } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import config from '../../config';
Array.prototype.in_array = function (element) { 
 
  　　for (var i = 0; i < this.length; i++) { 
   
  　　if (this[i] == element) { 
   
  　　return true; 
   
      } 
   
    } return false; 
   
  } 
  
export default class MutiplyView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { size, question,answer } = this.props;

    const isQuestionnaire = question.isQuestionnaire;
    const items = question.items;
    var defaultValue = [];
    if(answer){
      defaultValue=answer.indexs
    }else{
    for (var i = 0; i < items.length; i++) {
      if (items[i].isSolution) {
        defaultValue.push(i);
     
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
            answer ?<Checkbox.Group defaultValue={defaultValue}>
            {answer.orders.map((r, i) => {
              return (
                <div key={i}>
                  {String.fromCharCode(i + 65)}、{' '}
                  <Checkbox value={r} key={r} disabled={defaultValue.in_array(r)} />&nbsp;&nbsp;
                  {r.isRich ? <div dangerouslySetInnerHTML={{ __html:items[r].content }} /> : items[r].content}
                </div>
              );
            })}
          </Checkbox.Group>:
          <Checkbox.Group defaultValue={defaultValue}>
          {items.map((r, i) => {
            return (
              <div key={i}>
                {String.fromCharCode(i + 65)}、{' '}
                <Checkbox value={i} key={i} disabled={defaultValue.in_array(i)} />&nbsp;&nbsp;
                {r.isRich ? <div dangerouslySetInnerHTML={{ __html: r.content }} /> : r.content}
              </div>
            );
          })}
        </Checkbox.Group>
          
        ) : (
          <div>
            {state.items.map((r, i) => {
              return (
                <div key={i}>
                  {String.fromCharCode(i + 65)}、
                  {r.isRich ? <div dangerouslySetInnerHTML={{ __html: r.content }} /> : r.content}
                </div>
              );
            })}
          </div>
        )}
  
  {answer?<div style={{color:`${answer.goal<question.score?'red':''}`}}>得分:{answer.goal} 分数:{question.score} 正确答案:
        {answer.orders.map((r,i)=>{
          return items[r].isSolution? String.fromCharCode(i + 65):""
        })}  
        </div>:""}

          {question.isAnalysisRich ? (question.analysis&&question.analysis!="<p><br></p>"?
          <div dangerouslySetInnerHTML={{ __html:"答案解析:"+ question.analysis }} />:"")
         : (question.analysis&&question.analysis!=""?<div>答案解析: {question.analysis}</div>:"")
          }
      </div>
    );
  }
}
