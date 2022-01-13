import { useEffect, useState, useReducer, react, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { LoggedInContext } from '../LoggedInContext';

import Cookies from 'universal-cookie'

var cookie = new Cookies();

const SmallCategoryList = ({ category_info }) => {

    const logged_in_state = useContext(LoggedInContext) 
    const history = useHistory();

    return (
        <div>
            {category_info.length > 0 ? 
            category_info.map((category) => {
                return (
                    <div className="full-border mt-2" key={category.category_id} onClick={()=>{history.push(`/category/${category.category_id}`); history.go(0)}}>
                        <div className="row p-3 align-content-center">
                            <div className="col-2">
                                <img src={category.category_pfp_url} className="img-fluid d-inline pfp-small" alt="user image"/>
                            </div>
                            <div className="col-6">
                                <h5>{category.category_name}</h5>
                            </div>
                        </div>
                    </div>
                )
            })
            : <div className="ms-2 muted">No children categories, create a request to create one.</div>}
        </div>
    )
}

export default SmallCategoryList;