import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {IoPerson, IoCalendarClearOutline} from 'react-icons/io5'
import {Popover, OverlayTrigger, Button} from 'react-bootstrap'
import {FiThumbsUp, FiThumbsDown, FiShare2, FiMoreHorizontal} from 'react-icons/fi'
import {GoCommentDiscussion} from 'react-icons/go'
import '../App.css'
import React from 'react';
import Profile from './Profile';

const cookie = new Cookies();

// regular expression for youtube channel validation


const Post = ({post_info, user_info, loggedin_user_info}) => {


    const dislike = () => {
        post_info.disliked = 'false'
    }

    return (
        <div className="mt-3">
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
                                <img src={loggedin_user_info.pfp} className="pfp-small-2" alt="user image"/>
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
                            { post_info.liked ?
                                <Button variant="primary">
                                    <FiThumbsUp/>
                                    <span className="p-1">{post_info.likes}</span>
                                </Button>
                                : <Button variant="primary" className="bg-light text-dark">
                                    <FiThumbsUp/>
                                    <span className="p-1">{post_info.likes}</span>
                                </Button>
                            }
                            { post_info.dislikes ?
                                <Button variant="primary" className="bg-light text-dark" onClick={dislike()}>
                                    <FiThumbsDown/>
                                    <span className="p-1">{post_info.dislikes}</span>
                                </Button>
                                : <Button variant="primary">
                                    <FiThumbsDown/>
                                    <span className="p-1">{post_info.dislikes}</span>
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
                            { post_info.liked ?
                                <Button variant="primary">
                                    <FiThumbsUp/>
                                    <span className="p-1">{post_info.likes}</span>
                                </Button>
                                : <Button variant="primary" className="bg-light text-dark">
                                    <FiThumbsUp/>
                                    <span className="p-1">{post_info.likes}</span>
                                </Button>
                            }
                            { post_info.dislikes ?
                                <Button variant="primary" className="bg-light text-dark">
                                    <FiThumbsDown/>
                                    <span className="p-1">{post_info.dislikes}</span>
                                </Button>
                                : <Button variant="primary">
                                    <FiThumbsDown/>
                                    <span className="p-1">{post_info.dislikes}</span>
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