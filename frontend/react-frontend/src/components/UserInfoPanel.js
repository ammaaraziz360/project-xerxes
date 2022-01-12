import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { LoggedInContext } from './LoggedInContext';
import LoadingSpinner from './LoadingSpinner';
import FollowButton from './FollowButton';
import { BsCalendar } from 'react-icons/bs';
import { FaBirthdayCake } from 'react-icons/fa';
import {FaTwitter, FaFacebookF,FaYoutube, FaInstagram} from 'react-icons/fa';
import {BsLink45Deg} from 'react-icons/bs';


const UserInfoPanel = ({user_info}) => {
    const history = useHistory();
    const logged_in_state = useContext(LoggedInContext) 

    return(
        <div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 align-content-center'>
                    <div className='col-2'>
                        <img  src={user_info.pfp_url} alt="avatar" className="img-fluid d-inline pfp-small" />
                    </div>
                    <div className='col-10'>
                        <h2 className='pb-2'>{user_info.first_name} {user_info.last_name}</h2>
                        <h5 className='muted'>@{user_info.username}</h5>
                        <div>
                            <span className='muted d-flex align-items-center'><FaBirthdayCake />&nbsp;Joined {(user_info.date_created).split(" ")[2] + " " + (user_info.date_created).split(" ")[1] + ", " + (user_info.date_created).split(" ")[3]}</span>
                            <span className='muted d-flex align-items-center'><BsCalendar />&nbsp;Last Seen {(user_info.date_last_login).split(" ")[2] + " " + (user_info.date_last_login).split(" ")[1] + ", " + (user_info.date_last_login).split(" ")[3]}</span>
                        </div>
                        <div className='mb-2 mt-2'>
                            <span className='clickable' onClick={()=>{history.push(`/user/${user_info.username}/followers`); history.go(0)}}>{user_info.followers}</span> 
                            <span className='muted'> Followers </span>
                            <span className='clickable' onClick={()=>{history.push(`/user/${user_info.username}/following`); history.go(0)}}>{user_info.following} </span>
                            <span className='muted'>Following</span>
                        </div>
                        <div>
                            {!user_info.own_account ? 
                                    <FollowButton userProfile={user_info} className="mt-3"/>
                                :null}
                        </div>
                    </div>
                </div>
            </div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 justify-content-end'>
                    <div className='col-12'>
                        <h4 className='p-2 muted'>Bio</h4>
                        <div className='ms-2'>
                            {user_info.bio == null ? <p className='muted'>No bio</p> : <p className=''>{user_info.bio}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 justify-content-end'>
                    <div className='col-12'>
                        <h4 className='p-2 muted'>Socials</h4>
                        <div className="d-flex flex-column bd-highlight ms-2 socials">
                            {user_info.twitter_url !== null ?  <a href={user_info.twitter_url} target="_blank" rel="noreferrer"><FaTwitter/></a> : null}
                            {user_info.facebook_url !== null ? <a href={user_info.facebook_url} target="_blank" rel="noreferrer"><FaFacebookF/></a> : null} 
                            {user_info.youtube_url !== null ? <a href={user_info.youtube_url} target="_blank" rel="noreferrer"><FaYoutube/></a> : null} 
                            {user_info.instagram_url !== null ? <a href={user_info.instagram_url} target="_blank" rel="noreferrer"><FaInstagram/></a> : null} 
                            {user_info.website_url !== null ? <a href={user_info.website_url } target="_blank" rel="noreferrer"><BsLink45Deg/></a> : null}   
                        </div>
                    </div>
                </div>
            </div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 justify-content-end'>
                    <div className='col-12'>
                        <h4 className='p-2 muted'>Communities</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfoPanel;