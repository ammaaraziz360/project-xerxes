import { useEffect, useState, useReducer, react, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import Cookies from 'universal-cookie'
import { LoggedInContext } from './LoggedInContext';
import LoadingSpinner from './LoadingSpinner';
import UserList from './UserList';
import { Button } from 'react-bootstrap';

import {AiOutlineHome, AiOutlineClose} from 'react-icons/ai';
import {BsPeople} from 'react-icons/bs';
import { RiLeafLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import {FiSettings} from 'react-icons/fi';
import {GiHamburgerMenu} from 'react-icons/gi';
import {VscEyeClosed} from 'react-icons/vsc';
const cookie = new Cookies();

const SideBar = () => {
    const {username} = useParams();  

    const [followers, setFollowers] = useState(null);
    const logged_in_state = useContext(LoggedInContext) 

    const history = useHistory();

    const[ShowSideBar, setShowSideBar] = useState(true);

    return(
        <div className='vh-100 sticky'>
            {ShowSideBar ?
            <div className='row flex-row h-50 center m-0'>
                <div className='col-12 btn-group-vertical'>
                    <Button size="lg"><AiOutlineHome /><div>Home</div></Button>
                    <Button size="lg"><BsPeople/><div>Explore</div></Button>
                    <Button size="lg" onClick={()=>history.push('/category/home')}><RiLeafLine/><div>Categories</div></Button>
                    {logged_in_state.isLoggedIn ? 
                    <Button size="lg" onClick={()=>history.push(`/user/${cookie.get('user_id')}`)}><CgProfile/><div>Profile</div></Button>
                    : null}
                    {logged_in_state.isLoggedIn ? 
                    <Button size="lg"><FiSettings/><div>Settings</div></Button>
                    : null}
                    <Button size="lg" onClick={()=>setShowSideBar(false)}><AiOutlineClose/></Button>
                </div>
            </div>
            :   <div className="">
                    <Button size="lg" onClick={() => setShowSideBar(true)}><GiHamburgerMenu /></Button>
                </div>
            }
        </div>
    )
}

export default SideBar;