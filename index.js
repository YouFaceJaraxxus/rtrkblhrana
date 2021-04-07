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

app.use("/food", foodRoute);
app.use("/user", userRoute);




app.get('/', (req,res)=>{
    res.send(`
        <html>
            <body>
                <h1>Hello World, RTRK. </h1>
            </body>
        </html>
    `)
})

if(process.env.NODE_ENV==='production'){
    const path = require('path');
    app.get('/*',(req,res)=>{
      res.sendFile(path.resolve(__dirname, '../rtrkblhrana-client', 'build', 'index.html'))
    })
}
  
const port = process.env.PORT || 3001;

app.listen(port,()=>{
    console.log(`Started on port ${port}`);
})
console.log('SERVER STARTED!')