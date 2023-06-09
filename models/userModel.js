const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, "User must have a username"],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "User must have a password"],
    },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
