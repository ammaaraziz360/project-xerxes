import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, Redirect} from 'react-router';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie'
import {IoPerson, IoCalendarClearOutline} from 'react-icons/io5'
import {Popover, OverlayTrigger, Button} from 'react-bootstrap'
import {FiThumbsUp, FiThumbsDown, FiShare2, FiMoreHorizontal} from 'react-icons/fi'
import {GoCommentDiscussion} from 'react-icons/go'
import '../App.css'
import React from 'react';
import Profile from './Profile';
import ReplyBox from './ReplyBox';

import LikeDislikeButton from './LikeDislikeButton';

import { LoggedInContext } from './LoggedInContext';
import Comment from './Comment';
const cookie = new Cookies();


// regular expression for youtube channel validation


const Post = ({post_info, loggedin_user_info}) => {

    const logged_in_state = useContext(LoggedInContext)
    
    const history = useHistory();

    const view_post = () => {
        history.replace(`/post/${post_info.post_id}`);
        history.go(0)
    }

    return (
        <div className="mt-2">
            <div className="stats-div sub p-3">
                <div className="d-flex row align-items-center">
                    <div className="col-6">
                        <h4>{post_info.title}</h4>
                    </div>
                    <div className="d-flex col-6 justify-content-end align-items-center">
                        <Link to={`/user/${post_info.username}`}>
                            <img src={post_info.pfp_url} className="img-fluid d-inline pfp-small" alt="user image"/>
                        </Link>
                        <span className="d-flex flex-column bd-highlight p-2">
                            <div className="bd-highlight"><strong>{post_info.first_name} {post_info.last_name}</strong></div>
                            <div className="bd-highlight">@{post_info.username}</div>
                        </span>
                        
                    </div>
                    
                </div>
                
            </div>
            <div className="p-3 profile-header ">
                <div className="muted-regular">{new Date(post_info.date_posted).toLocaleString()}</div>
                <div className="mt-3">{post_info.body}</div>
            </div>
            <div className="stats-div-2 sub">
                <div className="row p-2 align-items-center">
                    <div className="col-lg-6 col-xs-12">
                        <ReplyBox loggedin_user_info={loggedin_user_info} post_info={post_info}/>
                    </div>
                    <div className="col-3 col-xs-0 d-lg-flex d-none">
                        <LikeDislikeButton post_info={post_info} loggedin_user_info={loggedin_user_info}/>
                    </div>
                    <div className="d-flex col-3 justify-content-end d-lg-flex d-none">
                        <Button variant="primary" onClick={() => view_post()}>
                            <GoCommentDiscussion/>
                            <span className="p-1">{post_info.num_of_comments}</span>
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
                            <LikeDislikeButton post_info={post_info}/>
                    </div>

                    <div className="d-inline-flex col-6 justify-content-end">
                        <Button variant="primary" onClick={() => view_post()}>
                            <GoCommentDiscussion/>
                            <span className="p-1">{post_info.num_of_comments}</span>
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
            {
                'comments' in post_info ? 
                    post_info.comments.map((post) => {
                        return <Comment post_info={post} loggedin_user_info={loggedin_user_info} key={post.post_id}/>
                    })  
                : null
                
            }
            
        </div>
    )
}


export default Post;