import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { LoggedInContext } from '../LoggedInContext';
import LoadingSpinner from '../LoadingSpinner';
import CategoryHome from './CategoryHome';

const CategoryHomePage = () => {
    const history = useHistory();
    const cookie = new Cookies();
    const logged_in_state = useContext(LoggedInContext) 

    const [CategoryHomeData, setCategoryHomeData] = useState(null)

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/categories`, {
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
            })
            .then(res => {
                if (res.status === 200) {
                    if(res.headers.get('X-JWT') != null) {
                        cookie.set('token', res.headers.get('X-JWT'), {path: '/'})
                    }
                    return res.json();
                } 
                else{
                    history.push('/404')
                }
            })
            .then(data => {
                setCategoryHomeData(data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [])
        
    return(
        <div className="container">
            <div className="profile-header p-4">
                { CategoryHomeData != null ? <CategoryHome category_data={CategoryHomeData}/>
                : <LoadingSpinner/>}
            </div>
        </div>
    )
}

export default CategoryHomePage;