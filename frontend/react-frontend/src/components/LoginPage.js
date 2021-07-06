import { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import {useHistory } from 'react-router';
import '../App.css'
const clientId = "31312193628-o29ttjk3ogu3ftvbvurt91oi8t3akt0m.apps.googleusercontent.com"

const LoginPage = () => {

    const history = useHistory()
    const responseGoogle = (response) => {
        fetch('http://127.0.0.1:5000/')
            .then(res => res.json())
            .then(result => {
                console.log(result)
            })
        console.log(response.profileObj)
        //history.push('/history')
    }

    return(
        <div className='d-flex bg-dark vh-100'>
            <div className="centerDiv">
                <div className="row m-0">
                    <div className="col-12 bg-secondary text-light rounded-top p-3">
                        <h1 className="text-center">Welcome to Project Xerxes</h1>
                    </div>
                </div>
                <div className="row m-0">
                    <div className="d-flex col-12 bg-secondary text-light rounded-bottom justify-content-center p-3">
                        <GoogleLogin
                            clientId= {clientId}
                            buttonText="Login"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage