import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {IoPerson, IoCalendarClearOutline} from 'react-icons/io5'
import {Popover, OverlayTrigger} from 'react-bootstrap'

import '../App.css'
import React from 'react';
import Profile from './Profile';

const cookie = new Cookies();

// regular expression for youtube channel validation


const Post = ({post_info, user_info}) => {


    return (
        <div className="mt-3">
            <div className="stats-div sub p-3">
                <div className="d-flex row align-items-center">
                    <div className="col-6">
                        <h4>{post_info.title}</h4>
                    </div>
                    <div className="d-flex col-6 justify-content-end align-items-center">
                    <img src={user_info.pfp} className="img-fluid d-inline pfp-small" alt="user image"/>
                        <div class="d-flex flex-column bd-highlight p-2">
                            <div class="bd-highlight"><strong>{user_info.first_name} {user_info.last_name}</strong></div>
                            <div class="bd-highlight">@{user_info.username}</div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="p-3 profile-header ">
                <div className="muted-regular">{post_info.date_posted}</div>
                <div className="hr pb-3 muted-regular">{post_info.views} Views</div>
                <div className="mt-3" dangerouslySetInnerHTML={{__html: post_info.body_html}} ></div>
            </div>
            <div className="p-3 stats-div-2 sub">
                
            </div>
            
        </div>
    )
}


export default Post;