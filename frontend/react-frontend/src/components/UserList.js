import { useEffect, useState, useReducer, react, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'
import { LoggedInContext } from './LoggedInContext';
import LoadingSpinner from './LoadingSpinner';
import FollowButton from './FollowButton';

const UserList = ({ user_info }) => {
    return (
        <div className="full-border">
            <div className="row p-3">
                <div className="col-2">
                    <img src={user_info.pfp} className="img-fluid d-inline pfp-small" alt="user image"/>
                </div>
                <div className="col-6">
                    <h5>{user_info.first_name} {user_info.last_name}</h5>
                    <div className="muted">
                        @{user_info.username}
                    </div>
                </div>
                <div className="d-flex col-4 justify-content-end align-items-center">
                    <FollowButton userProfile={user_info}/>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-2"></div>
                <div className="col-8 mt-2">
                    {user_info.bio}
                </div>
                <div className="col-2">

                </div>
            </div>
        </div>
    )
}

export default UserList;