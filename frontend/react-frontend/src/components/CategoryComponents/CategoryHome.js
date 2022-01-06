import { useEffect, useState, useReducer, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router';
import Cookies from 'universal-cookie'
import React from 'react';
import { LoggedInContext } from '../LoggedInContext';
import LoadingSpinner from '../LoadingSpinner';
import { Button } from 'react-bootstrap';
import LargeCategoryList from './LargeCategoryList';

const CategoryHome = ({category_data}) => {
    const history = useHistory();
    const cookie = new Cookies();
    const [ExploreCategory, setExploreCategory] = useState(true)
    const [Subscriptions, setSubscriptions] = useState(false)
    const [YourCategories, setYourCategories] = useState(false)
    const [Requests, setRequests] = useState(false)

    function ToggleButton(e){
        switch(e.target.id){
            case "expl":
                setExploreCategory(true)
                setSubscriptions(false)
                setYourCategories(false)
                setRequests(false)
                break;
            case "subs":
                setExploreCategory(false)
                setSubscriptions(true)
                setYourCategories(false)
                setRequests(false)
                break;
            case "cats":
                setExploreCategory(false)
                setSubscriptions(false)
                setYourCategories(true)
                setRequests(false)
                break;
            case "reqs":
                setExploreCategory(false)
                setSubscriptions(false)
                setYourCategories(false)
                setRequests(true)
                break;
        }
    }

    return(
        <div>
            <div className="hr pb-3">
                <h1>Categories</h1>
                <div>
                    <Button id="expl" className={ExploreCategory ? "bg-light text-dark" : ""} onClick={(e) => ToggleButton(e)}>Explore</Button> 
                    <Button id="subs" className={Subscriptions ? "bg-light text-dark" : ""} onClick={(e) => ToggleButton(e)}>Subscriptions</Button> 
                    <Button id="cats" className={YourCategories ? "bg-light text-dark" : ""} onClick={(e) => ToggleButton(e)}>Your Categories</Button> 
                    <Button id="reqs" className={Requests ? "bg-light text-dark" : ""} onClick={(e) => ToggleButton(e)}>Requests</Button> 
                </div>
            </div>
            <div>
                {ExploreCategory ? 
                    <LargeCategoryList category_info={category_data.categories}/>
                : null}
                {Subscriptions ? 
                    <LargeCategoryList category_info={category_data.subscriptions}/>
                : null}
                {YourCategories ? 
                    <LargeCategoryList category_info={category_data.moderates}/>
                : null}
                {Requests ? 
                    <h2>Requests</h2>
                : null}
            </div>
        </div>
       )
}

export default CategoryHome;