const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

  customername: String,

  eventname: String,

  eventtype: String,

  eventlocation: String,
  eventdate: String,
  noofguest: Number,
  starttime: String,
  endtime: String,
  selectedFood: Array,
  totalAmount: Number,
  status: String,
  paymentId: String,


})

const booking = mongoose.model('booking', bookingSchema)
module.exports = booking
