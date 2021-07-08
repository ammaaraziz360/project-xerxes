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
        <div className='bg-dark vh-100 container-fluid'>
            <div className='centerCol'></div>
                <div className="row m-0">
                    <div className="col-lg-4 col-sm-1"></div>
                    <div className="col-lg-4 col-sm-10 bg-secondary text-light rounded align-items-center p-3">
                        <div className="d-flex justify-content-center flex-column text-center">
                            <div className="bg-light text-dark p-4 mb-4 rounded">
                                <h1>Project Xerxes</h1>
                                <p>Log in</p>
                            </div>
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
                    <div className="col-lg-4 col-sm-1"></div>
                </div>
        </div>
    )
}

export default LoginPage