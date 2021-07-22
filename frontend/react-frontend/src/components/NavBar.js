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


    const LogOut = () => {
        Props.setIsLoggedIn(false);
    }
    return (
        <div className="sub naver">
            <div className='container-fluid'>
                <div className="d-flex row p-3">
                    
                    <div className="d-flex col-3 align-items-center">
                        <Link to="/login" className='nav-brand'>
                            <h2>blogoo</h2>
                        </Link>
                    </div>
                        <div className="d-flex col-6 justify-content-center align-items-center">
                            <input className="form-control search-bar" type="text" placeholder="Search for people, tags, and categories"></input>
                        </div>
                    <div className="d-flex col-3 justify-content-end align-items-center">
                        <div className="dropdown sub">
                            
                            <a className="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                {Props.isLoggedIn ? <img src="https://lh3.googleusercontent.com/a-/AOh14GjQ75MzIig737ug-yQInIeKnEcbUhkbHjY4vMj4-w=s96-c" className="image-fluid pfp"></img>
                                            : <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className="image-fluid pfp"></img>
                                }
                            </a>

                            <ul className="dropdown-menu m-3" aria-labelledby="dropdownMenuLink">
                                {Props.isLoggedIn ? [<li key={1}><Link to="/" className="dropdown-item">Profile</Link></li>,
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