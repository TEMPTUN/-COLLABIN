import React, { use, useState } from 'react'
import style from './profile.module.scss'
import {useDispatch, useSelector} from 'react-redux';
import { useRouter } from 'next/router';
import { reset } from '../../redux_feature/UserInfo/userSlice';

const UserProfile = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const[openBar,setOpenBar] = useState(false);
    const[content,setContent] = useState("about");

    const handleLogout = ()=>{
        localStorage.removeItem("userId");
        dispatch(reset());
        router.push("/signin");
    }
    
  return (
    <div className={style.frame}>
        <div className={style.upperCont}>
           <div className={style.userHeader}> 
                <span>{user.name}</span>
                <img onClick={()=>setOpenBar(!openBar)}src='/images/humburger.svg' style={{cursor:"pointer"}}></img>
                {openBar===true && 
                    <div className={style.logout}>
                        <button onClick={()=>handleLogout()}>logout</button>
                    </div>
                }
           </div>
           <div className={style.about}>
                {user.image!==null? <img src={user.image}></img>:<img src={'/images/user.svg'}></img> }
                <div><p>{user.bio}loreum ipsum mpifj ofohufui  uofhsflkfjr lefrrgio irefh ileuos loifh oiodfsh</p></div>
           </div>
            <div className={style.social}>
                <div className={style.section}>
                    <p>{user.PostId.length}</p>
                    <span>Posts</span>
                </div>
                <div className={style.section}>
                    <p>{90}</p>
                    <span>Follower</span>
                </div>
                <div className={style.section}>
                    <p>{user.friendId.length}</p>
                    <span>Following</span>
                </div>
                
            </div>
            <div className={style.toggle}>
                <button style={{background:content==='about'?"rgba(79, 79, 79, 0.1)":"none"}} onClick={()=>setContent("about")}>About</button>
                <span style={{color:"#FF955B"}}>|</span>
                <button style={{background:content==='posts'?"rgba(79, 79, 79, 0.1)":"none"}} onClick={()=>setContent("posts")}>Posts</button>
            </div>
        </div>
        {
            content==="posts" && (
                <div className={style.LowerCont}>
                    <div className={style.postCont}>
        
                    </div>
                    <div className={style.postCont}>
        
                    </div>
                    <div className={style.postCont}>
        
                    </div>
                    <div className={style.postCont}>
        
                    </div>
                    <div className={style.postCont}>
        
                    </div>
                    <div className={style.postCont}>
        
                    </div>
                </div>
            )
        }
        {
            content==='about'&&(
            <div>
                about
            </div>)
        }
       
    </div>
  )
}

export default UserProfile