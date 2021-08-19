import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { LoggedInContext } from './LoggedInContext';
import Post from './Post';
import { Form } from 'react-bootstrap';
import Comment from './Comment';
import LoadingSpinner from './LoadingSpinner';


const PostPage = () => {
    var {id} = useParams()
    const history = useHistory();
    const cookie = new Cookies();
    const logged_in_state = useContext(LoggedInContext) 

    var base_user = {username:'', first_name:'', last_name:'', pfp:'', creation_date:'', 
    last_login:'', bio:'', location:'',followers: '',following: '' ,facebook_url:'', youtube_url:'', 
    twitter_url:'', instagram_url:'', website_url:'', Posts: [], OwnAccount: false}

    const [loggedinUser, setLoggedinUser] =  useState(null);
    const [PostInfo, setPostInfo] = useState(null)

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/posts/${id}`, {
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
                setPostInfo(data)
            })
            .catch(err => {
                console.log(err)
            })
        
        if(logged_in_state){
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
        }

    }, [])
        
    return(
        <div className="container">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-md-8 col-xs-12 profile-header p-4">
                    { PostInfo != null 
                            ? <Post post_info={PostInfo} user_info={PostInfo.poster_info} loggedin_user_info={loggedinUser}/>
                    : <LoadingSpinner/>}
                </div>
                <div className="col-2">
                </div>
            </div>
            
        </div>
    )



}

export default PostPage;