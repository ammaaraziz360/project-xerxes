import { useEffect, useState, useReducer, useContext, react} from 'react';
import {Button} from 'react-bootstrap'
import { LoggedInContext } from './LoggedInContext';

import ErrorAlert from './ErrorAlert';
import Cookies from 'universal-cookie';

const cookie = new Cookies()

const ReplyBox = ({loggedin_user_info, post_id}) => {
    const [postText, setPostText] = useState('');
    const [AlertToggle, setAlertToggle] = useState(false);
    const [AlertMessage,setAlertMessage] = useState({message: '', style: ''});
    const logged_in_state = useContext(LoggedInContext);
    const [disableButton, setDisableButton] = useState(true);

    const SubmitPost = () => {
        var post_data = {title: null, 
                        body_raw: postText, 
                        body_html: null, 
                        reply_post_id: post_id}
        setPostText('');
        fetch('http://127.0.0.1:5000/api/posts', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token'),
                'user_id': cookie.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookie.get('SID')
            },
            body: JSON.stringify(post_data)
        })
        .then(res => {
            if (res.status === 200) {
                if(res.headers.get('X-JWT') != null) {
                    cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                }
                setAlertMessage({message: 'Comment successfully added', style: 'success'})
                setAlertToggle(true)
            } 
            else if (res.status === 401) {
                localStorage.setItem('logged_in', 'false');
                logged_in_state.setIsLoggedIn(false);
            }
            else {
                setAlertMessage({message: 'Error: Comment not posted, try again', style: 'danger'})
                setAlertToggle(true)
            }
        })
        .catch(err => {
            setAlertMessage({message: 'Error: Comment not posted, try again', style: 'danger'})
            setAlertToggle(true)
        })
    }

    useEffect(() => {
        if(postText.trim() != "" ){
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }   
    }, [postText])

    return (
        <div className="input-group">
            <div className="input-group-prepend pe-1">
                {loggedin_user_info !== null ? <img src={loggedin_user_info.pfp} className="pfp-small-2" alt="user image"/> 
                : <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className="pfp-small-2" alt="user image"/>
                }
            </div>
            <input className="form-control search-bar" type="text" placeholder="Add a comment" value={postText} onChange={(e) => setPostText(e.target.value)}></input>
            <div className="input-group-append">
                <Button variant="primary" id="side-btn" onClick={() => SubmitPost()} disabled={disableButton}>
                    Post
                </Button>
            </div>
        </div>
    )
}

export default ReplyBox;