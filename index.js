const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const jsonParser = bodyParser.json()
const cookieParser = require('cookie-parser');
app.use(jsonParser);
app.use(cookieParser());


const loginRoute = require('./routes/login');
const foodRoute = require('./routes/food');
const userRoute = require('./routes/user');

app.use("/login", loginRoute);
app.use("/food", foodRoute);
app.use("/user", userRoute);


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});



app.get('/', (req,res)=>{
    res.send(`
        <html>
            <body>
                <h1>Hello World, RTRK. </h1>
            </body>
        </html>
    `)
})




const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Started on port ${port}`);
})
console.log('SERVER STARTED!')