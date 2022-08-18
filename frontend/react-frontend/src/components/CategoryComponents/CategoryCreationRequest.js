import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router';
import Cookies from 'universal-cookie'

import { LoggedInContext } from '../LoggedInContext';
import LoadingSpinner from '../LoadingSpinner';
import { InputGroup, FormControl, Button, Alert, Form } from 'react-bootstrap';
import ErrorAlert from '../ErrorAlert';

const cookie = new Cookies();

// regular expression to validate username

const CCRPage = () => {
    const {category_id} = useParams();  

    const history = useHistory();
    const logged_in_state = useContext(LoggedInContext) 

    const[AlertText, setAlertText] = useState({'message': '', 'style': 'danger'})
    const[AlertToggle, setAlertToggle] = useState(false)    
    
    const[category_data, setCategoryData] = useState(null)
    
    const [validated, setValidated] = useState(false);


    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/categories/${category_id}`, { 
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token'),
                'user_id': cookie.get('user_id'),
                'ip': sessionStorage.getItem('ip'),
                'user_agent': navigator.userAgent,
                'SID': cookie.get('SID')
            },
        }).then(res => {
            if (res.status === 200) {
                if(res.headers.get('X-JWT') != null) {
                    cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                }
                return res.json()
            }
            else if (res.status === 404) {
                history.push('/404')
            }
        }).then(data => {
            data.requester_profile === null ? history.push('/404') : setCategoryData(data.category_info)
        })

    } , [])


    function handleSubmit(e){
        const form = e.currentTarget;

        const body = {
            'parent_cat_id': category_data.category_id,
            'cat_name': form[0].value,
            'cat_desc': form[1].value,
            'request_details': form[2].value,
        }
        
        fetch(`http://127.0.0.1:5000/api/categories/category-request`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': cookie.get('token'),
                    'user_id': cookie.get('user_id'),
                    'ip': sessionStorage.getItem('ip'),
                    'user_agent': navigator.userAgent,
                    'SID': cookie.get('SID')
                },
                body: JSON.stringify(body)
            })
            .then(res => {
                if (res.status === 200) {
                    if(res.headers.get('X-JWT') != null) {
                        cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                    }
                    history.push(`/category/${category_data.category_id}`)
                } 
                else if (res.status === 401) {
                    history.push('/login')
                }
                else if (res.status === 400) {
                    return res.json();
                }
            })
            .then(data => {
                console.log(data.error)
                setAlertText({'message': data.error, 'style': 'danger'})
                setAlertToggle(true)
            })
            .catch(err => {
                console.log(err)
            })

        e.preventDefault();
    }


    return(
        <div className='profile-header'>
            {category_data != null ?
                <div className='ms-3 me-3 mt-3'>
                    <h1 className='hr p-2'>Category Creation Request for {category_data.category_name}</h1>

                    <Form className="mt-3 mb-3 post-elements" validated={validated} onSubmit={(e)=>handleSubmit(e)}>

                        <Form.Group controlId="cat-name">
                            <Form.Label><h5>Category Name</h5></Form.Label>
                            <Form.Control
                                type="text"
                                className='mb-3'
                                placeholder="Enter the name of your proposed category"
                                maxLength="30"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please choose a category name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="cat-desc">
                            <Form.Label><h5>Category Description</h5></Form.Label>
                            <Form.Control
                                type="text"
                                as="textarea"
                                className='mb-3'
                                placeholder="Give a brief description of this category. If your category gets approved, users will see this description."
                                maxLength="256"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Provide a description for your category.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="req-dets">
                            <Form.Label><h5>Request Details</h5></Form.Label>
                            <Form.Control
                                type="text"
                                as="textarea"
                                className='mb-3'
                                placeholder={`Provide any additional details about this category such as rules, moderation guidelines, and why this category relates to the ${category_data.category_name} category.`}
                                maxLength="256"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Provide details about your request.
                            </Form.Control.Feedback>
                        </Form.Group >
                        <ErrorAlert AlertToggle={AlertToggle} AlertText={AlertText}/>
                        <Button variant="primary" type="submit" >Submit</Button>
                    </Form>
                </div>
            : <LoadingSpinner/>}
        </div>
    )
}

export default CCRPage;  