import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(), //Create an empty edited object
    }

    //ref:https://jpuri.github.io/react-draft-wysiwyg/#/docs
    constructor(props) {
        super(props);
        const html = this.props.detail
        if (html) { //If there is a value, create a corresponding edit object according to the html format
            const contentBlock = htmlToDraft(html);
            if (contentBlock) { //block????????
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            } else {
                this.state = {
                    editorState: EditorState.createEmpty(), //Create an empty edited object
                }
            }
        }
    }

    /* 
    Real-time callback during the incoming process
    */
    //onEditorStateChange: Function = (editorState) => {
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        //Return text in html format
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    uploadImageCallBack= (file) => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/manage/img/upload');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              const url = response.data.url //get url
              resolve({data: {link: url}})
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{ border: '1px solid black', minHeight: 300, paddingLeft: 7 }}
                    //   wrapperClassName="demo-wrapper"
                    //   editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                      }}
                />
                {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
            </div>
        );
    }
}