import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            DataisLoaded: false,
        };
    }

    componentDidMount() {
        fetch("http://localhost:8000/api/v1/account/users")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    items: json,
                    DataisLoaded: true,
                });
            });
    }
    render() {
        const { DataisLoaded, items } = this.state;
        if (!DataisLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>{" "}
                </div>
            );

        return (
            <>
                <div className="App">
                    <h1> Fetched data </h1>{" "}
                    {items.map((item) => (
                        <ol key={item.id}>
                            name: {item.name}, balance: {item.balance}
                            {/* password: { item.password } */}
                        </ol>
                    ))}
                </div>

                {/* <div classname="App">
                    <CSVLink {...csvreport} class="button-30">Download data</CSVLink>
                </div> */}
            </>
        );
    }
}

export default App;

{
    /* <div>
<button className="button-30" onClick={getUsers}>Show Users</button>
</div> */
}
