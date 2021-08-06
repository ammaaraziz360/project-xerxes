import { Modal } from 'react-bootstrap';
import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import Alerts from './ErrorAlert';

import {FaTwitter, FaFacebookF,FaYoutube, FaInstagram} from 'react-icons/fa';
import {BsLink45Deg} from 'react-icons/bs';
import {CgClose} from 'react-icons/cg'




const EditBioModal = ({...Props}) => {
    const cookie = new Cookies();
    const history = useHistory();

    const [bio, setBio] = useState('');

    const [AlertToggle, setAlertToggle] = useState(false)
    const [AlertMessage, setAlertMessage] = useState('')

    const HandleSubmit = () => {
        
        fetch('http://127.0.0.1:5000/api/users', {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token'),
                'user_id': cookie.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookie.get('SID')
            },
            body: JSON.stringify({bio: bio})
        })
        .then(res => {
            if (res.status === 200) {
                if(res.headers.get('X-JWT') != null) {
                    cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                }
                setAlertToggle(true)
                setAlertMessage({message: "Bio saved successfully", style: 'success'})
            } 
            else {
                history.push('/login')
            }
        })
        .catch(err => {
            setAlertToggle(true)
            setAlertMessage({message: "Bio not saved, try again", style: 'danger'})
        })
    }

    return (
        <Modal animation={false} backdrop="static" show={Props.EditBio} keyboard={false} onHide={() => Props.SetEditBio(!Props.EditBio)}>
        <Modal.Header>
        <Modal.Title>Enter Bio</Modal.Title>
        <Button variant="primary" onClick={()=> Props.SetEditBio(!Props.EditBio)}>
                <CgClose />
            </Button>
        </Modal.Header>
        <Modal.Body>
            <Form>                    
                <InputGroup>
                    <FormControl as="textarea" 
                            aria-label="bio text area" 
                            placeholder="Enter Bio"
                            defaultValue={Props.userInfo.bio}
                            onChange={(e) => {setBio(e.target.value)}}/>
                </InputGroup>
                
                <div className='mt-4'>
                    <Alerts
                        AlertToggle = {AlertToggle}
                        AlertText = {AlertMessage}
                    />
                </div>
               
            </Form>
        </Modal.Body>   
        <Modal.Footer>
            <Button variant="primary" onClick={HandleSubmit}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>   
    )
}


export default EditBioModal;