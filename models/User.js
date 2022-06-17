const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Joi = require('joi');


const UserSchema = new Schema({
    name: String,
    // {
    //     type:String,
    //     required:true,
    //     minlength:5,
    //     maxlength:50
    // },
    address: String,
    phonenumber: String,
    email: {
        type: String,
        unique: true
    },
    password: String


    // {
    //     type:String,
    //    required:true,
    //     minlength:5,
    //     maxlength:50
    // },
    // {
    //     type: String,
    //     required: true,
    //     minlength: 5,
    //     maxlength: 1024
    // },
    // hname:String,
    // {
    //     type:String,
    //     required:true,
    //     minlength:5,
    //     maxlength:50
    // },
    // street:String,
    // {
    //     type:String,
    // required:true,
    //     minlength:5,
    //     maxlength:50
    // },
    // pincode:Number,
    // {
    //     type:Number,
    //     required:true,
    //     minlength:5,
    //     maxlength:50
    // },
    // city:String,
    // {
    //     type:String,
    //     required:true,
    //     minlength:5,
    //     maxlength:50
    // },
    // country:String,
    // {
    //     type:String,
    //    required:true,
    //     minlength:5,
    //     maxlength:50
    // },
    // phonenumber:Number,
    // {
    //     type:Number,
    //     required:true,
    //     minlength:10,
    //     maxlength:15
    // },
    // {
    //     type: String,
    //    required: true,
    //     minlength: 5,
    //     maxlength: 255,
    //     unique: true
    // }
})
// function validateUser(user) {
//     const vschema = {
//         fname: Joi.string().min(5).max(50).required(),
//         lname: Joi.string().min(5).max(50).required(),
//         password: Joi.string().min(5).max(255).required(),
//         hname: Joi.string().min(5).max(50).required(),
//         street: Joi.string().min(5).max(50).required(),
//         pincode: Joi.number().min(5).max(50).required(),
//         city: Joi.string().min(5).max(50).required(),
//         country: Joi.string().min(5).max(50).required(),
//         phonenumber: Joi.number().min(5).max(50).required(),
//         email: Joi.string().min(5).max(255).required().email()
//     };
//     return Joi.validate(user, vschema);
// }
// const User = mongoose.model('User',new mongoose.Schema({
//     fname:String,
//     lname:String,
//     password:String,
//     hname:String,
//     street:String,
//     pincode:Number,
//     city:String,
//     country:String,
//     phonenumber:Number,
//     email:String 
// }))
const User = mongoose.model('User', UserSchema)
module.exports = User
// module.exports.validate= validateUser
