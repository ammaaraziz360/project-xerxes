import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import Alerts from './ErrorAlert';

import { InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
const PostEditor = () => {
    const cookie = new Cookies();
    const history = useHistory();
    const [postTitle, setPostTitle] = useState('');

    const [post, setPost] = useState("")
    const [postHTML, setPostHTML] = useState("")

    const [AlertToggle, setAlertToggle] = useState(false)
    const [AlertMessage, setAlertMessage] = useState({message: "", style: "success"})


    const GeneratePreview = () => {
        var generatedHTML = "<div>"
        for(var i = 0; i < post.length; i++){
            switch(post[i]){
                case "(":
                    generatedHTML += "<strong>"
                    i++;
                    while(post[i] != ")" && i <= post.length){
                        generatedHTML += post[i]
                        i++;
                    }
                    generatedHTML += "</strong>"
                    break;
                case "|":
                    generatedHTML += "<br>"
                    break;
                case "[":
                    generatedHTML += "<em>"
                    i++;
                    while(post[i] != "]" && i <= post.length){
                        generatedHTML += post[i]
                        i++;
                    }
                    generatedHTML += "</em>"
                    break;
                case "]":
                    generatedHTML += "</em>"
                    break;
                case "/":
                    if (i+1 <= post.length){
                        generatedHTML += post[i+1]
                        i++;
                    }
                    break;
                case "<":
                    if (i+1 <= post.length){
                        i++;
                        if (post[i] == "1" || post[i] == "2" || post[i] == "3" || post[i] == "4" || post[i] == "5" ){
                            var header_num = post[i]
                            generatedHTML += `<h${header_num}>`
                            console.log(post[i])
                            i++;
                            while(post[i] != ">" && i <= post.length){
                                generatedHTML += post[i]
                                i++;
                            }
                            generatedHTML += `</h${header_num}>`
                        }else if(post[i] == "s"){
                            generatedHTML += "<s>"
                            i++;
                            while(post[i] != ">" && i <= post.length){
                                generatedHTML += post[i]
                                i++;
                            }
                            generatedHTML += "</s>"
                        }else if (post[i] == "c"){
                            generatedHTML += "<code>"
                            i++;
                            while(post[i] != ">" && i <= post.length){
                                generatedHTML += post[i]
                                i++;
                            }
                            generatedHTML += "</code>"
                        }
                    }
                    break;
                default:
                    generatedHTML += post[i];
            }      
        }
            
        
        generatedHTML += "</div>"

        document.getElementById("preview").innerHTML = generatedHTML
        setPostHTML(generatedHTML)
        console.log(generatedHTML)
    }

    const SubmitPost = () => {
        GeneratePreview()

        if (postTitle.trim() == ""){
            setAlertMessage({message: 'Blog post must have a title, try again', style: 'danger'})
            setAlertToggle(true)
            return
        }else{
            setAlertToggle(false)
        }

        if (post.trim() == ""){
            setAlertMessage({message: 'Blog post must have content, try again', style: 'danger'})
            setAlertToggle(true)
            return
        }else{
            setAlertToggle(false)
        }

        var post_data = {title: postTitle, 
                        body_raw: post, 
                        body_html: postHTML, 
                        reply_post_id: null}
        fetch('http://127.0.0.1:5000/api/posts', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token'),
                'user_id': cookie.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookie.get('SID')
            },
            body: JSON.stringify(post_data)
        })
        .then(res => {
            if (res.status === 200) {
                if(res.headers.get('X-JWT') != null) {
                    cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                }
                setAlertMessage({message: 'Blog successfully added', style: 'success'})
                setAlertToggle(true)
            } 
            else if (res.status === 401) {
                //history.push('/login')
                console.log('401')
            }
            else {
                setAlertMessage({message: 'Error: Blog not posted, try again', style: 'danger'})
                setAlertToggle(true)
            }
        })
        .catch(err => {
            setAlertMessage({message: 'Error: Blog not posted, try again', style: 'danger'})
            setAlertToggle(true)
        })
    }

    return (
        <div>
            <div className="text-editor post-elements">
                    <div >
                        <h5 className="hr pb-3">Create new blog post</h5>
                    </div>
                    
                    <div className="mt-3 hr pb-3">
                    <FormControl
                            placeholder="Title"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e) => setPostTitle(e.target.value)}
                            />
                    <FormControl as="textarea" 
                                aria-label="bio text area" 
                                placeholder="Enter Post"
                                onChange={(e) => setPost(e.target.value)}
                                />
                    </div>
                    <div className="d-flex mt-3 justify-content-end">
                        <Button onClick={GeneratePreview}>
                            Preview
                        </Button>
                        <Button onClick={SubmitPost}>
                            Post
                        </Button>
                    </div>
                    <div className="mt-3">
                        <Alerts AlertToggle={AlertToggle} AlertText={AlertMessage}/>
                    </div>
                    
                    <h5 className="hr pb-3">Preview</h5>
            </div>
            <div id="preview">

            </div>
        </div>
    );
}


export default PostEditor;