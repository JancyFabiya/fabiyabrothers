const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const selectedFoodSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fooditem: [{
        foodname: {
            type: String
        },
        amount: {
            type: Number
        },
        image:{
            type:String
        }


        // food:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:'Food',
        // required:true
        // }
    }]

})

const Selected_Food = mongoose.model('Selected_Food', selectedFoodSchema)
module.exports = Selected_Food