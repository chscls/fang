import React, { PureComponent } from 'react';
import { Form, Input, Select, Alert, message, Button, Radio, Switch } from 'antd';
import RichEditor from '../RichEditor/RichEditor';
import { truncate } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import config from '../../config';
export default class SynthesisView extends PureComponent {
  constructor(props) {
    super(props);
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
          
       

         answer ? <ul style={{ backgroundColor: '#91d5ff' }}>
          { question.subQuestions.map((question, i) => {
              return (
                  <li key={i}>
                      {question.type == 'single' ? (
                          <SingleView question={question} />
                      ) : question.type == 'mutiply' ? (
                          <MutiplyView question={question} />
                      ) : question.type == 'judge' ? (
                          <JudgeView question={question} />
                      ) : question.type == 'fill' ? (
                          <FillView question={question} />
                      ) : (
                          <AskView question={question} />
                      ) 
                      }
                  </li>
              );
          })}
      </ul>: <ul style={{ backgroundColor: '#91d5ff' }}>
          { answer.answers.map((answer, i) => {
              return (
                  <li key={i}>
                      {question.subQuestions[answer.index].type == 'single' ? (
                          <SingleView question={question.subQuestions[answer.index]} answer={answer} />
                      ) : question.type == 'mutiply' ? (
                          <MutiplyView question={question.subQuestions[answer.index]} answer={answer}/>
                      ) : question.type == 'judge' ? (
                          <JudgeView question={qquestion.subQuestions[answer.index]} answer={answer}/>
                      ) : question.type == 'fill' ? (
                          <FillView question={question.subQuestions[answer.index]} answer={answer}/>
                      ) : (
                          <AskView question={question.subQuestions[answer.index]} answer={answer}/>
                      ) 
                      }
                  </li>
              );
          })}
      </ul>


          
         




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

        {answer ? <div style={{ color: `${answer.goal < question.score ? 'red' : ''}` }}>得分:{answer.goal} 分数:{question.score} 正确答案:
        {answer.orders.map((r, i) => {
            return items[r].isSolution ? <span key={i}>{String.fromCharCode(i + 65)}&nbsp; </span> : ""
          })}

        </div> : ""}

           {question.isAnalysisRich ? (question.analysis&&question.analysis!="<p><br></p>"?
          <div dangerouslySetInnerHTML={{ __html:"答案解析:"+ question.analysis }} />:"")
         : (question.analysis&&question.analysis!=""?<div>答案解析: {question.analysis}</div>:"")
          }
      </div>
    );
  }
}
