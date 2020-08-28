import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
/* 
    Picture Upload
*/
export default class PicturesWall extends React.Component {

static propTypes = {
  imgs: PropTypes.array
}
state = {
    //Identifies whether to display a large image preview Modal
      previewVisible: false, 
      previewImage: '', //Picture Address
      fileList:[]//All picture uploaded Array
}
  constructor (props) {
    super(props)

    let fileList = []
    const {imgs} = this.props
    // console.log(imgs.length)
    // console.log(imgs)
    if (imgs && imgs.length > 1) {
      fileList = imgs.map((img,index) => ({
//Each file has its own unique ID to prevent conflicts with internal IDs
        uid: -index, 
        name: img, //Picture name
        status: 'done', //Status ->,uploading,remove
        url: BASE_IMG_URL + img
      }))

    }
    //Initialize status
    this.state = {
      previewVisible: false, //
      previewImage: '', //
      fileList //
    }
  }

  /* 
    Get an array of all uploaded file names
  */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  //Hide Modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    //Display the large image corresponding to the specified file
    console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /* 
    file: The currently operated image file (upload/delete)
    fileList: array of all uploaded pictures
  */
  handleChange = async ({ file, fileList }) => {
    console.log('handleChange()', file, fileList)
//Once the upload is successful, modify the information of the currently uploaded file (name, url)
    if (file.status === 'done') {
      const result = file.response // {status: 0 data: {name: 'xxx', url: 'Picture Address'}}
      if (result.status === 0) {
        message.success('Upload Picture Successfully')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('Upload Picture Unsuccessfully')
      }
    } else if (file.status==="removed") { //Delete Picture
      const result = await reqDeleteImg(file.name)
      if (result.status===0) {
        message.success("Delete Picture Successfully")
      } else {
        message.error("Delete Picture Unsuccessfully")
      }
    }
      //Update the status of fileList during operation (upload/delete)
      this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/api/manage/img/upload"     /* The interface address of the uploaded picture */
          accept="image/*"    /* Only accept image format */
          name="image" /* Request parameter name */
          listType="picture-card"
          fileList={fileList}   /* List of all uploaded pictures */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

/* you can make up upload button and sample style by using stylesheets */
// .ant-upload-select-picture-card i {
//   font-size: 32px;
//   color: #999;
// }

// .ant-upload-select-picture-card .ant-upload-text {
//   margin-top: 8px;
//   color: #666;
// }