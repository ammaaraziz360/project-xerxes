import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory } from 'react-router'
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie'
import { LoggedInContext } from './LoggedInContext';

const FollowButton = ({userProfile}) => {
    const history = useHistory();
    const logged_in_state = useContext(LoggedInContext);
    const cookie = new Cookies();
    const [following, setFollowing] = useState(null);

    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        if (following !== null) {
            fetch(`http://127.0.0.1:5000/api/users/${userProfile.user_id}/follow`, {
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
                    body: JSON.stringify({following: following}),
            }).then(res => {
                if (res.status === 200) {
                    if(res.headers.get('X-JWT') != null) {
                        cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                    }
                    return res.json()
                } else if (res.status === 401) {
                    console.log('You are not logged in');
                }
            }).catch(err => {
                console.log(err);
            })
        }

    }, [following]);

    useEffect(() => {
        setFollowing(userProfile.follows);
    }, [userProfile]);
    

    return (
        <div>
            {following ?
                <Button id="following" className="bg-light text-dark" onClick={() => setFollowing(false)} onMouseOver={()=> setIsHover(true)} onMouseOut={() => setIsHover(false)}>
                    { isHover ?  "Unfollow" : "Following" }
                </Button>
                : 
                <Button onClick={() => setFollowing(true)}>
                    Follow
                </Button>
            }
        </div>
    );
}

export default FollowButton;