import { useEffect, useState, useReducer } from 'react';
import { GoogleLogin } from 'react-google-login';
import {useHistory } from 'react-router';
import Cookies from 'universal-cookie'

import BlankModal from './Modal';
import EnterUsernameModal from './UsernameInputModal'

import '../App.css'
import React from 'react';

const clientId = "31312193628-o29ttjk3ogu3ftvbvurt91oi8t3akt0m.apps.googleusercontent.com"
const cookies = new Cookies();

// regular expression with only letters, numbers, and _!#$%&*.'=+
const username_regex = new RegExp("^[a-zA-Z0-9_!#$%&*.'=+]*")

const LoginPage = () => {

    const[toggleUsernameModal, setToggleUsernameModal] = useState(false);
    const[toggleModal, setToggleModal] = useState(false);

    const[modalText, setModalText] = useState({'title': '', 'body': ''})
    const[ipAddress, setIpAddress] = useState('')

    const history = useHistory()

    useEffect(() => {
        cookies.remove('token', { path: '/' })

        fetch(`https://api.ipify.org?format=json`, {
            method: 'GET',
            mode: 'cors',
        })
            .then((res => res.json()))
            .then(data => {
                setIpAddress(data.ip)
        })

    },[]);

    const responseGoogle = (response) => {
        var google_user = response.profileObj
        var user_data = {
            'google_id': '',
            'email': google_user.email,
            'last_name': google_user.familyName,
            'first_name': google_user.givenName,
            'pfp_url': google_user.imageUrl,
            'login_type': 'gog'
        }

        sessionStorage.setItem("google_auth_token", response.getAuthResponse().id_token)

        fetch('http://127.0.0.1:5000/api/users/login', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(user_data),
            headers: {
                'Content-Type': 'application/json',
                'google_auth_token': response.getAuthResponse().id_token,
                'user_agent': navigator.userAgent,
                'ip': ipAddress
            },
        }) 
            .then(res => {
                if (res.status === 200){
                    return res.json()
                }
                else{
                    return null
                }
             }) 
            .then(data => {
                console.log(data)
                if ("user_exists" in data){
                    cookies.set('token', data.token, {path: '/'})
                    if(data['user_exists'] == "True"){
                        history.push("/home")
                    }
                    else {
                        setToggleUsernameModal(!toggleUsernameModal)
                    }
                }
                else{
                    throw "Backend problem"
                }
            })
            .catch(error => {
                setModalText({'title': 'Something went wrong', 'body': 'Login faluire, please try again'})
                setToggleModal(!toggleModal)
            })
        //history.push('/history')
    }

    return(
        <div>
            <div className='vh-100 smokey_black container-fluid p-0'>
                <div className="row m-0 h-100">
                    <div className="d-flex col-lg-4 col-1 smokey_black p-0 align-items-center">
                        
                    </div>
                    <div className="d-flex col-lg-4 col-10 p-0 align-items-center sub h-50 align-self-center border border-white rounded">
                        <div className="d-flex p-4 w-100 justify-content-center">
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
                    <div className="d-flex col-lg-4 col-1 smokey_black p-0 align-items-center">
                        
                    </div>
                </div>
            </div>
            {toggleUsernameModal 
                ? <EnterUsernameModal toggleModal = {toggleUsernameModal}
                                    setToggleModal = {setToggleUsernameModal}/>
                : null
            }
            <BlankModal toggleModal = {toggleModal}
                        setToggleModal = {setToggleModal}
                        text = {modalText}/>
        </div>
    )
}

export default LoginPage