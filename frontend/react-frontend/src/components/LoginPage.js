import { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import {useHistory } from 'react-router';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import BlankModal from './Modal';

import '../App.css'
const clientId = "31312193628-o29ttjk3ogu3ftvbvurt91oi8t3akt0m.apps.googleusercontent.com"
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


const EnterUsernameModal = ({toggleModal, setToggleModal}) => {
    if(toggleModal == false){
        return null
    } 

    return(
        <div>
            <Modal backdrop="static" keyboard={false} show={toggleModal} onHide={() => setToggleModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Welcome to Blogoo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Pick a username</h4>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setToggleModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => setToggleModal(false)}>
                    Save Changes
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
            'auth_token': response.getAuthResponse().id_token
        }

        sessionStorage.setItem("session_token", user_data.auth_token)
        sessionStorage.setItem("user_id", user_data.google_id)

        fetch('http://127.0.0.1:5000/api/users', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(user_data),
            headers: {
                'Content-Type': 'application/json'
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
                title = "Error"
                body = error
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