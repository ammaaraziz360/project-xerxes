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

import '../App.css'
import React from 'react';

const NavBar = () => {
    return (
        <div className="sub">
            <div className='container'>

            <div className="row">
                <div className="col-4">
                    Blogoo
                </div>
                <div className="col-4">
                    Search  
                </div>
                <div className="col-4">
                    Picture
                </div>
            </div>
            
            </div>
        </div>
    );
}

export default NavBar;