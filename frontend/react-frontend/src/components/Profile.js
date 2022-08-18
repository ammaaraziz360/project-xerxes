import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {BiEdit} from 'react-icons/bi'
import EditSocialsModal from './EditSocialsModal';
import EditBioModal from './EditBioModal';
import {Button} from 'react-bootstrap';
import FollowButton from './FollowButton';
import {FaTwitter, FaFacebookF,FaYoutube, FaInstagram} from 'react-icons/fa';
import {BsLink45Deg} from 'react-icons/bs';

import PostEditor from './PostEditor';
import Post from './Post';
import UserInfoPanel from './UserInfoPanel';

const Profile = ({ userProfile, loggedinUser}) => {

    const posts = userProfile.posts.filter(post => post.reply_post_id === null);

    return(
        <div>
            <div className='row flex-xl-row flex-column-reverse'>
                <div className='col-xl-8 col-lg-12'>
                    {posts.map((post, index) => {
                        
                        return <Post post_info={post} loggedin_user_info={loggedinUser} key={index}/>
                    })}
                </div>
                <div className='col-xl-4 col-lg-12'>
                    <UserInfoPanel user_info={userProfile}/>
                </div>
            </div>
            {/* <div className="p-4">
                <div className="row">
                    <div className="d-flex col-3 align-items-center p-4 pfp-div justify-content-center"> 
                        <img src={userProfile.pfp_url} alt="avatar" className="img-fluid pfp-large" />
                    </div>
                    <div className="d-flex col-9 profile-info justify-content-center align-items-center sub">
                        <div className="d-flex flex-column p-3">
                            <div><h3>{userProfile.first_name} {userProfile.last_name}</h3></div>
                            <div className="muted"><h5>@{userProfile.username}</h5></div>
                            
                            {!userProfile.own_account ? 
                                <div className="d-flex justify-content-center">
                                <FollowButton userProfile={userProfile} className="mt-3"/>
                                </div>
                            :null}
                            
                        </div>
                        
                    </div>
                </div>
                <div className="row mt-2 mb-0 stats-div sub align-items-center">
                    <div className="col-3">
                        <div className="row">
                            <div className="d-flex col-6 align-items-center">
                                <strong>Socials</strong>
                            </div>
                        </div>
                    </div> 
                    <div className="col-9 p-2">
                        <div className="row">
                            <div className="d-flex col-6 align-items-center">
                                    <strong>Bio</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-0">
                    <div className="d-flex col-3 p-2 align-items-center">
                        <div className="d-flex flex-column bd-highlight mb-3 socials">
                            {userProfile.twitter_url !== null ?  <a href={userProfile.twitter_url} target="_blank"><FaTwitter/></a> : null}
                            {userProfile.facebook_url !== null ? <a href={userProfile.facebook_url} target="_blank"><FaFacebookF/></a> : null} 
                            {userProfile.youtube_url !== null ? <a href={userProfile.youtube_url} target="_blank"><FaYoutube/></a> : null} 
                            {userProfile.instagram_url !== null ? <a href={userProfile.instagram_url} target="_blank"><FaInstagram/></a> : null} 
                            {userProfile.website_url !== null ? <a href={userProfile.website_url } target="_blank"><BsLink45Deg/></a> : null}   
                        </div>
                    </div>
                    <div className="d-flex col-9 p-2 align-items-center">
                        {userProfile.bio == null ? <p>No bio</p> : <p>{userProfile.bio}</p>}
                    </div>
                </div>
                <div className="row sub stats-div p-1 mt-2">
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        <strong>Followers</strong>
                    </div>
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        <strong>Following</strong>
                    </div>
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        <strong>Date Joined</strong>
                    </div>
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        <strong>Date last seen</strong>
                    </div>
                </div>
                <div className="row p-1">
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        {userProfile.followers}
                    </div>
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        {userProfile.following}
                    </div>
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        {(userProfile.date_created).split(" ")[2] + " " + (userProfile.date_created).split(" ")[1] + ", " + (userProfile.date_created).split(" ")[3]}
                    </div>
                    <div className="d-flex col-3 justify-content-center align-items-center">
                        {(userProfile.date_last_login).split(" ")[2] + " " + (userProfile.date_last_login).split(" ")[1] + ", " + (userProfile.date_last_login).split(" ")[3]}
                    </div>
                </div>
            </div>
            <div>
                <div className="p-4">
                    {userProfile.posts.length > 0 ?
                        userProfile.posts.map(post => {
                            if (post.reply_post_id == null) {
                                return <Post post_info={post} loggedin_user_info={loggedinUser} key={post.post_id}/>
                            }
                            return null;
                        })
                        : <h5 className="text-center">No posts yet</h5>
                    }
                </div>
            </div> */}
        </div>

    )
}

export default Profile;