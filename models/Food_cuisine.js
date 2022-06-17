const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
  subcategoryname: String,
  //category:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'Food_Type',
  //     required:true
  // }

})

const Food_cuisine = mongoose.model('Food_cuisine', SubcategorySchema)
module.exports = Food_cuisine
