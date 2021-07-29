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

// regex for facebook
const fb_regex = /^(https?:\/\/)?(www\.)?(facebook\.com)\/(.*)/i;
// regex for twitter
const tw_regex = /^(https?:\/\/)?(www\.)?(twitter\.com)\/(.*)/i;
// regex for youtube
const yt_regex = /^(https?:\/\/)?(www\.)?(youtube\.com)\/(.*)/i;
// regex for instagram
const ig_regex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/(.*)/i;


const EditSocialsModal = ({EditSocials, SetEditSocials}) => {
    const [AlertToggle, setAlertToggle] = useState(false);
    const [AlertText, setAlertText] = useState('');
    const[disableButton, setDisableButton] = useState(true);
    const [input, setInput] = useState('');

    const [twitter_url, setTwitter_url] = useState('');
    const [facebook_url, setFacebook_url] = useState('');
    const [instagram_url, setInstagram_url] = useState('');
    const [youtube_url, setYoutube_url] = useState('');
    const [website_url, setWebsite_url] = useState('');

    if(EditSocials == false){
        return null;
    }

    const HandleSubmit = () => {
        if(facebook_url.trim().length > 0 && !facebook_url.match(fb_regex))
        {
            setAlertText({message: 'Please enter a valid Facebook profile URL', style: 'danger'});
            setAlertToggle(true);
            return;
        }
        else{
            setAlertToggle(false);
        }
        if(twitter_url.trim().length > 0 && !twitter_url.match(tw_regex))
        {
            setAlertText({message: 'Please enter a valid Twitter profile URL', style: 'danger'});
            setAlertToggle(true);
            return;
        }
        else{
            setAlertToggle(false);
        }
        if(instagram_url.trim().length > 0 && !instagram_url.match(ig_regex))
        {
            setAlertText({message: 'Please enter a valid Instagram profile URL', style: 'danger'});
            setAlertToggle(true);
            return;
        }
        else{
            setAlertToggle(false);
        }
        if(youtube_url.trim().length > 0 && !youtube_url.match(yt_regex))
        {
            setAlertText({message: 'Please enter a valid YouTube profile URL', style: 'danger'});
            setAlertToggle(true);
            return;
        }
        else{
            setAlertToggle(false);
        }
        if(website_url.trim().length > 0 && !website_url.match(/^(https?:\/\/)?(www\.)?(.)+/i))
        {
            setAlertText({message: 'Please enter a valid website URL', style: 'danger'});
            setAlertToggle(true);
            return;
        }
        else{
            setAlertToggle(false);
        }

        setDisableButton(false);
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
                            value = {twitter_url}
                            onChange = {(e) => {setTwitter_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaFacebookF/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value = {facebook_url}
                            onChange = {(e) => {setFacebook_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaYoutube/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value = {youtube_url}
                            onChange = {(e) => {setYoutube_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaInstagram/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value = {instagram_url}
                            onChange = {(e) => {setInstagram_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><BsLink45Deg/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value = {website_url}
                            onChange = {(e) => {setWebsite_url(e.target.value)}}
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
            <Button variant="primary" onClick={HandleSubmit}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>   
    )
}

export default EditSocialsModal;