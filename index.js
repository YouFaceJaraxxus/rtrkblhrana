const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json()
const cookieParser = require('cookie-parser');
app.use(jsonParser);
app.use(cookieParser());

app.use(express.static('rtrkblhrana-client/build'))

const foodRoute = require('./routes/food');
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
const defaultRoute = require('./routes/default');

app.use("/food", foodRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);



if(process.env.NODE_ENV==='production'){
    const path = require('path');
    app.use('*', defaultRoute)
}
  
const port = process.env.PORT || 3001;

app.listen(port,()=>{
    console.log(`Started on port ${port}`);
})
console.log('SERVER STARTED!')