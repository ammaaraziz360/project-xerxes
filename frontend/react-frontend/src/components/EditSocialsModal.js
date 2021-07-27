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

const EditSocialsModal = ({EditSocials, SetEditSocials}) => {
    const [AlertToggle, setAlertToggle] = useState(false);
    const [AlertText, setAlertText] = useState('');
    const[disableButton, setDisableButton] = useState(false);
    const [input, setInput] = useState('');

    const [twitter_url, setTwitter_url] = useState('');
    const [facebook_url, setFacebook_url] = useState('');
    const [instagram_url, setInstagram_url] = useState('');
    const [youtube_url, setYoutube_url] = useState('');
    const [website_url, setWebsite_url] = useState('');

    if(EditSocials == false){
        return null;
    }

    return (
        <Modal animation={false} backdrop="static" show={EditSocials} keyboard={false} onHide={() => SetEditSocials(!EditSocials)}>
        <Modal.Header>
        <Modal.Title>Enter Social Links</Modal.Title>
        <Button variant="primary" onClick={()=> SetEditSocials(!EditSocials)}>
                <CgClose />
            </Button>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaTwitter/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaFacebookF/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaYoutube/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaInstagram/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><BsLink45Deg/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            />
                    </InputGroup>
                </Form.Group>

                
                <div className='mt-4'>
                    <Alerts
                        AlertToggle = {AlertToggle}
                        AlertText = {AlertText}
                    />
                </div>
               
            </Form>
        </Modal.Body>   
        <Modal.Footer>
            <Button disabled={disableButton} variant="primary">
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>   
    )
}

export default EditSocialsModal;