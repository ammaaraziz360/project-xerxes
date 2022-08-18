import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { LoggedInContext } from '../LoggedInContext';
import LoadingSpinner from '../LoadingSpinner';
import CategoryHome from './CategoryHome';
import CategoryInfoPanel from './CategoryInfoPanel';
import PostEditor from '../PostEditor';
import Post from '../Post';

const Category = ({category_data, requester_profile}) => {
    const history = useHistory();
    const logged_in_state = useContext(LoggedInContext) 
    
    return(
        <div>
            <div className='row flex-lg-row flex-column-reverse'>
                <div className='col-lg-8 col-md-12  profile-header'>
                    <PostEditor category_id={category_data.category_info.category_id}/>
                    {category_data.posts.map((post, index) => {
                        return <Post post_info={post} loggedin_user_info={requester_profile} key={index}/>
                    })}
                </div>
                <div className='col-lg-4 col-md-12'>
                    <CategoryInfoPanel category_data={category_data}/>
                </div>
            </div>
        </div>
    )
}

export default Category;