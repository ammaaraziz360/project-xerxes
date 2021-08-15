import { Modal } from 'react-bootstrap';
import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import Alerts from './ErrorAlert';
import { LoggedInContext } from './LoggedInContext';


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

const cookies = new Cookies();

const EditSocialsModal = ({EditSocials, SetEditSocials, userInfo, refreshProfile, setRefreshProfile}) => {
    const history = useHistory();

    const [AlertToggle, setAlertToggle] = useState(false);
    const [AlertText, setAlertText] = useState('');
    const[disableButton, setDisableButton] = useState(true);
    const [input, setInput] = useState(false);

    const [twitter_url, setTwitter_url] = useState('');
    const [facebook_url, setFacebook_url] = useState('');
    const [instagram_url, setInstagram_url] = useState('');
    const [youtube_url, setYoutube_url] = useState('');
    const [website_url, setWebsite_url] = useState('');

    const logged_in_state = useContext(LoggedInContext)

    useEffect(() => {
        setTwitter_url(userInfo.twitter_url);
        setFacebook_url(userInfo.facebook_url);
        setInstagram_url(userInfo.instagram_url);
        setYoutube_url(userInfo.youtube_url);
        setWebsite_url(userInfo.website_url);

        var urls = [twitter_url, facebook_url, instagram_url, youtube_url, website_url];
        var setters = [setTwitter_url, setFacebook_url, setInstagram_url, setYoutube_url, setWebsite_url];
        for (var i = 0; i < urls.length; i++) {
            if (urls[i] == 'no_link') {
                setters[i]("");
            }
        }

    }, [EditSocials])

    if(EditSocials == false){

        return null;
    }


    const HandleSubmit = () => {
        if(facebook_url.trim().length > 0 && !facebook_url.match(fb_regex))
        {
            console.log(facebook_url);
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

        var socials = {
            twitter: twitter_url.trim(),
            facebook: facebook_url.trim(),
            instagram: instagram_url.trim(),
            youtube: youtube_url.trim(),
            website: website_url.trim()
        };

        
        for (const key in socials) {
            if (socials[key].trim().length == 0) {
                socials[key] = "no_link";
            }
        }

        fetch('http://127.0.0.1:5000/api/users/socials', { 
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookies.get('token'),
                'user_id': cookies.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookies.get('SID')
            },
            body: JSON.stringify(socials)
        }).then(response => {
            if(response.status == 200){
                if(response.headers.get('X-JWT') != null) {
                    cookies.set('token', response.headers.get('X-JWT'), {path: '/'})
                }
                setAlertText({message: 'Your social links have been updated', style: 'success'});
                setAlertToggle(true);
                setRefreshProfile(!refreshProfile);
            }
            else if (response.status == 401){
                sessionStorage.setItem('logged_in', 'false');
                logged_in_state.setIsLoggedIn(false);
                history.push('/login');
            }
            else{
                setAlertText({message: 'Error editing socials', style: 'danger'});
                setAlertToggle(true);
            }
            return response.json();
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        })
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
                            defaultValue = {twitter_url}
                            onChange = {(e) => {setTwitter_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaFacebookF/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            defaultValue = {facebook_url}
                            onChange = {(e) => {setFacebook_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaYoutube/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            defaultValue = {youtube_url}
                            onChange = {(e) => {setYoutube_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaInstagram/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            defaultValue = {instagram_url}
                            onChange = {(e) => {setInstagram_url(e.target.value)}}
                            />
                    </InputGroup>
                    <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><BsLink45Deg/></InputGroup.Text>
                            <FormControl
                            placeholder="Enter URL"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            defaultValue = {website_url}
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