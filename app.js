
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;


app.use(express.urlencoded({ 'extended' : true}));
app.use(express.json());
app.use(cors());


app.get('/', (req, res)=>{
    res.send('<h1>Welcome to Banking App</h1>')
});


app.listen(port, function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("Server is up and running on port : " + port);
});