const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        userName : {
            type : String,
            required : [true, "Please add the user name"],
        },
        email : {
            type : String,
            required : [true, "Please add the user email address"],
            required : [true, "Email address already taken"],
        },
        password : {
            type : String,
            required : [true, "Please add the user password"],
        },
        role : {
            type : String,
            required : [true, "Please add the role of user"],
        }
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.model("User", userSchema);