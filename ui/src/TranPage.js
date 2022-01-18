import React, { useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
// import { CSVLink } from "react-csv";

//this is DEMO data to test the export CSV file getting saved to system...
// const headers = [
//     { label: "Name", key: "Name" },
//     { label: "Balance", key: "Balance" },
//     { label: "Password", key: "Password" }
//   ];
//   const data = [
//     { Name: "ankit", Balance: 10000, Password: "abc" },
//     { Name: "nonganba", Balance: 20000, Password: "pqr" },
//     { Name: "faisal", Balance: 30000, Password: "lmn" },
//     { Name: "asif", Balance: 40000, Password: "xyz" }
//   ];
//   const csvreport = {
//     data: data,
//     headers: headers,
//     filename: 'Apna backend ka data.csv'
//   };
/* <>
<li> Name: "ankit", Balance: 10000, Password: "abc"   </li>
<li>  Name: "nonganba", Balance: 20000, Password: "pqr"   </li>
<li> Name: "faisal", Balance: 30000, Password: "lmn"  </li>
<li> Name: "asif", Balance: 40000, Password: "xyz"   </li></> */

export default (props) => {

    let history = useHistory();

    if(!props.loggedinUser) {
        history.push('/');
    }
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("");
    // const name = "Asif";
    const url = `http://localhost:8000/api/v1/account/${props.loggedinUser}/transaction`;

    const proceedButtonHandler = async (e) => {
        e.preventDefault();
      const resp =  await Axios.post(url,{
            name: name,
            amount: amount,
            transactionType: transactionType
        })
        // console.log(props.name)
        // setName(resp.data.name)
        // console.log(name);
        console.log(amount);
        console.log(transactionType);

        alert("transaction si done!!!");
    };

    return (
        <>
            <div class="text-center">
                <h1>Welcome to Transacation Data</h1>
            </div>
            {/* <div classname="App">
                <CSVLink {...csvreport} class="button-30">
                    Download your data
                </CSVLink>
            </div> */}
            {/* <label>
                <p>Name</p>
                <input type="text"
                onChange={e => setName
                (e.target.value)} value={name} required />
            </label> */}
            <label>
                <p>Amount</p>
                <input type="number"
                onChange={e => setAmount
                (e.target.value)} value={amount} required />
            </label>
            <br />
            <br />
            <div>
                <input type="radio" name="radio" onChange={e => setTransactionType(e.target.defaultValue)} value={"deposit"} /> Deposit
                <input type="radio" name="radio" onChange={e => setTransactionType(e.target.defaultValue)} value={"withdraw"} /> Withdraw
                <br />
                <br />
            </div>
            <button
                className="button-30"
                type="submit"
                onClick={proceedButtonHandler}
            >
                Proceed
            </button>
        </>
    );
};
