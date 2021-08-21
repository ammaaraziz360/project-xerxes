import { useEffect, useState, useReducer, useContext } from 'react';
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


    const like_dislike_controller = (liker) => {
        if(logged_in_state.isLoggedIn == false){
            console.log("You are not logged in")
            return;
        }

        if (liker === 'dislike' && Disliked === 'true' && Liked === 'false') {
            setDisliked('false');
            setDislikes(dislikes - 1);
        } else if (liker ==='dislike' && Disliked === 'false' && Liked === 'false') {
            setDisliked('true');
            setDislikes(dislikes + 1);
        } else if (liker ==='dislike' && Disliked === 'false' && Liked === 'true') {
            setDisliked('true');
            setLiked('false');
            setDislikes(dislikes + 1);
            setLikes(likes - 1);
        } else if (liker ==='like' && Liked === 'true' && Disliked === 'false') {
            setLiked('false');
            setLikes(likes - 1);
        } else if (liker ==='like' && Liked === 'false' && Disliked === 'false') {
            setLiked('true');
            setLikes(likes + 1);
        } else if (liker ==='like' && Liked === 'false' && Disliked === 'true') {
            setLiked('true');
            setDisliked('false');
            setLikes(likes + 1);
            setDislikes(dislikes - 1);
        }
    }

    useEffect(() => {
        var like_dislike_payload = {liked: Liked, disliked: Disliked};

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
                console.log("You are not loggedin");
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, [Liked, Disliked])

    return (
        <div className="d-inline-flex">
            { Liked === 'true' ?
                <Button variant="primary" className="bg-light text-dark " onClick={() => like_dislike_controller('like')}>
                    <FiThumbsUp/>
                    <span className="p-1">{likes}</span>
                </Button>
                : <Button variant="primary" onClick={() => like_dislike_controller('like')}>
                    <FiThumbsUp/>
                    <span className="p-1">{likes}</span>
                </Button>
            }
            { Disliked === 'true' ?
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