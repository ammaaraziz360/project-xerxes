import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {IoPerson, IoCalendarClearOutline} from 'react-icons/io5'
import {Popover, OverlayTrigger, Button} from 'react-bootstrap'
import {FiThumbsUp, FiThumbsDown, FiShare2, FiMoreHorizontal} from 'react-icons/fi'
import {BsChevronUp} from 'react-icons/bs'
import { GoReply } from 'react-icons/go';
import {GoCommentDiscussion} from 'react-icons/go'
import React from 'react';
import ReplyBox from './ReplyBox';


import LikeDislikeButton from '../LikeDislikeButton';
import LoadingSpinner from './LoadingSpinner';

const Comment = ({post_info, user_info, loggedin_user_info}) => {
    const cookie = new Cookies();
    const [comments, setComments] = useState(post_info.comments);

    const[fetching, setFetching] = useState(false);

    const [IsReplying, setIsReplying] = useState(false);
    const FetchComments = () => {
        setFetching(true);
        fetch(`http://127.0.0.1:5000/api/posts/${post_info.post_id}/comments`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token'),
                'user_id': cookie.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookie.get('SID')
            }
        })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } 
        }).then(data => {
            setComments(data);
        })
        .catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        setFetching(false);
    },[comments]);


    return (
        <div className="comment mt-4 ">
            <div className="row">
                <div className="col-12">
                    <img src={user_info.pfp} className="pfp-small-2" alt="user image"/>
                    {user_info.username}
                </div>
            </div>
            <div className="border-left ms-3">
                <div className="row ms-1">
                    <div className="col-12">
                        {post_info.body_raw}
                    </div>
                </div>
                <div className="row ms-1 mt-2">
                    <div className="d-flex col-6">
                        <LikeDislikeButton post_info={post_info} loggedin_user_info={loggedin_user_info}/>
                        <Button variant="primary" onClick={() => FetchComments()}>
                            <GoCommentDiscussion/>
                            <span className="p-1">{post_info.number_of_comments}</span>
                        </Button>
                        <Button variant="primary" onClick={() => setIsReplying(!IsReplying) }>
                            <GoReply/>
                        </Button>
                        {comments.length > 0 ? <Button variant="primary" onClick={() => setComments([])}><BsChevronUp/></Button>: null}
                    </div>
                </div>
                
                { IsReplying ? <div className="p-3"><ReplyBox loggedin_user_info={loggedin_user_info} post_id={post_info.post_id}/></div> : null }
                
                {fetching ? <LoadingSpinner/> :
                    comments.map((comment) => {
                    return <Comment post_info={comment} user_info={comment.poster_info} loggedin_user_info={loggedin_user_info} key={comment.post_id}/>
                })}
            </div>
        </div>
    )
}

export default Comment;

