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
      image:{
        type:String,
        required:true
      },
      bill: {
        type: Number,
        default: function () {
          return this.role === 'Student' ? 0 : undefined; // Default bill to 0 for Students
        },
      },
      // history: {
      //   type: [Object],
      //   default: [], // Default to an empty array for Students
      // },
      history: [{
        action: {
          type: String, 
          required: true
        },
        date: {
          type: Date,
          default: Date.now, // Default to the current date if not provided
        },
        amount: {
          type: Number,
          required: true
        },
        previousBill: {
          type: Number,
          required: true
        },
        newBill: {
          type: Number,
          required: true
        },
        description: {
          type: String,
          required: false,
          default: 'Bill updated'
        },
        items: [{
          item: {
            type: String,
            required: true
          },
          price: {
            type: Number,
            required: true
          }
        }]
      }],
      todaysMeal: {
        type: [
          {
            item: {
              type: String,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
          }
        ],
        required: function () {
          return this.role === 'Mess'; // Only required for Mess staff
        },
        default: [], // Default to an empty array for Mess staff
      }
    }, {
      timestamps: true,
})

module.exports = mongoose.model("User",userSchema);
