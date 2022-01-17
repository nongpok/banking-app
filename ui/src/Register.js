import React, { useState, useRef } from "react";
import Axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

import "./Style.css";
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

export default function Login() {
    const [name, setName] = useState();
    const [balance, setBalance] = useState();
    const [password, setPassword] = useState();
    const url = "http://localhost:8000/api/v1/account/registration"

    // const initialValues = {name:"",balance:"",password:""}
    // const [formValues, setFormValues] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(name && balance && password) {
            Axios.post(url,{
                name: name,
                balance: balance,
                password: password
            })
            alert("Your data is submitted")
        }
        else {
            alert("Field must not be empty");
        }
    }
    return (
        <>
        <body>
            <form>
            <div class="container">
                <h1>Sign up</h1>
                <label>
                    <p>Name</p>
                    <input type="text" placeholder="Enter name"
                    onChange={e => setName(e.target.value)} 
                    value={name} required />
                </label>
                <br/>
                <label>
                    <p>Balance</p>
                    <input type="text" placeholder="Enter balance"
                    onChange={e => setBalance(e.target.value)} 
                    value={balance} required />
                </label>
                <br/>
                <label>
                    <p>Password</p>
                    <input type="password" placeholder="Enter password"
                    onChange={e => setPassword(e.target.value)} 
                    value={password} required />
                </label>
                <br/><br/>

                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>
                
            </div>
            </form>
        </body>
        </>)}
// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
// }