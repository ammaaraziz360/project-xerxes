import { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import {useHistory } from 'react-router';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


const BlankModal = ({toggleModal, setToggleModal, text}) => {

    if(toggleModal == false){
        return null
    }

    return(
        <Modal show={toggleModal} onHide={() => setToggleModal(false)} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>{text.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{text.body}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setToggleModal(false)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
    )
}

export default BlankModal;