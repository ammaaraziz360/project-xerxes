import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {IoPerson, IoCalendarClearOutline} from 'react-icons/io5'
import {Popover, OverlayTrigger, Button} from 'react-bootstrap'
import {FiThumbsUp, FiThumbsDown, FiShare2, FiMoreHorizontal} from 'react-icons/fi'
import {GoCommentDiscussion} from 'react-icons/go'
import '../App.css'
import React from 'react';
import Profile from './Profile';

import { LoggedInContext } from './LoggedInContext';

const cookie = new Cookies();

// regular expression for youtube channel validation


const Post = ({post_info, user_info, loggedin_user_info}) => {

    const logged_in_state = useContext(LoggedInContext)
    
    const history = useHistory();

    const [Liked, setLiked] = useState(post_info.liked);
    const [Disliked, setDisliked] = useState(post_info.disliked);

    const[likes, setLikes] = useState(post_info.likes);
    const[dislikes, setDislikes] = useState(post_info.dislikes);

    const like_dislike_controller = (liker) => {
        if(loggedin_user_info == null){
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
        <div className="mt-3" key={post_info.post_id}>
            <div className="stats-div sub p-3">
                <div className="d-flex row align-items-center">
                    <div className="col-6">
                    
                        <h4>{post_info.title}</h4>
                    </div>
                    <div className="d-flex col-6 justify-content-end align-items-center">
                    <img src={user_info.pfp} className="img-fluid d-inline pfp-small" alt="user image"/>
                        <div className="d-flex flex-column bd-highlight p-2">
                            <div className="bd-highlight"><strong>{user_info.first_name} {user_info.last_name}</strong></div>
                            <div className="bd-highlight">@{user_info.username}</div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="p-3 profile-header ">
                <div className="muted-regular">{post_info.date_posted}</div>
                <div className="hr pb-3 muted-regular">{post_info.views} Views</div>
                <div className="mt-3" dangerouslySetInnerHTML={{__html: post_info.body_html}} ></div>
            </div>
            <div className="stats-div-2 sub">
                <div className="row p-2 align-items-center">
                    <div className="col-lg-6 col-xs-12">
                        <div className="input-group">
                            <div className="input-group-prepend pr-2">
                                {loggedin_user_info !== null ? <img src={loggedin_user_info.pfp} className="pfp-small-2" alt="user image"/> 
                                : <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className="pfp-small-2" alt="user image"/>
                                }
                            </div>
                            <input className="form-control search-bar" type="text" placeholder="Add a comment"></input>
                            <div className="input-group-append">
                                <Button variant="primary" id="side-btn">
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 col-xs-0 d-lg-flex d-none">
                            { Liked === 'true' ?
                                <Button variant="primary" className="bg-light text-dark" onClick={() => like_dislike_controller('like')}>
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
                    <div className="d-flex col-3 justify-content-end d-lg-flex d-none">
                        <Button variant="primary">
                            <GoCommentDiscussion/>
                        </Button>
                        <Button variant="primary">
                            <FiShare2/>
                        </Button>
                        <Button variant="primary">
                            <FiMoreHorizontal/>
                        </Button>
                    </div>
            
                </div>
                <div className="row p-2 align-items-center d-lg-none">
                    <div className="col-6">
                            { Liked === 'true' ?
                                <Button variant="primary" className="bg-light text-dark" onClick={() => like_dislike_controller('like')}>
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

                    <div className="d-flex col-6 justify-content-end">
                        <Button variant="primary">
                            <GoCommentDiscussion/>
                        </Button>
                        <Button variant="primary">
                            <FiShare2/>
                        </Button>
                        <Button variant="primary">
                            <FiMoreHorizontal/>
                        </Button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}


export default Post;