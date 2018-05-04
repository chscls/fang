import React, { PureComponent } from 'react';

import ReactQuill from 'react-quill';
import theme from 'react-quill/dist/quill.snow.css'

import { Modal, Button, Input, Icon, Upload, message } from 'antd';
const props = {
  name: 'file',
  showUploadList: 'false',
  customRequest: function (file) {


    var reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = function (e) { alert(this.result); }
  }
};

const InputGroup = Input.Group;
/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */

/*
 * Custom toolbar component including insertStar button and dropdowns
 */


export default class RichEditor extends PureComponent {
  constructor(props) {
    super(props)
  
    this.id = "toolbar" + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1);
    this.modules = {
      toolbar: {
        container: "#" + this.id,
        handlers: {

        }
      }
    }

    this.state = {
      editorHtml: this.props.value == null ? "" : this.props.value,


    }

  }
  handleChange(content, delta, source, editor) {
    this.setState({ editorHtml: content })
    if (this.props.onChangeValue) {
      this.props.onChangeValue(content);
    }
  }



  render() {

    return (

      <div className={this.props.className} style={this.props.style}>
        <div id={this.id} >
        <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
        <button  title="粗体" className="ql-bold" ></button>
        
          
          <button title="斜体" className="ql-italic" ></button>
          <button title="下划线" className="ql-underline" ></button>
          
          <button title="上传图片" className="ql-image" ></button>
          <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>
          <button title="公式"><Icon type="api" /></button>
          
        </div>


        <ReactQuill  style={{height:'200px'}}  value={this.state.editorHtml}
          onChange={this.handleChange.bind(this)}
          placeholder={this.props.placeholder}
          modules={this.modules}

        />
      </div>
    )
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */


/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */

/*
 * PropType validation
 */
