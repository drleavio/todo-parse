import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Parse from '../service/parse'
import { toast } from 'react-toastify';

const SignUp = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        const currentUser=Parse.User.current();
        if(currentUser){
            navigate('/todo')
        }
    },[])
    
    const [credentials,setCredentials]=useState({
        username:"",
        email:"",
        password:"",
    })
    const [loading,setLoading]=useState(false);
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setCredentials({
            ...credentials,
            [name]:value
        })
    }
    const handleClick=async()=>{
        const user=new Parse.User();
        user.set('username',credentials.username);
        user.set("email",credentials.email)
        user.set('password',credentials.password)
        try {
            setLoading(true)
            const response=await user.signUp();
            toast.success('SignUp successhully')
            navigate('/')
            console.log(response.attributes.sessionToken);
            
        } catch (error) {
            toast.error('Error doing Signup')
            console.log('error doing signup',error);
            
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className='container-fluid bgc-div d-flex align-items-center justify-content-center' style={{height:"100vh", width:"100vw"}}>
        <div className='d-flex align-items-center justify-content-center flex-column text-white gap-2 media-container'>
            <h1 className='w-100 d-flex align-items-center justify-content-center'>SignUp</h1>
            <label className='w-100' htmlFor="email">Username</label>
            <input className='w-100 rounded px-3 py-2 border-0' name='username' type="text" placeholder='rahul' onChange={handleChange} />
            <label className='w-100' htmlFor="email">Email</label>
            <input className='w-100 rounded px-3 py-2 border-0' name='email' type="email" placeholder='abc@xyz.com' onChange={handleChange} />
            <label className='w-100' htmlFor="password">Password</label>
            <input className='w-100 rounded px-3 py-2 border-0' name='password' type="text" placeholder='*********' onChange={handleChange}/>
            <button className='w-100 rounded px-3 py-2 border-0 my-3 text-white' style={{backgroundColor:"black"}} onClick={handleClick} disabled={loading}>Login</button>
            <p>Already have an account? Please <Link to="/">Login</Link></p>
        </div>
    </div>
  )
}

export default SignUp;