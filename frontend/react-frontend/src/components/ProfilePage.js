import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'
import LoadingSpinner from './LoadingSpinner';
import { LoggedInContext } from './LoggedInContext';

import '../App.css'
import React from 'react';
import Profile from './Profile';

const cookie = new Cookies();

// regular expression for youtube channel validation
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;



const ProfilePage = ({...Props}) => {

    const logged_in_state = useContext(LoggedInContext) 

    const [userProfile, setUserProfile] = useState(null);

    const [loggedinUser, setLoggedinUser] =  useState(null);

    const history = useHistory();
    
    const [refreshProfile, setRefreshProfile] = useState(false);

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

        // get own profile
        if(logged_in_state.isLoggedIn){
            fetch(`http://127.0.0.1:5000/api/users/profile`, {
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
                    return res.json()
                }
                else if (res.status === 401) {
                    logged_in_state.setIsLoggedIn(false);
                    return null
                }
            })
            .then(data => {
                setLoggedinUser(data)
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            setLoggedinUser(null)
        }
        
    }, [refreshProfile]);

    return (
        userProfile != null && loggedinUser != null ?
            <Profile userProfile={userProfile}
                    loggedinUser={loggedinUser}
                    refreshProfile = {refreshProfile}
                    setRefreshProfile = {setRefreshProfile} />
        :   <LoadingSpinner />
    );
}


export default ProfilePage;