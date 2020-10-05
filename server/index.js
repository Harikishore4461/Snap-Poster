const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const router = require("./router")
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json({limit:'50mb'}));
app.use('/',router)
// app.get('/',(req,res)=>{
//     res.send("hello world")
// })
app.listen(4200,()=> console.log("server runs on 4200"))