const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ['Mess', 'Student'], // Only allow Mess or Student as roles
      },
      messNumber: {
        type: String,
        required: function () { return this.role === 'Mess'; }, // Only required if role is Mess
      },
      hostelNumber: {
        type: String,
        required: function () { return this.role === 'Student'; }, // Only required if role is Student
      },
      roomDetails: {
        type: String,
        required: function () { return this.role === 'Student'; }, // Only required if role is Student
      },
      rollNumber: {
        type: String,
        required: function () { return this.role === 'Student'; }, // Only required if role is Student
      },
    }, {
      timestamps: true,
})

module.exports = mongoose.model("User",userSchema);