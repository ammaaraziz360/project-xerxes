import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown';
import Alerts from './ErrorAlert';

import { Link } from 'react-router-dom';
import '../App.css'
import React from 'react';

const cookie = new Cookies();


const NavBar = ({...Props}) => {
    const [userProfile, setUserProfile] = useState(null);
    const history = useHistory();

    useEffect(() => {
            setUserProfile({pfp_url: ''});
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
    }, [Props.isLoggedIn]);

    const LogOut = () => {
        fetch('http://127.0.0.1:5000/api/users/logout', {
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
        }).then(res=> {
            if(res.status === 200) {
                cookie.remove('token', {path: '/'})
                cookie.remove('user_id', {path: '/'})
                cookie.remove('ip', {path: '/'})
                cookie.remove('user_agent', {path: '/'})
                cookie.remove('SID', {path: '/'})
                Props.setIsLoggedIn(false);
                sessionStorage.setItem("loggedIn" , false);
                history.push('/login')
            }
            else{
                sessionStorage.setItem("loggedIn" , false);
                Props.setIsLoggedIn(false);
            }
        }).catch(err=> {
            history.push('/login')
        })
    }
    return (
        <div className="sub naver">
            <div className='container-fluid'>
                <div className="d-flex row p-3">
                    
                    <div className="d-flex col-3 align-items-center">
                        <Link to="/login" className='nav-brand'>
                            <h2>Blogoo</h2>
                        </Link>
                    </div>
                        <div className="d-flex col-6 justify-content-center align-items-center">
                            <input className="form-control search-bar" type="text" placeholder="Search for people, tags, and categories"></input>
                        </div>
                    <div className="d-flex col-3 justify-content-end align-items-center">
                        <div className="dropdown sub">
                            
                            <a className="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                {userProfile != null ? <img src={userProfile.pfp} className="image-fluid pfp"></img>
                                            : <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className="image-fluid pfp"></img>
                                }
                            </a>

                            <ul className="dropdown-menu m-3" aria-labelledby="dropdownMenuLink">
                                {userProfile != null ? [<li key={1}><Link to="/profile" className="dropdown-item">Profile</Link></li>,
                                            <li key={2}><Link to="/"className="dropdown-item">Settings</Link></li>,
                                            <li key={3}><a className="dropdown-item" onClick={() => LogOut() }>Log out</a></li>]
                                            : <li><Link to="/login" className="dropdown-item" >Log In</Link></li>
                            }
                            </ul>
                        </div>
                        
                    </div>
                </div>
            
            </div>
        </div>
    );
}

export default NavBar;