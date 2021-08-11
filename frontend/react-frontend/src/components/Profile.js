import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {BiEdit} from 'react-icons/bi'
import EditSocialsModal from './EditSocialsModal';
import EditBioModal from './EditBioModal';
import {Button} from 'react-bootstrap';
import {FaTwitter, FaFacebookF,FaYoutube, FaInstagram} from 'react-icons/fa';
import {BsLink45Deg} from 'react-icons/bs';

import PostEditor from './PostEditor';
import Post from './Post';

const Profile = ({ userProfile, OwnAccount, refreshProfile, setRefreshProfile}) => {
    const [EditSocials, setEditSocials] = useState(false);
    const [EditBio, setEditBio] = useState(false);


    return(
        <div className="container">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-md-8 col-xs-12 profile-header p-4">
                    <div className="row">
                        <div className="d-flex col-3 align-items-center p-4 pfp-div justify-content-center"> 
                            <img src={userProfile.pfp} alt="avatar" className="img-fluid pfp-large" />
                        </div>
                        <div className="d-flex col-9 profile-info justify-content-center align-items-center sub">
                            <div className="d-flex flex-column">
                                <div><h3>{userProfile.first_name} {userProfile.last_name}</h3></div>
                                <div className="muted"><h5>@{userProfile.username}</h5></div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 mb-0 stats-div sub align-items-center">
                        <div className="col-3">
                            <div className="row">
                                <div className="d-flex col-6 align-items-center">
                                    <strong>Socials</strong>
                                </div>
                                {OwnAccount 
                                        ? <div className="d-flex col-6 justify-content-end align-items-center edit_btn">
                                                <a onClick={() => setEditSocials(!EditSocials)}>
                                                    <BiEdit/>
                                                </a>
                                            </div>
                                        : null}
                            </div>
                        </div> 
                        <div className="col-9 p-2">
                            <div className="row">
                                <div className="d-flex col-6 align-items-center">
                                        <strong>Bio</strong>
                                </div>
                                {OwnAccount 
                                        ? <div className="d-flex col-6 justify-content-end align-items-center edit_btn">
                                                <a onClick={() => setEditBio(!EditBio)}>
                                                    <BiEdit/>
                                                </a>
                                            </div>
                                        : null}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-0">
                        <div className="d-flex col-3 p-2 align-items-center">
                            <div className="d-flex flex-column bd-highlight mb-3 socials">
                                {userProfile.twitter_url !== "no_link" ?  <a href={userProfile.twitter_url} target="_blank"><FaTwitter/></a> : null}
                                {userProfile.facebook_url !== "no_link" ? <a href={userProfile.facebook_url} target="_blank"><FaFacebookF/></a> : null} 
                                {userProfile.youtube_url !== "no_link" ? <a href={userProfile.youtube_url} target="_blank"><FaYoutube/></a> : null} 
                                {userProfile.instagram_url !== "no_link" ? <a href={userProfile.instagram_url} target="_blank"><FaInstagram/></a> : null} 
                                {userProfile.website_url !== "no_link" ? <a href={userProfile.website_url } target="_blank"><BsLink45Deg/></a> : null}   
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
                            55
                        </div>
                        <div className="d-flex col-3 justify-content-center align-items-center">
                            65
                        </div>
                        <div className="d-flex col-3 justify-content-center align-items-center">
                            {(userProfile.creation_date).split(" ")[2] + " " + (userProfile.creation_date).split(" ")[1] + ", " + (userProfile.creation_date).split(" ")[3]}
                        </div>
                        <div className="d-flex col-3 justify-content-center align-items-center">
                            {(userProfile.last_login).split(" ")[2] + " " + (userProfile.last_login).split(" ")[1] + ", " + (userProfile.last_login).split(" ")[3]}
                        </div>
                    </div>
                </div>
                <div className="col-2">

                </div>
            </div>
            <div>
                <div className="row">
                    <div className="col-2">
                    </div>
                    <div className="col-md-8 col-xs-12 profile-header p-4">
                        {OwnAccount ? <PostEditor/> : null}
                    </div>
                    <div className="col-2">
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                    </div>
                    <div className="col-md-8 col-xs-12 profile-header p-4">
                        {userProfile.Posts.map(post => {
                            return <Post post_info={post} user_info={userProfile} loggedin_user_info={userProfile} key={post.id}/>
                        })}
                    </div>
                    <div className="col-2">
                    </div>
                </div>
            </div>
            <EditSocialsModal EditSocials={EditSocials}
                                SetEditSocials={setEditSocials}
                                userInfo={userProfile}
                                refreshProfile = {refreshProfile}
                                setRefreshProfile = {setRefreshProfile}/>
            <EditBioModal EditBio={EditBio}
                          SetEditBio={setEditBio}
                          userInfo={userProfile}/>
        </div>

    )
}

export default Profile;