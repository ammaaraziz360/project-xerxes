import { useEffect, useState, useReducer, react, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'
import { LoggedInContext } from './LoggedInContext';
import LoadingSpinner from './LoadingSpinner';
import FollowButton from './FollowButton';

var cookie = new Cookies();

const UserList = ({ user_info }) => {
    const history = useHistory();

    return (
        <div className="full-border mt-2" onClick={()=>history.push(`/user/${user_info.user_id}`)}>
            <div className="row p-3">
                <div className="col-2">
                    <img src={user_info.pfp_url} className="img-fluid d-inline pfp-small" alt="user image"/>
                </div>
                <div className="col-6">
                    <h5>{user_info.first_name} {user_info.last_name}</h5>
                    <div className="muted">
                        @{user_info.username}
                    </div>
                    {user_info.bio}
                </div>
                { user_info.OwnAccount == 0 ?
                    <div className="d-flex col-4 justify-content-end align-items-center">
                        <FollowButton userProfile={user_info}/>
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

export default UserList;