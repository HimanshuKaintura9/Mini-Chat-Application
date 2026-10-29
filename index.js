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
app.get("/chats", async (req, res) => {
    try {
        const chats = await Chat.find().sort({ created_at: -1 });
        res.render("index.ejs", { chats });
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to load chats");
    }
});
// NEW CHAT ROUTE       
app.get("/chats/new",(req,res) => {
    res.render("new.ejs");
    // res.redirect("/chats");
})
// CREATE ROUTE 
app.post("/chats", async (req, res) => {
    try {
        let { from, to, msg } = req.body;

        await Chat.create({
            from,
            to,
            msg,
            created_at: new Date()
        });

        res.redirect("/chats");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to create chat");
    }
});


app.get("/chats/:id/edit" , async (req,res)=>{
    let {id} = req.params;
    let foundchat = await chat.findById(id);
    res.render("edit.ejs",{foundchat});
})

app.put("/chats/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let { msg: newMsg } = req.body;

        await Chat.findByIdAndUpdate(
            id,
            {
                msg: newMsg,
                $set: { updated_at: new Date() }
            },
            {
                runValidators: true,
                new: true
            }
        );

        res.redirect("/chats");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to update chat");
    }
});


app.delete("/chats/:id" , async (req,res) => {
    let {id} = req.params;
    let DeletedChat = await Chat.findByIdAndDelete(id);
    console.log(DeletedChat);
    res.redirect("/chats");
})


