import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Parse from '../service/parse'
import { toast } from 'react-toastify';
import { MoonLoader } from "react-spinners";

const Login = () => {
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
        const currentUser=Parse.User.current();
        if(currentUser){
            navigate('/todo')
        }
    },[])
    const [credentials,setCredentials]=useState({
        username:"",
        password:"",
    })
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setCredentials({
            ...credentials,
            [name]:value
        })
    }
    const handleClick=async()=>{
      
        try {
            setLoading(true)
            const response=await Parse.User.logIn(credentials.username,credentials.password)
            console.log(response);
            toast.success('LoggedIn successfully')
            navigate('/todo')
            
        } catch (error) {
            toast.error('Error doing Login')
            console.log('error doing signup',error);
            
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className='container-fluid bgc-div d-flex align-items-center justify-content-center' style={{height:"100vh", width:"100vw"}}>
        <div className='d-flex align-items-center justify-content-center flex-column text-white gap-2 media-container'>
            <h1 className='w-100 d-flex align-items-center justify-content-center'>Login</h1>
            <label className='w-100' htmlFor="email">Username</label>
            <input className='w-100 rounded px-3 py-2 border-0' name='username' type="email" placeholder='rahul' onChange={handleChange} />
            <label className='w-100' htmlFor="password">Password</label>
            <input className='w-100 rounded px-3 py-2 border-0' name='password' type="text" placeholder='*********' onChange={handleChange}/>
            <button className='w-100 rounded px-3 py-2 border-0 my-3 text-white d-flex align-items-center justify-content-center gap-2' style={{backgroundColor:"black"}} onClick={handleClick} disabled={loading}>
                 {loading && <MoonLoader size={15} color="white"/>}
                Login</button>
            <p>Don't have an account? Please <Link to="/signup">Signup</Link></p>
        </div>
    </div>
  )
}

export default Login