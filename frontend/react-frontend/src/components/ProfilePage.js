import { useEffect, useState, useReducer } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'



import '../App.css'
import React from 'react';
import Profile from './Profile';

const cookie = new Cookies();

// regular expression for youtube channel validation
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;



const ProfilePage = ({...Props}) => {
    const [userProfile, setUserProfile] = useState({username:'', first_name:'', last_name:'', pfp:'', creation_date:'', 
    last_login:'', bio:'', location:'',followers: '',following: '' ,facebook_url:'', youtube_url:'', 
    twitter_url:'', instagram_url:'', website_url:'', Posts: [], OwnAccount: false});

    const [loggedinUser, setLoggedinUser] =  useState({username:'', first_name:'', last_name:'', pfp:'', creation_date:'', 
    last_login:'', bio:'', location:'',followers: '',following: '' ,facebook_url:'', youtube_url:'', 
    twitter_url:'', instagram_url:'', website_url:'', Posts: [], OwnAccount: false});

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
        fetch(`http://127.0.0.1:5000/api/users/profile/${cookie.get('user_id')}`, {
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
            else{
                return null
            }
        })
        .then(data => {
            setLoggedinUser(data)
        })
        .catch(err => {
            console.log(err)
        })
        
    }, [refreshProfile]);

    return (
        <Profile userProfile={userProfile}
                loggedinUser={loggedinUser}
                refreshProfile = {refreshProfile}
                setRefreshProfile = {setRefreshProfile} />
    );
}


export default ProfilePage;