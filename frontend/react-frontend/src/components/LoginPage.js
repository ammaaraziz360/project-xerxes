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
        <div className='main vh-100 container-fluid p-0'>
            <div className="row m-0 h-100">
                <div className="d-flex col-10 jet-bg p-0 align-items-center">
                    <div className="text-left text-dark sub-int p-4 w-100">
                        <h1 className="font-weight-bold">Project Xerxes</h1>
                        <p>Log in</p>
                    </div>
                </div>
                <div className="d-flex col-2 sub-int p-0 align-items-center">
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
                {/* <div className="row m-0">
                    <div className="col-lg-4 col-sm-1"></div>
                    <div className="col-lg-4 col-sm-10 text-light rounded align-items-center p-3 sub">
                        <div className="d-flex justify-content-center flex-column text-center">
                            <div className="text-dark sub-int p-4 mb-4 rounded">
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
                </div> */}
        </div>
    )
}

export default LoginPage