import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';

import { InputGroup, FormControl, Button } from 'react-bootstrap';
const PostEditor = () => {

    const [post, setPost] = useState("We [want] | (to bold) | (this)")
    const [postHTML, setPostHTML] = useState("")

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
                            />
                    <FormControl as="textarea" 
                                aria-label="bio text area" 
                                placeholder="Enter Post"
                                onChange={(e) => setPost(e.target.value)}
                                />
                    </div>
                    <div className="d-flex mt-3 justify-content-end">
                        <Button variant="primary" onClick={GeneratePreview}>
                            Preview
                        </Button>
                        <Button variant="primary" onClick={GeneratePreview}>
                            Post
                        </Button>
                    </div>
                    <h5 className="hr pb-3">Preview</h5>
            </div>
            <div id="preview">

            </div>
        </div>
    );
}


export default PostEditor;