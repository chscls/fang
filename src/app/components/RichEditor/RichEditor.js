import React, { PureComponent } from 'react';

import ReactQuill from 'react-quill';
import theme from 'react-quill/dist/quill.snow.css';
import config from '../../config';
import { Modal, Button, message, Icon, Upload } from 'antd';
const uploadUrl = config.httpServer + '/services/PublicSvc/upload';
/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg'||'image/png';
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

    this.id = 'toolbar' + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1);
    this.modules = {
      toolbar: {
        container: '#' + this.id,
        handlers: {},
      },
    };

    this.state = {
      editorHtml: this.props.defaultValue == null ? '' : this.props.defaultValue.replace("<img src=\"","<img src=\""+config.httpServer),
    };
  }
  handleChange(content) {
    this.setState({ editorHtml: content });
    if (this.props.onChangeValue) {
      this.props.onChangeValue(content.replace(config.httpServer,""));
    }
  }

  render() {
    const props = {
      name: 'file',
      action: uploadUrl,
      showUploadList:false,
      beforeUpload:beforeUpload,
      headers: {
        authorization: 'authorization-text',
      },
      onChange:(info)=> {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
    
          var x =  '<img src=\''+config.httpServer+info.file.response+'\'/>'
            this.setState({ editorHtml: this.state.editorHtml+x})
           
          
          
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
          <Upload style={{ cursor:"pointer" }}{...props}>
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
          <div><button title="公式">
            <Icon type="api" />
          </button></div>
        </div>

        <ReactQuill
          style={{ height: '200px' }}
          value={this.state.editorHtml}
          onChange={this.handleChange.bind(this)}
          placeholder={this.props.placeholder}
          modules={this.modules}
        />
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
