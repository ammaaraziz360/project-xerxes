import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'

import Alerts from './ErrorAlert';

import '../App.css'
import React from 'react';
import { Redirect } from 'react-router';
import Profile from './Profile';

const cookie = new Cookies();

// regular expression for youtube channel validation
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;



const ProfilePage = ({...Props}) => {
    const [userProfile, setUserProfile] = useState({username:'', first_name:'', last_name:'', pfp:'', creation_date:'', last_login:'', bio:'', location:'', facebook_url:'', youtube_url:'', twitter_url:'', instagram_url:'', website_url:''});
    const history = useHistory();
    
    useEffect(() => {
        if (Props.isLoggedIn == false){
            history.push('/login');
        }
        else {
            setUserProfile({username:'', first_name:'', last_name:'', pfp:'', creation_date:'', last_login:'', bio:'', location:'', facebook_url:'', youtube_url:'', twitter_url:'', instagram_url:'', website_url:''});
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
                        console.log(res.headers.get('X-JWT'))
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
        }
    }, [Props.isLoggedIn]);

    return (
        <Profile userProfile={userProfile}
                OwnAccount={true} />
    );
}


export default ProfilePage;