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


    const[ErrorAlertText, setAlertErrorText] = useState({'message': 'Banned username, pick a new username', 'style': 'danger'})
    const[usernameErrorAlertText, setUsernameAlertText] = useState({'message': '', 'style': 'danger'})
    const [input, setInput] = useState('');
    const[bannedWords,setBannedWords] = useState([])
    const[AlertToggle, setAlertToggle] = useState(false)
    const[UsernameAlertToggle, setUsernameAlertToggle] = useState(false)    
    // to disable join button
    const[disableButton, setDisableButton] = useState(true)

    // to check for privacy policy checkbox
    const[ppCheck, setPPCheck] = useState(false)
    // to check for terms of service checkbox
    const[tosCheck, setTosCheck] = useState(false)
    const[nameCheck, setNameCheck] = useState(false)

    const [ReadyToUnmount, setReadyToUnmount] = useState({status: false, message: ''});

    const [submissionStatus, setSubmissionStatus] = useState(false)
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/users/banned-usernames', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookies.get('token'),
                'user_id': cookies.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookies.get('SID')
            },
        }).then(res => {
                if (res.status === 200) {
                    if(res.headers.get('X-JWT') != null) {
                        cookies.set('token', res.headers.get('X-JWT'), {path: '/'})
                        console.log(res.headers.get('X-JWT'))
                    }
                    return res.json()
                } 
                else {
                    localStorage.setItem('logged_in', 'false');
                    logged_in_state.setIsLoggedIn(false);
                    history.push('/login');
                }
            })
            .then(data => {
                setBannedWords(data.banned_words)
            })
            .catch(err => {
                console.log(err)
            })
    }, [Props.toggleModal])

    useEffect(() =>{
  
        if(bannedWords.includes(input)){
            setAlertErrorText({'message': 'Banned username, pick a new username', 'style': 'danger'})
            setAlertToggle(true)
            setNameCheck(false)
        }
        else{
            if(input.match(usernameRegex)){
                setUsernameAlertToggle(false)
                setNameCheck(true)
            }
            else{
                setUsernameAlertText({'message': 'Username must be greater than 5 characters and be less than 20 characters, username should also not contain any spaces and be alphanumeric', 'style': 'danger'})
                setUsernameAlertToggle(true)
                setNameCheck(false)
            }
            setAlertToggle(false)
        }
        
    }, [input])

    useEffect(() => {
        if(ReadyToUnmount.status === false){
            if(tosCheck && ppCheck && nameCheck){
                setDisableButton(false)
            }
            else{
                setDisableButton(true)
            }
        }
    })

    useEffect(() => {
        var username = {username: input}
        if(submissionStatus){
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
                if(res.status === 200){
                    if(res.headers.get('X-JWT') != null) {
                        cookies.set('token', res.headers.get('X-JWT'), {path: '/'})
                    }
                    localStorage.setItem('logged_in', 'true');
                    logged_in_state.setIsLoggedIn(true);
                    setReadyToUnmount({status: true, message: `/user/${cookies.get('user_id')}`})
                }
                else if (res.status === 400) {
                    if(res.headers.get('X-JWT') != null) {
                        cookies.set('token', res.headers.get('X-JWT'), {path: '/'})
                    }
                    setSubmissionStatus(false)
                    return res.json()
                }
                else{
                    setReadyToUnmount({status: true, message: '/login'})
                    return res.json()
                }
            }).then(data => {
                throw new Error(data.error)
            }).catch(err => {
                if(ReadyToUnmount.status === false){
                    setUsernameAlertText({'message': err.message, 'style': 'danger'})
                    setUsernameAlertToggle(true)
                    setSubmissionStatus(false)
                }
            })
        }
        if(ReadyToUnmount.status == true){
            history.push(ReadyToUnmount.message)
        }  
        
    }, [submissionStatus])
    

    return(
        <div>
            <Modal animation={false} backdrop="static" keyboard={false} show={Props.toggleModal} onHide={() => Props.setToggleModal(false)}>
                <Modal.Header>
                <Modal.Title>Welcome to Blogoo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                                AlertToggle = {AlertToggle}
                                AlertText = {ErrorAlertText}
                            />
                            <Alerts
                                AlertToggle = {UsernameAlertToggle}
                                AlertText = {usernameErrorAlertText}
                            />
                        </div>
                       
                    </Form>
                </Modal.Body>   
                <Modal.Footer>
                    <Button disabled={disableButton} variant="primary" onClick={() => setSubmissionStatus(true)}>
                        Join
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EnterUsernameModal;  