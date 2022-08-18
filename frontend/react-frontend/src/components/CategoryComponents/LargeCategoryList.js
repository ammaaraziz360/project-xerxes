import { useEffect, useState, useReducer, react, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { LoggedInContext } from '../LoggedInContext';

import Cookies from 'universal-cookie'

var cookie = new Cookies();

const LargeCategoryList = ({ category_info }) => {

    const logged_in_state = useContext(LoggedInContext) 

    const history = useHistory();

    return (
        <div>
        {category_info.length == 0 ? !logged_in_state.logged_in_state ? <h5 className='mt-2'>Log in to view categories</h5> : <h5>No categories</h5> :
            category_info.map((category) => {
                return (
                    <div className="full-border mt-2" key={category.category_id} onClick={()=>history.push(`/category/${category.category_id}`)}>
                        <div className="row p-3">
                            <div className="col-2">
                                <img src={category.category_pfp_url} className="img-fluid d-inline pfp-small" alt="user image"/>
                            </div>
                            <div className="col-6">
                                <h5>{category.category_name}</h5>
                                <div className="">
                                    {category.category_desc}
                                </div>
                                <div className="muted">
                                    {category.subscribers} Subscribers
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}

export default LargeCategoryList;