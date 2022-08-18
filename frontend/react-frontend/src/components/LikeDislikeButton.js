import { useEffect, useState, useReducer, useContext, useRef } from 'react';
import Cookies from 'universal-cookie'
import {FiThumbsUp, FiThumbsDown, FiShare2, FiMoreHorizontal} from 'react-icons/fi'
import {Button} from 'react-bootstrap'
import React from 'react';
import { LoggedInContext } from './LoggedInContext';


const LikeDislikeButton = ({post_info, loggedin_user_info}) => {
    const cookie = new Cookies();
    const [Liked, setLiked] = useState(post_info.liked);
    const [Disliked, setDisliked] = useState(post_info.disliked);

    const[likes, setLikes] = useState(post_info.likes);
    const[dislikes, setDislikes] = useState(post_info.dislikes);

    const logged_in_state = useContext(LoggedInContext)

    const didMount = useRef(false);


    const like_dislike_controller = (liker) => {
        if(logged_in_state.isLoggedIn == false){
            console.log("You are not logged in")
            return;
        }

        if (liker === 'dislike' && Disliked === 1 && Liked === 0) {
            setDisliked(0);
            setDislikes(dislikes - 1);
        } else if (liker ==='dislike' && Disliked === 0 && Liked === 0) {
            setDisliked(1);
            setDislikes(dislikes + 1);
        } else if (liker ==='dislike' && Disliked === 0 && Liked === 1) {
            setDisliked(1);
            setLiked(0);
            setDislikes(dislikes + 1);
            setLikes(likes - 1);
        } else if (liker ==='like' && Liked === 1 && Disliked === 0) {
            setLiked(0);
            setLikes(likes - 1);
        } else if (liker ==='like' && Liked === 0 && Disliked === 0) {
            setLiked(1);
            setLikes(likes + 1);
        } else if (liker ==='like' && Liked === 0 && Disliked === 1) {
            setLiked(1);
            setDisliked(0);
            setLikes(likes + 1);
            setDislikes(dislikes - 1);
        }
    }

    useEffect(() => {
        if(didMount.current) {
            if (logged_in_state.isLoggedIn) {
                var like_dislike_payload

                if(Liked == 0 && Disliked == 0){
                    like_dislike_payload = {"interaction_type": -1}
                } else if(Liked == 1 && Disliked == 0){
                    like_dislike_payload = {"interaction_type": 1}
                } else if(Liked == 0 && Disliked == 1){
                    like_dislike_payload = {"interaction_type": 2}
                }

                fetch(`http://127.0.0.1:5000/api/posts/${post_info.post_id}/like`, {
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
                    body: JSON.stringify(like_dislike_payload)
                })
                .then(res => {
                    if (res.status === 200) {
                        if(res.headers.get('X-JWT') != null) {
                            cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                        }
                    } 
                    else if (res.status === 401) {
                        // todo: modal to tell user to login
                        logged_in_state.setLoggedIn(false);
                        console.log("You are not logged in");
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
            else {
                console.log("You are not logged in")
            }
        }
        else{
            didMount.current = true;
        }
    }, [Liked, Disliked])

    return (
        <div className="d-inline-flex">
            { Liked === 1 ?
                <Button variant="primary" className="bg-light text-dark " onClick={() => like_dislike_controller('like')}>
                    <FiThumbsUp/>
                    <span className="p-1">{likes}</span>
                </Button>
                : <Button variant="primary" onClick={() => like_dislike_controller('like')}>
                    <FiThumbsUp/>
                    <span className="p-1">{likes}</span>
                </Button>
            }
            { Disliked === 1 ?
                <Button variant="primary" className="bg-light text-dark" onClick={() => like_dislike_controller('dislike')}>
                    <FiThumbsDown/>
                    <span className="p-1">{dislikes}</span>
                </Button>
                : <Button variant="primary" onClick={() => like_dislike_controller('dislike')}>
                    <FiThumbsDown/>
                    <span className="p-1">{dislikes}</span>
                </Button>
            }
        </div>   
    )
}

export default LikeDislikeButton;