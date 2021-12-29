import { useEffect, useState, useReducer, useContext } from 'react';
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

import { LoggedInContext } from './LoggedInContext';

const cookies = new Cookies();
const ytregex = '(?:https?:)?\/\/(?:[A-z]+\.)?youtube.com\/channel\/(?P<id>[A-z0-9-\_]+)\/?'
const twitRegex = '(?:https?:)?\/\/(?:[A-z]+\.)?twitter\.com\/@?(?!home|share|privacy|tos)(?P<username>[A-z0-9_]+)\/?'
const fbRegex = '(?:https?:)?\/\/(?:www\.)?(?:facebook|fb)\.com\/(?P<profile>(?![A-z]+\.php)(?!marketplace|gaming|watch|me|messages|help|search|groups)[A-z0-9_\-\.]+)\/?'
const instaRegex = '(?:https?:)?\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/(?P<username>[A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)'

// regular expression to validate username
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

const EnterUsernameModal = ({...Props}) => {
    const history = useHistory();
    const logged_in_state = useContext(LoggedInContext) 

    const[usernameErrorAlertText, setUsernameAlertText] = useState({'message': '', 'style': 'danger'})
    const [input, setInput] = useState('');
    const[AlertToggle, setAlertToggle] = useState(false)
    const[UsernameAlertToggle, setUsernameAlertToggle] = useState(false)    
    // to disable join button
    const[disableButton, setDisableButton] = useState(true)

    // to check for privacy policy checkbox
    const[ppCheck, setPPCheck] = useState(false)
    // to check for terms of service checkbox
    const[tosCheck, setTosCheck] = useState(false)
    const[nameCheck, setNameCheck] = useState(false)
    
    function handleSubmit(e){
        e.preventDefault();

        if(tosCheck == false || ppCheck == false){
            setUsernameAlertText({'message': 'You must accept the privacy policy and the terms of service', 'style': 'danger'})
            setUsernameAlertToggle(true)
            return
        }
        if(!input.match(usernameRegex)){
            setUsernameAlertText({'message': 'Username must be greater than 5 characters and be less than 20 characters, username should also not contain any spaces and be alphanumeric', 'style': 'danger'})
            setUsernameAlertToggle(true)
            return
        }
        setUsernameAlertToggle(false)
        
        var username = {username: input}
        fetch('http://127.0.0.1:5000/api/users', { 
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookies.get('token'),
                'user_id': cookies.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookies.get('SID')
            },
            body: JSON.stringify(username)
        }).then(res => {
            if(res.headers.get('X-JWT') != null) {
                cookies.set('token', res.headers.get('X-JWT'), {path: '/'})
            }
            
            if(res.status === 200){
                localStorage.setItem('logged_in', 'true')
                logged_in_state.setIsLoggedIn(true);
                history.push(`/user/${cookies.get('user_id')}`)
            }
            else{
                localStorage.setItem('logged_in', 'false')
                logged_in_state.setIsLoggedIn(false)
                return res.json()
            }

        }).then(data => {
            throw new Error(data.error)
        }).catch(err => {
            setUsernameAlertText({'message': err.message, 'style': 'danger'})
            setUsernameAlertToggle(true)
        })
    }



    return(
        <div>
            <Modal animation={false} backdrop="static" keyboard={false} show={Props.toggleModal} onHide={() => Props.setToggleModal(false)}>
                <Modal.Header>
                <Modal.Title>Welcome to Blogoo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label><strong>Pick a username</strong></Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                type="username"
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                value = {input}
                                onChange = {(e) => {setInput(e.target.value)}}
                                />
                            </InputGroup>
                        </Form.Group>
                        
                        <div className='mt-4'>
                            <Form.Group controlId="formBasicCheckboxTOS">
                                <Form.Check 
                                    type="checkbox" 
                                    label="I agree to the terms of service" 
                                    onChange={() => setTosCheck(!tosCheck)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckboxPP">
                                <Form.Check 
                                    type="checkbox" 
                                    label="I have read and agree to the Privacy Policy"
                                    onChange={() => setPPCheck(!ppCheck)} />
                            </Form.Group>
                        </div>
                        <div className='mt-4'>
                            <Alerts
                                AlertToggle = {UsernameAlertToggle}
                                AlertText = {usernameErrorAlertText}
                            />
                        </div>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">
                                Join
                            </Button>
                        </Modal.Footer>     
                    </Form>
                </Modal.Body>   
                
            </Modal>
        </div>
    )
}

export default EnterUsernameModal;  