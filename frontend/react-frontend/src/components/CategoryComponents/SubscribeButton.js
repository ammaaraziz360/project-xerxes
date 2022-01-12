import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory } from 'react-router'
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie'
import { LoggedInContext } from '../LoggedInContext';

const SubscribeButton = ({category_info}) => {
    const history = useHistory();
    const logged_in_state = useContext(LoggedInContext);
    const cookie = new Cookies();
    const [subscribed, setSubscribed] = useState(category_info.requester_subscribed);

    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        if (following !== null && logged_in_state) {
            fetch(`http://127.0.0.1:5000/api/users/${category_id}/follow`, {
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

    const Subscribed = (follow) => {
        logged_in_state.isLoggedIn ? setSubscribed(follow) : console.log('You are not logged in');;
    }

    return (
        <div>
            {subscribed == 1?
                <Button id="following" className="bg-light text-dark" onClick={() => FollowUser(0)} onMouseOver={()=> setIsHover(true)} onMouseOut={() => setIsHover(false)}>
                    { isHover ?  "Unsubscribe" : "Subscribed" }
                </Button>
                : 
                <Button onClick={() => FollowUser(1)}>
                    Subscribed
                </Button>
            }
        </div>
    );
}

export default SubscribeButton;