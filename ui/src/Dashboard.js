import axios from "axios";
import React from "react";
import { Link , Redirect, useHistory } from "react-router-dom";

export default function Dashboard(props) {
    
    let history = useHistory()

    if(!props.loggedinUser) {
        history.push('/');
    }
    
    const logoutHandler = (e) => {
        e.preventDefault();
        props.setLoggedinUser("")
        history.push('/');
    }
    const getTransactionHandler = async(e) =>{
        const resp = await axios.get(`http://localhost:8000/api/v1/account/${props.loggedinUser}/passbook`)
        console.log(resp)
        props.setUserPassbook(resp.data)
        history.push('/Passbook');
    }

    return (
        <>
            <>
                <div class="text-center">
                    <h1>Welcome to Dashboard</h1>
                </div>
                <div className="btns">
                    <button onClick={getTransactionHandler} className="button-30"> Passbook </button>
                    <br />
                    <div>
                        {/* <Link to="/Alluser" className="button-30" >{" "}Get All user list{" "} </Link> */}
                    </div>
                    <br />
                </div>
            </>
            <div>
                {/* <button className="button-30" onClick={tracsactionHandler}>Transaction page</button> */}
                <Link to="/TranPage" className="button-30" >{" "}
                    Transaction Page{" "}
                </Link>
                {/* <Link to="/" className="button-17">Log out</Link> */}
                <button className="button-30" onClick={logoutHandler}> logout</button>
                <br />
            </div>
        </>
    );
    function popMsg() {
        alert("Your balance is..!");
        //alter {balance} table
    }
}
