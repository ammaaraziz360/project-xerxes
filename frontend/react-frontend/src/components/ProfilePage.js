import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'
import LoadingSpinner from './LoadingSpinner';
import { LoggedInContext } from './LoggedInContext';

import '../App.css'
import React from 'react';
import Profile from './Profile';

const cookie = new Cookies();


const ProfilePage = ({...Props}) => {

    const logged_in_state = useContext(LoggedInContext) 

    const [userProfile, setUserProfile] = useState(null);

    const history = useHistory();
    
    const { username } = useParams();

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/users/profile/${username}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token'),
                'user_id': cookie.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookie.get('SID')
            },
        })
        .then(res => {
            if (res.status === 200) {
                if(res.headers.get('X-JWT') != null) {
                    cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                }
                return res.json();
            } 
            else{
                history.push('/404')
            }
        })
        .then(data => {
            setUserProfile(data)
        })
        .catch(err => {
            console.log(err)
        })
        
    }, []);

    return (
        <div className="container">
            <div className="profile-header p-4">
                {userProfile != null ?
                    <Profile userProfile={userProfile.profile}
                            loggedinUser={userProfile.requester_profile} />
                :   <LoadingSpinner />
                }
            </div>
        </div>
    );
}


export default ProfilePage;