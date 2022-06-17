const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodtypeSchema = new Schema({
  categoryname: String

})

const Food_Type = mongoose.model('Foodtype', FoodtypeSchema)
module.exports = Food_Type
