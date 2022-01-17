import React , {useState} from "react";
import Menu from "./Menu"
import { Switch,Route,Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register"
import TranPage from "./TranPage"
import Dashboard from "./Dashboard"
import Passbook from "./Passbook"
import Alluser from "./Alluser";

export default () => {
    const [loggedinUser , setLoggedinUser] = useState();
    const [userPassbook , setUserPassbook] = useState();
    return (
        <div>
            <Menu></Menu>
            <Switch>

                <Route exact path="/Home">
                    <Home/>
                </Route>
                <Route exact path="/">
                    <Login setLoggedinUser={setLoggedinUser}/>
                </Route>
                <Route exact path="/Register">
                    <Register/>
                </Route>
                <Route exact path="/TranPage">
                    <TranPage loggedinUser = {loggedinUser}/>
                </Route>
                <Route exact path="/Dashboard">
                    <Dashboard loggedinUser = {loggedinUser} setLoggedinUser={setLoggedinUser} setUserPassbook = {setUserPassbook} />
                </Route>
                <Route exact path="/Passbook">
                    <Passbook loggedinUser = {loggedinUser} userPassbook = {userPassbook} />
                </Route>
                <Route exact path="/Alluser">
                    <Alluser/>
                </Route>

            </Switch>
        </div>
    )
}