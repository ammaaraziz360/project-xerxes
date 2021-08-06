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
            if(post[i] == "("){
                generatedHTML += "<strong>"
            }else if(post[i] == ")"){
                generatedHTML += "</strong>"
            }else if(post[i] == "["){
                generatedHTML += "<em>"
            }else if(post[i] == "]"){
                generatedHTML += "</em>"
            }else if(post[i] == '|'){
                generatedHTML += "<br>"
            }else if (post[i] == '/'){
                if (i+1 <= post.length){
                    generatedHTML += post[i+1]
                    i++;
                }
            }
            else{
                generatedHTML += post[i]
            }
        }
        generatedHTML += "</div>"

        document.getElementById("preview").innerHTML = generatedHTML
        setPostHTML(generatedHTML)
        console.log(generatedHTML)
    }

    return (
        <div>
            <div className="text-editor">
                <InputGroup>
                    <FormControl as="textarea" 
                                aria-label="bio text area" 
                                placeholder="Enter Post"
                                onChange={(e) => setPost(e.target.value)}
                                />
                </InputGroup>
                <Button variant="primary" onClick={GeneratePreview}>
                    Preview
                </Button>
            </div>
            <div id="preview">

            </div>
        </div>
    );
}

export default PostEditor;