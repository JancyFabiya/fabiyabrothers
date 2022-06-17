var db = require('../config/connection')
const Event = require('../models/Events')
const multer = require('multer')
const res = require('express/lib/response')
const path = require("path");
const { isObjectIdOrHexString } = require('mongoose');
const { resolve } = require('path');
const Food_Type = require('../models/Food_Type');
const Food_cuisine = require('../models/Food_cuisine');
const Food = require('../models/Food');
const Event_Type = require('../models/Event_Type')
const Event_name = require('../models/Event_name')
const booking = require('../models/booking')
const mongoose = require('mongoose');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    },

})

var upload = multer({
    storage: storage
})



const addEvent = (eventData, file) => {
    return new Promise(async (resolve, reject) => {
        console.log(eventData);
        const eventtype = await Event_Type.findOne({ eventtype: eventData.eventtype })
        const eventName = await Event_name.findOne({ eventname: eventData.eventname })

        const newevent = await new Event({
            eventtype: eventtype.eventtype,
            eventname: eventName.eventname,
            description: eventData.description,
            image: file.filename,
            amount: eventData.amount,

        })
        await newevent.save().then((data) => {
            resolve(data)
        })

        console.log(newevent);
    })
}


module.exports = {
    upload, addEvent,
    addEventType: (eventTypeData) => {
        return new Promise((resolve, reject) => {


            const addeventtype = {
                eventtype: eventTypeData.eventtype
            }
            Event_Type(addeventtype).save().then((response) => {
                resolve(response)
            })
        })

    },
    addEventName: (eventData) => {
        return new Promise((resolve, reject) => {


            const addeventname = {
                eventname: eventData.eventname
            }
            Event_name(addeventname).save().then((response) => {
                resolve(response)
            })
        })

    },

    deleteBooking: (bookingId) => {
        return new Promise(async (resolve, reject) => {
            const bid = await booking.deleteOne({ _id: bookingId }).then((bid) => {
                resolve(bid)
            })

        })
    },

    getEventType: () => {
        return new Promise((resolve, reject) => {
            Event_Type.find().lean().then((response) => {
                resolve(response)
                console.log(response + "=======");
            })
        })

    },
    getEventName: () => {
        return new Promise((resolve, reject) => {
            Event_name.find().lean().then((response) => {
                resolve(response)
                console.log(response + "=======");
            })
        })

    },
    getEventDetails: () => {
        return new Promise(async (resolve, reject) => {
            let eventdetails = await Event.find().lean()
            //  const eventdetails=await Event.find({}).lean().populate({path:'eventtype',
            //  populate:{
            //      path:'eventtype',
            //  }

            // })
            console.log(eventdetails, 'ghjkmmmn')
            resolve(eventdetails)
            console.log(eventdetails + '999999999');
        })
    },

    deleteEvent: (eventId) => {
        return new Promise(async (resolve, reject) => {
            const result = await Event.deleteOne({ _id: eventId }).then((events) => {
                //  console.log(events);

                resolve(events)
            })
            // console.log(result);

        })

    },
    findEvent: (eventId, eventDetails, file) => {
        return new Promise(async (resolve, reject) => {
            let event = await Event.findById({ _id: eventId }).lean().then((event) => {
                resolve(event)
            })

        })

    },
    getEvent: () => {
        return new Promise(async (resolve, reject) => {
            let eventPro = await Event.find().lean()
            console.log(eventPro);
            resolve(eventPro)
        })
    },
    updateEvent: (eventId, eventDetails, file) => {
        return new Promise(async (resolve, reject) => {
            const resultevent = await Event.updateOne({ _id: eventId }, {
                $set: {
                    eventtype: eventDetails.eventtype,
                    eventname: eventDetails.eventname,
                    description: eventDetails.description,
                    image: file,
                    amount: eventDetails.amount
                }
            }).lean().then((response) => {
                resolve()
            })

        });
        console.log(result);
    },
    addCategory: (categoryData) => {
        return new Promise((resolve, reject) => {


            const addcategory = {
                categoryname: categoryData.foodcategory
            }
            Food_Type(addcategory).save().then((response) => {
                resolve(response)
            })
        })

    },
    getCategory: () => {
        return new Promise((resolve, reject) => {
            Food_Type.find().lean().then((response) => {
                resolve(response)
                console.log(response + "=======");
            })
        })

    },
    addSubCategory: (Data) => {
        return new Promise(async (resolve, reject) => {
            // const category=await Food_Type.findOne({categoryname:Data.foodcategory})
            // console.log(category);

            const newSubCategory = new Food_cuisine({
                subcategoryname: Data.subcategory
                // category:category._id

            })
            await newSubCategory.save().then((response) => {
                resolve(response)
            })
        })
    },
    getSubcategory: () => {
        return new Promise(async (resolve, reject) => {
            const product = await Food_cuisine.find({}).lean()
            resolve(product)
        })
    },
    addFoodDetails: (Data, file) => {

        return new Promise(async (resolve, reject) => {
            console.log(Data);
            const category = await Food_Type.findOne({ categoryname: Data.foodtype })
            const subcategory = await Food_cuisine.findOne({ subcategoryname: Data.foodcuisine })
            const newfood = await new Food({
                foodtype: Data.foodtype,
                foodname: Data.foodname,
                description: Data.description,
                image: file.filename,
                amount: Data.amount,
                subcategory: subcategory.subcategoryname,
                category: category.categoryname

            })
            await newfood.save().then((data) => {
                // console.log('data',data);
                resolve(data)
            })
            //  }

            // console.log(newfood);
        })
    },

    getFoodDetails: () => {
        return new Promise(async (resolve, reject) => {
            const food = await Food.find().lean()
            resolve(food)
            console.log('fooddetails:', food);
        })

    },
    deleteFood: (foodId) => {
        return new Promise(async (resolve, reject) => {
            const deletefood = await Food.deleteOne({ _id: foodId }).then((foods) => {
                //  console.log(events);

                resolve(foods)
            })
            // console.log(result);

        })
    },
    getFood: () => {
        return new Promise(async (resolve, reject) => {
            let product = await Food.find().lean()
            console.log(product);
            resolve(product)
        })

    },
    findFood: (foodId, file) => {
        return new Promise(async (resolve, reject) => {
            const fooddetails = await Food.findById({ _id: foodId }).lean().populate('category').populate('subcategory').then((fooddetails) => {
                resolve(fooddetails)
            })

        })


    },
    updateFood: (foodId, foodDetails, file) => {
        return new Promise(async (resolve, reject) => {
            const categorys = await Food_Type.findOne({ categoryname: foodDetails.foodtype })
            const subcategorys = await Food_cuisine.findOne({ subcategoryname: foodDetails.foodcuisine })
            const resultfood = await Food.updateOne({ _id: foodId }, {
                $set: {
                    category: foodDetails.category,
                    subcategory: foodDetails.subcategory,
                    foodname: foodDetails.foodname,
                    description: foodDetails.description,
                    image: file,
                    amount: foodDetails.amount
                }
            }).lean().then((response) => {
                resolve()
            })

        });
        console.log(result);
    },
    getAllBooking: () => {
        return new Promise(async (resolve, reject) => {
            const bookevent = await booking.find().lean().then((response) => {
                resolve(response)
            })

        })
    },
    findBookingId: (bookevent) => {
        return new Promise(async (resolve, reject) => {
            const bookId = await booking.findById(bookevent).lean()
            resolve(bookId)


        })
    },
    findCustomerSelectedFood: (user) => {
        return new Promise(async (resolve, reject) => {
            let getFood = await Selected_Food.find({ user: user }).lean()
            // ({path:'food',
            // populate:{
            //     path:'foodname'}
            // })
            // console.log(getFood)
            resolve(getFood)
        })
    },
    getSelectedBookingFood: (bookId) => {
        return new Promise(async (resolve, reject) => {
            // const evnt=await booking.findOne({_id:bookId})
            let id = mongoose.Types.ObjectId(bookId)

            // const selectedfood = await booking.aggregate([
            //     {
            //         $match: { _id: id }
            //     },
            //     {
            //         $unwind: '$selectedFood'
            //     },
            //     {
            //         $project: {
            //             foodname: '$selectedFood.foodname'
            //         }
            //     }
            // ])
            resolve(selectedfood)
            console.log(selectedfood, 77777777777);
        })
    }
}






// addCarousel:(file)=>{
//     return new Promise((resolve,reject)=>{
//         const imagedata={
//             image : file.filename
//         }
//         Carousel(imagedata).save().then((response)=>{
//             resolve(response)
//         })
//     })
//     },
//     getCarousel:()=>{
//     return new Promise((resolve,reject)=>{
//         Carousel.find().lean().then((response)=>{
//             resolve(response)
//         })
//     })
//     },

// deleteCarousel:(carId)=>{
//     return new Promise(async(resolve,reject)=>{
//         const carid = await Carousel.deleteOne({ _id: carId}).then((carid)=>{
//           //  console.log(events);

//             resolve(carid)
//         })
//        // console.log(result);

//     })
// },