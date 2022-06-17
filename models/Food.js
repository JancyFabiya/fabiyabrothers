const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    // foodType:String,
    foodname: String,
    description: String,
    image: String,
    amount: Number,
    //    subcategory:{
    //        type:mongoose.Schema.Types.ObjectId,
    //        ref:'Food_cuisine',
    //        required:true
    //    },
    subcategory: String,
    category: String
    //    category:{
    //        type:mongoose.Schema.Types.ObjectId,
    //        ref:'Foodtype',
    //        required:true
    //    }


})

const Food = mongoose.model('Food', FoodSchema)
module.exports = Food
