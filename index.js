const express = require ("express");
let app = express();
let port = 8080;
const chat = require("./models/chat.js");
const mongoose = require("mongoose");
const methodOverride = require('method-override');


const path = require ("path");
const Chat = require("./models/chat.js");
app.set("views" , path.join(__dirname,"views"));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));


main().then(() => {
    console.log("Connections with Mongoose is established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}


app.listen(port,()=>{
    console.log(`Listening to port : ${port}`)
})

app.get("/", (req,res) => {
    res.send("Main Page is Working all fine !!");
})

//INDEX ROUTE
app.get("/chats" ,async (req,res) => {
    let chats = await chat.find();
    // console.log(chats); 
    res.render("index.ejs",{chats});  
})
// NEW CHAT ROUTE       
app.get("/chats/new",(req,res) => {
    res.render("new.ejs");
    // res.redirect("/chats");
})
// CREATE ROUTE 
app.post("/chats",(req,res)=>{
    let { from , to , msg} = req.body;
    let newChat = new chat({
        from : from,
        to : to,
        msg : msg,
        created_at : new Date()
    });
    newChat.save().then((res)=>{
        console.log("Chat is saved");
    }).catch((err)=>{
        console.log(err);
    })
    res.redirect("/chats");
})


app.get("/chats/:id/edit" , async (req,res)=>{
    let {id} = req.params;
    let foundchat = await chat.findById(id);
    res.render("edit.ejs",{foundchat});
})

app.put("/chats/:id" ,async (req,res) => {
    let {id} = req.params;
    let {msg : newMsg} = req.body;
    let updatedChat = await  chat.findByIdAndUpdate(id,{msg : newMsg}, { runValidators: true, new: true });
    console.log(newMsg);
    res.redirect("/chats");
})

app.delete("/chats/:id" , async (req,res) => {
    let {id} = req.params;
    let DeletedChat = await Chat.findByIdAndDelete(id);
    console.log(DeletedChat);
    res.redirect("/chats");
})


