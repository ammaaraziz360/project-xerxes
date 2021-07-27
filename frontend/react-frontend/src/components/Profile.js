import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import {BiEdit} from 'react-icons/bi'
import EditSocialsModal from './EditSocialsModal';

const Profile = ({ userProfile, OwnAccount }) => {
    const [EditSocials, setEditSocials] = useState(false);



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
                        <div className="col-9 p-2 align-items-center">
                            <strong>Bio</strong>
                        </div>
                    </div>
                    <div className="row mt-0">
                        <div className="d-flex col-3 p-2 align-items-center">
                            <div className="d-flex flex-column bd-highlight mb-3">
                                {userProfile.twitter_url !== "no_link" ? <p>Twitter</p> : null}
                                {userProfile.facebook_url !== "no_link" ? <p>Facebook</p> : null} 
                                {userProfile.youtube_url !== "no_link" ? <p>Youtube</p> : null} 
                                {userProfile.instagram_url !== "no_link" ? <p>Instagram</p> : null} 
                                {userProfile.website_url !== "no_link" ? <p>Website</p> : null}   
                            </div>
                        </div>
                        <div className="d-flex col-9 p-2 align-items-center">
                            {userProfile.bio == null ? <p>No bio</p> : <p>{userProfile.bio}</p>}
                        </div>
                    </div>
                    <div className="row sub stats-div p-1 mt-2">
                        <div className="d-flex col-3 justify-content-center align-items-center">
                            <strong>Followers</strong>
                            <hr/>
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
            <EditSocialsModal EditSocials={EditSocials}
                                SetEditSocials={setEditSocials}/>
        </div>

    )
}

export default Profile;