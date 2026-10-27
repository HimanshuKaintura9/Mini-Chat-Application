const mongoose = require("mongoose");

main().then(() => {
    console.log("Coneections with Mongoose is established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

const chat = require("./models/chat.js");

chat.insertMany([
    {
    from : "neha",
    to : "sania",
    msg : "Hello how are you ?",
    created_at : new Date()
    },
    {
    from : "harshit",
    to : "krishna",
    msg : "How long will it take to reach there ?",
    created_at : new Date()
    },
    {
    from : "Ayush",
    to : "Kritika",
    msg : "WHich restraunt is better in these 2?",
    created_at : new Date()
    },
    {
    from : "Ashok",
    to : "Tania",
    msg : "Hope we will meet again soon",
    created_at : new Date()
    },
    {
    from : "Manav",
    to : "Rushi",
    msg : "We will got these next week",
    created_at : new Date()
    },
])
