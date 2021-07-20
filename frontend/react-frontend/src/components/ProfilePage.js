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

const cookie = new Cookies();

const ProfilePage = ({...Props}) => {
    
    return (
        <h1>This is the home page; user logged in: {cookie.get('user_id')}</h1>
    );
}


export default ProfilePage;