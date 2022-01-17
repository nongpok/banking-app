import axios  from "axios";
import React from "react";
import{ useState } from "react";
import { Redirect ,useHistory }  from "react-router-dom";
// import { Link } from "react-router-dom";
import "./Style.css";



function App(props) {
    let history = useHistory()

    const [name , setName] = useState("");
    const [password , setPassword] = useState("");
    const [loginInfo , setloginInfo] = useState("")


    const Login =  async() => {
      const  resp =  await axios.post("http://localhost:8000/api/v1/account/login", {
            name : name,
            password : password
        })
        console.log(resp)
        setloginInfo("user " + resp.data.name +  " login succefully")
        props.setLoggedinUser(resp.data.name)
        if(resp.data.name != "" )
        history.push('/Dashboard')
    }

    return(
        <div class="container">
        <div className="App">
        <div className="Login">
            <h1>Login here</h1>
            <input type="text" placeholder="name.." onChange={(e) =>{ setName(e.target.value); }}/>
            <input type="password" placeholder="password.."  onChange={(e) =>{ setPassword(e.target.value);}}/>
            <button className="btn btn-primary" onClick={Login}> Login </button>
            
        </div>
        

        <h1>{setloginInfo}</h1>
        </div>
        </div>
    )
}
   
    {/* <button onClick={handleSubmit} className="button-17" type="submit">Login</button> */}
                // <Link to="/Dashboard" className="btn btn-primary" >
                //     Login here
                // </Link>

                
export default App;