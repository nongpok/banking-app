import React from "react";
import { NavLink } from "react-router-dom";
import "./Menu.css";

export default () => {
    return (
        <>
            <div class="topnav" id="myTopnav">
                <nav>
                    <NavLink exact to="/home">Home</NavLink>
                    <NavLink exact to="/">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                    {/* <NavLink to="/Dashboard">Dashboard</NavLink> */}
                </nav>
            </div>
        </>
    )
}