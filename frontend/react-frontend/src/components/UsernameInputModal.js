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

const cookies = new Cookies();

// regular expression to validate username
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

const EnterUsernameModal = ({toggleModal, setToggleModal}) => {

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
                'user_agent': navigator.userAgent,            },
        }) 
            .then(res => {
                cookies.set('token', res.headers.get('x-jwt'), {path: '/'})
                return res.json()
            })
            .then(data => {
                console.log(data)
                setBannedWords(data.banned_words)
            })
    }, [toggleModal])

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
        if(tosCheck && ppCheck && nameCheck){
            setDisableButton(false)
        }
        else{
            setDisableButton(true)
        }
    })

    useEffect(() => {
        var username = {username: input}
        if(submissionStatus){
            fetch('http://127.0.0.1:5000/api/users/username', { 
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': cookies.get('token'),
                    'user_id': cookies.get('user_id'),
                    'ip': sessionStorage.getItem('ip'),
                    'user_agent': navigator.userAgent
                },
                body: JSON.stringify(username)
            }).then(res => {
                if(res.status === 200){
                    cookies.set('token', res.headers.get('x-jwt'), {path: '/'})
                    return res.json()
                }
                else{
                    throw new Error('Internal server error, try again later')
                }
            }).then(data => {
                console.log(data)
            }).catch(err => {
                setSubmissionStatus(false)
                setUsernameAlertText({'message': err.message, 'style': 'danger'})
                setUsernameAlertToggle(true)
            })
        }   
    }, [submissionStatus])
    

    return(
        <div>
            <Modal animation={false} backdrop="static" keyboard={false} show={toggleModal} onHide={() => setToggleModal(false)}>
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
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check 
                                    type="checkbox" 
                                    label="I agree to the terms of service" 
                                    onChange={() => setTosCheck(!tosCheck)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
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