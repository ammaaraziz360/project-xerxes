import { useEffect, useState, useReducer, react, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'
import { LoggedInContext } from './LoggedInContext';
import LoadingSpinner from './LoadingSpinner';
import UserList from './UserList';

const FollowersFollowingPage = ({type}) => {
    const {username} = useParams();  

    const [followers, setFollowers] = useState(null);
    const logged_in_state = useContext(LoggedInContext) 

    return(
        <div>
            {followers == null ? 
                <div className="profile-header p-4">
                    <div className="hr">
                        <h4>{type.charAt(0).toUpperCase() + type.slice(1)} for {username}</h4>
                    </div>
                    <div className='mt-3'>
                        <UserList user_info={{pfp:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", username:"ammaar_mohammed", bio:"hi everone i am making a user list hahahahah ahaa aaa aaaaa aaaaaa aaaa aaa aa aaa aaaaaaa hhh hhhhhaa", first_name:"Ammaar", last_name:"Mohammed"}}/>
                    </div>
                </div>
            :<LoadingSpinner/>}
        </div>
    )
}

export default FollowersFollowingPage;