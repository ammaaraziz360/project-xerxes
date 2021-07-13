import { useEffect, useState, useReducer } from 'react';
import { GoogleLogin } from 'react-google-login';
import {useHistory } from 'react-router';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'

import Alerts from './ErrorAlert';
import BlankModal from './Modal';

import '../App.css'
import React from 'react';

const clientId = "31312193628-o29ttjk3ogu3ftvbvurt91oi8t3akt0m.apps.googleusercontent.com"

// regular expression with only letters, numbers, and _!#$%&*.'=+
const username_regex = new RegExp("^[a-zA-Z0-9_!#$%&*.'=+]*")



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
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/users/banned-usernames', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'auth_token': sessionStorage.getItem("session_token")
            },
        }) 
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setBannedWords(data[0].banned_words)
            })
    }, [toggleModal])

    useEffect(() =>{
  
        if(bannedWords.includes(input)){
            setAlertErrorText({'message': 'Banned username, pick a new username', 'style': 'danger'})
            setAlertToggle(true)
            setNameCheck(false)
        }
        else{
            if(input.length > 4 && !input.includes(' ')){
                setUsernameAlertToggle(false)
                setNameCheck(true)
            }
            else{
                setUsernameAlertText({'message': 'Username must be at least 5 characters long and not contain spaces', 'style': 'danger'})
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

    if(toggleModal == false){
        return null
    } 

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
                    <Button disabled={disableButton} variant="primary" onClick={() => setToggleModal(false)}>
                        Join
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

const LoginPage = () => {
    const[toggleUsernameModal, setToggleUsernameModal] = useState(false);
    const[toggleModal, setToggleModal] = useState(false);

    const[modalText, setModalText] = useState({'title': '', 'body': ''})

    const history = useHistory()

    var title = "";
    var body = "";

    const responseGoogle = (response) => {

        var google_user = response.profileObj
        var user_data = {
            'google_id': google_user.googleId,
            'email': google_user.email,
            'last_name': google_user.familyName,
            'first_name': google_user.givenName,
            'pfp_url': google_user.imageUrl,
            'login_type': 'gog'
        }

        sessionStorage.setItem("session_token", response.getAuthResponse().id_token)
        sessionStorage.setItem("user_id", user_data.google_id)

        fetch('http://127.0.0.1:5000/api/users', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(user_data),
            headers: {
                'Content-Type': 'application/json',
                'auth_token': response.getAuthResponse().id_token,
              },
        }) .then(res => {
            if(res.status == 200){
                setToggleUsernameModal(!toggleUsernameModal)
            }
            else {
                setModalText({'title': 'Something went wrong', 'body': 'Login faluire, please try again'})
                setToggleModal(!toggleModal)
            }
        }).catch(error => {
                setModalText({'title': 'Something went wrong', 'body': 'Login faluire, please try again'})
                setToggleModal(!toggleModal)
            })
        //history.push('/history')
    }

    return(
        <div>
            <div className='main vh-100 container-fluid p-0'>
                <div className="row m-0 h-100">
                    <div className="d-flex col-lg-10 col-6 jet-bg p-0 align-items-center">
                        <div className="text-left text-dark sub-int p-4 w-100">
                            <h1 className="font-weight-bold">Project Xerxes</h1>
                            <p>Log in</p>
                        </div>
                    </div>
                    <div className="d-flex col-lg-2 col-6 sub-int p-0 align-items-center">
                        <div className="p-4 w-100">
                                <GoogleLogin
                                    clientId= {clientId}
                                    buttonText="Login with Google"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    className="d-flex justify-content-center"
                                />
                        </div>
                    </div>
                </div>
            </div>
            <EnterUsernameModal toggleModal = {toggleUsernameModal}
                                setToggleModal = {setToggleUsernameModal}/>
            <BlankModal toggleModal = {toggleModal}
                        setToggleModal = {setToggleModal}
                        text = {modalText}/>
        </div>
    )
}

export default LoginPage