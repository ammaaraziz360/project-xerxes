import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {IoPerson, IoCalendarClearOutline} from 'react-icons/io5'
import {Popover, OverlayTrigger, Button} from 'react-bootstrap'
import {FiThumbsUp, FiThumbsDown, FiShare2, FiMoreHorizontal} from 'react-icons/fi'
import {GoCommentDiscussion} from 'react-icons/go'
import React from 'react';

import LikeDislikeButton from '../LikeDislikeButton';

const Comment = ({post_info, user_info, loggedin_user_info}) => {

    const [comments, setComments] = useState(post_info.comments);

    const FetchComments = () => {
        console.log("Fetching comments for post_id: " + post_info.post_id);
    }


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
                    </div>
                </div>
                {comments.map((comment) => {
                    return <Comment post_info={comment} user_info={comment.poster_info} loggedin_user_info={loggedin_user_info} key={comment.post_id}/>
                })}
            </div>
        </div>
    )
}

export default Comment;

