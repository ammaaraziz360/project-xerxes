import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { LoggedInContext } from '../LoggedInContext';
import LoadingSpinner from '../LoadingSpinner';
import SmallCategoryList from './SmallCategoryList';
import SubscribeButton from './SubscribeButton';
import { Button } from 'react-bootstrap';


const CategoryInfoPanel = ({category_data}) => {
    const history = useHistory();
    const logged_in_state = useContext(LoggedInContext) 
    
    const cat_info = category_data.category_info
    const cat_child = category_data.child_categories
    const cat_mods = category_data.moderators
    const rules = category_data.rules

    return(
        <div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 align-content-center'>
                    <div className='col-2'>
                        <img  src={cat_info.category_pfp_url} alt="avatar" className="img-fluid d-inline pfp-small" />
                    </div>
                    <div className='col-10'>
                        <h2 className='pb-2'>{cat_info.category_name}</h2>
                        <h5 className='muted'>{cat_info.category_desc}</h5>
                        <p className='muted'>{cat_info.subscribers} subscribers</p>
                        <SubscribeButton category_info={cat_info} />
                    </div>
                </div>
            </div>
            {cat_info.is_moderator ?
                <div className='full-border profile-header mt-2'>
                    <div className='d-flex row p-3 justify-content-end'>
                        <div className='col-12'>
                            <h4 className='p-2 muted'>Moderator Tools</h4>
                                <Button className="ms-2">Moderator Dashboard</Button>
                        </div>
                    </div>
                </div>
            : null}
            {cat_info.parent_category_id  != null ?
                <div className='full-border profile-header mt-2'>
                    <div className='d-flex row p-3 justify-content-end'>
                        <div className='col-12'>
                            <h4 className='p-2 muted'>Parent Category</h4>
                            <SmallCategoryList category_info={[{category_pfp_url: cat_info.parent_category_pfp_url, category_id: cat_info.parent_category_id, category_name: cat_info.parent_category_name}]} />
                        </div>
                    </div>
                </div>
            : null}
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 justify-content-end'>
                    <div className='col-12'>
                        <h4 className='p-2 muted'>{cat_info.category_name} Rules</h4>
                        {rules.map((rule, index) => {
                            return(
                                <div className='m-2 mt-3 hr' key={index}>
                                    <h5>{rule.rule_title}</h5>
                                    <p className='muted'>{rule.rule_details}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 justify-content-end'>
                    <div className='col-12'>
                        <h4 className='p-2 muted'>Children Categories</h4>
                        <SmallCategoryList category_info={cat_child} />
                    </div>
                </div>
            </div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 justify-content-end'>
                    <div className='col-12'>
                        <h4 className='p-2 muted'>Moderators</h4>
                        {cat_mods.map((mod, index) => {
                            return(
                                <div className='m-2 mt-3 hr' key={index}>
                                    <p className=''>@{mod.username}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='full-border profile-header mt-2'>
                <div className='d-flex row p-3 justify-content-end'>
                    <div className='col-12'>
                        <h4 className='p-2 muted'>Requests</h4>
                        <Button className="ms-2">Create a Child Category</Button>
                        <Button className="ms-2 mt-2">Become a Moderator</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryInfoPanel;