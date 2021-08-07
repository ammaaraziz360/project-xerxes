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
                        switch(post[i]){
                            case '1':
                                generatedHTML += "<h1>"
                                i++;
                                while(post[i] != ">" && i <= post.length){
                                    generatedHTML += post[i]
                                    i++;
                                }
                                generatedHTML += "</h1>"
                                break;
                            case '2':
                                generatedHTML += "<h2>"
                                i++;
                                while(post[i] != ">" && i <= post.length){
                                    generatedHTML += post[i]
                                    i++;
                                }
                                generatedHTML += "</h2>"
                                break;
                            case '3':
                                generatedHTML += "<h3>"
                                i++;
                                while(post[i] != ">" && i <= post.length){
                                    generatedHTML += post[i]
                                    i++;
                                }
                                generatedHTML += "</h3>"
                                break;
                            case '4':
                                generatedHTML += "<h4>"
                                i++;
                                while(post[i] != ">" && i <= post.length){
                                    generatedHTML += post[i]
                                    i++;
                                }
                                generatedHTML += "</h4>"
                                break;
                            case '5':
                                generatedHTML += "<h5>"
                                i++;
                                while(post[i] != ">" && i <= post.length){
                                    generatedHTML += post[i]
                                    i++;
                                }
                                generatedHTML += "</h5>"
                                break;
                            case 'c':
                                generatedHTML += "<code>"
                                i++;
                                while(post[i] != ">" && i <= post.length){
                                    generatedHTML += post[i]
                                    i++;
                                }
                                generatedHTML += "</code>"
                                break;
                            case 's':
                                generatedHTML += "<s>"
                                i++;
                                while(post[i] != ">" && i <= post.length){
                                    generatedHTML += post[i]
                                    i++;
                                }
                                generatedHTML += "</s>"
                                break;
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