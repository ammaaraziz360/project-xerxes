import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'


import '../App.css'
import React from 'react';
import Profile from './Profile';

const cookie = new Cookies();

// regular expression for youtube channel validation
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;



const ProfilePage = ({...Props}) => {
    const [userProfile, setUserProfile] = useState({username:'', first_name:'', last_name:'', pfp:'', creation_date:'', last_login:'', bio:'', location:'', facebook_url:'', youtube_url:'', twitter_url:'', instagram_url:'', website_url:''});
    const history = useHistory();
    
    const [refreshProfile, setRefreshProfile] = useState(false);


    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/users/profile', {
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
                return res.json()
            } 
            else {
                history.push('/login')
            }
        })
        .then(data => {
            console.log(data)
            setUserProfile(data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [refreshProfile]);

    return (
        <Profile userProfile={userProfile}
                OwnAccount={true}
                refreshProfile = {refreshProfile}
                setRefreshProfile = {setRefreshProfile} />
    );
}


export default ProfilePage;