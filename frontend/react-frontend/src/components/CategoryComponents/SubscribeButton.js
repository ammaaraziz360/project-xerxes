import { useEffect, useState, useReducer, useContext, useRef } from 'react';
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

    const didMount = useRef(false);

    useEffect(() => {
        if(didMount.current) {
            if (logged_in_state.isLoggedIn) {
                fetch(`http://127.0.0.1:5000/api/categories/${category_info.category_id}/subscribe`, {
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
                        body: JSON.stringify({subscribe_type: subscribed}),
                }).then(res => {
                    if (res.status === 200) {
                        if(res.headers.get('X-JWT') != null) {
                            cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                        }
                        return res.json()
                    } else if (res.status === 401) {
                        logged_in_state.setIsLoggedIn(false);
                        console.log('You are not logged in');
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
            else {
                console.log('You are not logged in');
            }
        }
        else {
            didMount.current = true;
        }

    }, [subscribed]);

    const SubscribeCategory = (subscribe) => {
        logged_in_state.isLoggedIn ? setSubscribed(subscribe) : console.log('You are not logged in');;
    }


    return (
        <div>
            {subscribed == 1?
                <Button id="following" className="bg-light text-dark" onClick={() => SubscribeCategory(0)} onMouseOver={()=> setIsHover(true)} onMouseOut={() => setIsHover(false)}>
                    { isHover ?  "Unsubscribe" : "Subscribed" }
                </Button>
                : 
                <Button onClick={() => SubscribeCategory(1)}>
                    Subscribe
                </Button>
            }
        </div>
    );
}

export default SubscribeButton;