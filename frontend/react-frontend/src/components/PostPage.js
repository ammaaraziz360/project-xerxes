import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router';
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
                setPostInfo(data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [])
        
    return(
        <div className="container">
            {PostInfo !== null 
                ?<Redirect to={`/post/${id}/${(PostInfo.post.title).replace(/\s+/g, '-')}`}/>
                : null
            }

            <div className="profile-header p-4">
                { PostInfo != null 
                        ? <Post post_info={PostInfo.post} loggedin_user_info={PostInfo.requester_profile}/>
                : <LoadingSpinner/>}
            </div>
        </div>
    )



}

export default PostPage;