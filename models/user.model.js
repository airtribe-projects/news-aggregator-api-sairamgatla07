const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

    name :{
        type: String,
        required:true, 
        trim:true

    },
    email:{
        type:String ,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    }, 
    password:{
        type:String , 
        required:true, 
    },
    preferences: {
        type: [String],
    default: []
    }
});

const User = mongoose.model("user", UserSchema);
module.exports = User ;