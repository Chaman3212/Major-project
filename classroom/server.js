const express = require("express");
const app = express();
const session = require("express-session"); // ✅ Correct package name

const sessionOptions ={ secret: "mysecret",
     resave: false,
      saveUninitialized: true };

app.use(session(sessionOptions))

app.get("/register",(req,res) =>{
    let {name="anynomus"} = req.query;
    res.send(name);
});
app.get("/hello",(req,res)=>{
    res.send(`hello`)
})

app.get("/test", (req, res) => {
    res.send("Server is working!");
});

// app.get("/recount",(req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you send the request ${req.session.count} times`)
// })

app.listen(3000, () => {
    console.log("App is listening on port 3000");
});
