const express = require('express');
const app = express();

function validator(req,res,next){
   //res.local.valiate = true;
   console.log('i am working');
   next();
}

app.get('/',validator,(req,res)=>{
    res.send('ok');
})

app.listen(3000);