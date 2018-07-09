import React, { PureComponent } from 'react';

import ReactQuill from 'react-quill';
import theme from 'react-quill/dist/quill.snow.css';
import config from '../../config';
import { Modal, Button, message, Icon, Upload } from 'antd';
const uploadUrl = config.uploadUrl;
/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || 'image/png';
  if (!isJPG) {
    message.error('Y请上传jpg或者png格式图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('请上传小于1MB的图片!');
  }
  return isJPG && isLt2M;
}

export default class RichEditor extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || {};
    var x = value.editorHtml;
    
    this.id = 'toolbar' + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1);
    this.modules = {
      toolbar: {
        container: '#' + this.id,
        handlers: {},
      },
    };
   
    this.state = {
      showGongshi:false,
      editorHtml: x?x:(this.props.defaultValue == null ? '' : this.props.defaultValue)
    };
    window.latex=(gs)=>{
     
      const quill = this.refs.quill.getEditor()
      
      const cursorPosition = quill.selection.savedRange.index
    
      var editorHtml = this.state.editorHtml
      var x = '<img src=\'' + config.httpServer +'/latex?code='+encodeURI(gs)+'\'/>'
      editorHtml = editorHtml.substring(3,3+ cursorPosition) + x + editorHtml.substring(3+cursorPosition, editorHtml.length)
      this.setState({ editorHtml,showGongshi:false })
      quill.setSelection(cursorPosition + 1)
    
  
    }
  }
  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  showGongshi=()=>{
    this.setState({showGongshi:true})
  }
  cancelGongshi=()=>{
    this.setState({showGongshi:false})
  }
  handleChange(content) {
    this.setState({ editorHtml: content });
    if (this.props.onChangeValue) {
      this.props.onChangeValue(content.replace(config.httpServer, ""));
    }
    this.triggerChange({ editorHtml: content.replace(config.httpServer, "") });
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }
  render() {
    const props = {
      name: 'file',
      action: uploadUrl,
      showUploadList: false,
      beforeUpload: beforeUpload,
      headers: {
        authorization: 'authorization-text',
      },
      onChange: (info) => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);

          var x = '<img src=\'' + config.httpServer + info.file.response + '\'/>'

          const quill = this.refs.quill.getEditor()
          const cursorPosition = quill.selection.savedRange.index
          var editorHtml = this.state.editorHtml
          editorHtml = editorHtml.substring(3, 3+cursorPosition) + x + editorHtml.substring(3+cursorPosition, editorHtml.length)


          this.setState({ editorHtml })
          quill.setSelection(cursorPosition + 1)

        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div className={this.props.className} style={this.props.style}>
        <div id={this.id} style={{ display: "flex" }}>
          <div> <select className="ql-header" defaultValue={''} onChange={e => e.persist()}>
            <option value="1" />
            <option value="2" />
            <option selected />
          </select></div>

          <div> <button title="粗体" className="ql-bold" /></div>

          <div> <button title="斜体" className="ql-italic" /></div>
          <div> <button title="下划线" className="ql-underline" /></div>
          <div> <button title="代码" className="ql-code" /></div>
          
          <Upload style={{ cursor: "pointer" }}{...props}>
            <Icon type="picture" />
          </Upload>

          <div><select className="ql-color">
            <option value="red" />
            <option value="green" />
            <option value="blue" />
            <option value="orange" />
            <option value="violet" />
            <option value="#d0d1d2" />
            <option selected />
          </select></div>
          <div><button title="公式" onClick={this.showGongshi}>
            <Icon type="api" />
          </button></div>
        </div>

        <ReactQuill ref="quill"
          style={{ height: '200px' }}
          value={this.state.editorHtml}
          onChange={this.handleChange.bind(this)}
          placeholder={this.props.placeholder}
          modules={this.modules}
        />

        
        <Modal
          title={"历史版本列表"}
          visible={this.state.showGongshi}
          footer={null}
          width={1024}
          onCancel={this.cancelGongshi}
          maskClosable={false}
          okText="关闭"
        >
          <iframe src="/gongshi/gongshi.html"  style={{width:'100%',minHeight:'400px',border:'solid 1px #0062d5'}} ></iframe>
        </Modal>
      </div>
    );
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
