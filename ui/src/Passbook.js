import React, { useState } from "react";
import { CSVLink , CSVDownload} from "react-csv";
import axios, { Axios }  from "axios";

//this is DEMO data to test the export CSV file getting saved to system... 
const headers = [
    { label: "Name", key: "Name" },
    { label: "Balance", key: "Balance" },
    { label: "Password", key: "Password" }
  ];
  const data = [
    { Name: "ankit", Balance: 10000, Password: "abc" },
    { Name: "nonganba", Balance: 20000, Password: "pqr" },
    { Name: "faisal", Balance: 30000, Password: "lmn" },
    { Name: "asif", Balance: 40000, Password: "xyz" }
  ];
  const csvreport = {
    data: data,
    headers: headers,
    filename: 'Backend data.csv'
  };

export default function home(props) {
  console.log(props.userPassbook)
    return (
        <><div class="text-center">
            <h1>Welcome to Passbook page</h1>
            {props.userPassbook.map(t=>{
              return <li> {t.id} &nbsp; {t.name}&nbsp; {t.amount}&nbsp; {t.date}&nbsp;{t.type}</li>
            }) }
            <br />
        </div><div classname="App">
                {/* <CSVLink {...csvreport} class="button-30">Download data</CSVLink> */}
  
                {/* <CSVDownload data={props.userPassbook} target="_blank" > Download here </CSVDownload> */}
                <CSVLink  data={props.userPassbook} target="_blank" class="button-30">Download your data</CSVLink>

            </div></>
    )}
