var db = require('../config/connection')
const User = require('../models/User')
const Admin = require('../models/Admin')
const Event = require('../models/Events')
const Selected_Food = require('../models/Selected_Food')
var nodemailer = require('nodemailer')
const Event_name = require('../models/Event_name')
const booking = require('../models/booking')
const Event_Type = require('../models/Event_Type')
// var userModel=require('../models/User')
const bcrypt = require('bcrypt')
const res = require('express/lib/response')
const Food = require('../models/Food')
// const { response } = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const Razorpay = require('razorpay');
const { response } = require('express')
const { resolve } = require('node:path')








const instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_KEY,
});

//================================= RazorPay ===================
const generateRazorPay = (orderId, total) => {

    return new Promise((resolve, reject) => {
        var options = {
            amount: total * 100,
            currency: "INR",
            receipt: "" + orderId,
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err, "RazorPay Error");
            }

            resolve(order)
        })

    })
}


const verifyPayment = (details) => {
    console.log(details);

    return new Promise(async (resolve, reject) => {
        const {
            createHmac
        } = await import('node:crypto');

        let hmac = createHmac('sha256', '9wszfyGbeazF2sXvhjA34MhY');

        hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
        hmac = hmac.digest('hex')
        if (hmac == details['payment[razorpay_signature]']) {
            console.log("verify complete");
            resolve(response)
        } else {
            console.log("verify not complete");
            reject(err)
        }

    })
}



















module.exports = {
    generateRazorPay,
    verifyPayment,

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            const user = await User.findOne({ email: userData.email })
            if (user) {
                reject({ status: false, msg: "Email already taken!" })
            } else {
                // console.log(userData.password)
                userData.password = await bcrypt.hash(userData.password, 10)
                const otpGenerator = await Math.floor(1000 + Math.random() * 9000);

                const newuser = await ({
                    name: userData.name,
                    address: userData.address,
                    phonenumber: userData.phonenumber,
                    email: userData.email,
                    password: userData.password,
                    otp: otpGenerator
                })
                // console.log(newuser);
                if (newuser) {
                    // console.log("otpppppppppppppppppp");
                    console.log(otpGenerator);
                    try {
                        const mailTransporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            service: "gmail",
                            port: 465,
                            secure: true,
                            auth: {
                                user: process.env.NODEMAILER_USER,
                                pass: process.env.NODEMAILER_PASS
                            },
                            tls: {
                                rejectUnauthorized: false
                            }

                        });

                        const mailDetails = {
                            from: "jancyfebin555@gmail.com",
                            to: userData.email,
                            subject: "just testing nodemailer",
                            text: "just random texts ",
                            html: '<h2>hi your otp ' + otpGenerator + ''
                        }
                        mailTransporter.sendMail(mailDetails, (err, Info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("email has been sent ", Info.response);

                            }
                        })
                    } catch (error) {
                        console.log(error.message);
                    }

                    // }
                }
                resolve(newuser)
            }       // await newuser.save().then((data) => {


            // db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            //   resolve(data)
            // })
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await User.findOne({ email: userData.email })
            let admin = await Admin.findOne({ email: userData.email })

            // console.log(user);
            if (user) {

                bcrypt.compare(userData.password, user.password).then((status) => {
                    //console.log(userData.password);
                    //console.log(user.password);
                    // console.log(userData);
                    // console.log('Status',status);



                    if (status) {
                        //  console.log(status);
                        console.log('login success')
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log(status);

                        console.log('login failed user')
                        reject({ status: false, msg: "Password mismatch!" })

                    }
                })
            } else if (admin) {

                if (userData.password == admin.password) {
                    //  console.log(status);
                    console.log('admin login success')
                    response.admin = admin
                    response.status = true
                    resolve(response)
                } else {
                    // console.log(status);

                    console.log('login failed')
                    reject({ status: false, msg: "Password mismatch!" })

                }
            } else {

                console.log('login failed 1');
                reject({ status: false, msg: "Email not registered, Please Sign Up" })

            }
        })
    },
    doresetPasswordOtp: (resetData) => {
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({ email: resetData.email });

            //   console.log(user);
            if (user) {
                // resetData.password = await bcrypt.hash(resetData.password, 10);

                //  const otpGenerator = await Math.floor(1000 + Math.random() * 9000);
                const newUser = await {
                    email: resetData.email,
                    //   otp: otpGenerator,
                    _id: user._id

                };
                // console.log(newUser);

                try {
                    const mailTransporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        service: "gmail",
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.NODEMAILER_USER,
                            pass: process.env.NODEMAILER_PASS
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });

                    const mailDetails = {
                        from: "jancyfebin555@gmail.com",
                        to: resetData.email,
                        subject: "just testing nodemailer",
                        text: "just random texts ",
                        html: "<p>Hi " + "user, " + "your otp for resetting Toycart account password is " + 'http://localhost:3000/set_conformpassword' + ".",
                    };
                    mailTransporter.sendMail(mailDetails, (err, Info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("email has been sent ", Info.response);
                        }
                    });
                } catch (error) {
                    console.log(error.message);
                }

                resolve(newUser);


            } else {
                reject({ status: false, msg: "Email not registered, please sign up!" });
            }
        });
    },
    doresetPass: (rData, rid) => {
        // console.log('hiiiii ',rData);
        return new Promise(async (resolve, reject) => {
            let response = {};
            rData.password = await bcrypt.hash(rData.password, 10);
            // console.log(rData.password+'fi');
            // console.log(userData.email+"aa");

            let userId = mongoose.Types.ObjectId(rid)
            console.log(userId + '1211111111111111111111111111111111111111');
            let resetuser = await User.findByIdAndUpdate({ _id: userId },
                { $set: { password: rData.password } })

            // let user = await userData.findOne({ email: rData.email });
            // // let admin= await adminData.findOne({email:userDataaa.email})
            // // console.log(userData);
            // // console.log(user.email);
            resolve(resetuser)

        })
    },
    getAllEventDetails: () => {
        return new Promise(async (resolve, reject) => {
            let eventDet = await Event.find().lean().populate('eventname').then((eventDet) => {
                resolve(eventDet)
            })

        })

    },
    getSelectedEventDetails: (detId) => {
        return new Promise(async (resolve, reject) => {
            let eventDetVie = await Event.findById({ _id: detId }).lean().then((eventDetVie) => {
                resolve(eventDetVie)
            })

        })
    },
    //  getUserName:(username)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let name=await User.find({name:username.name}).then((name)=>{
    //             console.log(name,'name of user');
    //             resolve(name)
    //         })
    //     })
    // },
    forBookingSelectedEvent: (evId) => {
        return new Promise(async (resolve, reject) => {
            let bookevntdet = await Event.find()
        })
    },
    getSelectedEvent: (selectId) => {
        return new Promise(async (resolve, reject) => {
            let eventnam = await Event.find({ eventname: selectId }).lean().populate('eventname').then((eventnam) => {
                resolve(eventnam)
            })

        })
    },
    getMarriageDetails: () => {
        return new Promise(async (resolve, reject) => {
            let eventDet = await Event.find({ eventname: 'marriage' }).lean().then((eventDet) => {
                resolve(eventDet)
            })

        })

    },
    getBirthdayDetails: (eventId) => {
        return new Promise(async (resolve, reject) => {
            let eventBi = await Event.find({ eventname: 'birthday' }).lean().then((eventDet) => {
                resolve(eventDet)
            })

        })

    },
    getOfficePartyDetails: (eventId) => {
        return new Promise(async (resolve, reject) => {
            let eventBi = await Event.find({ eventname: 'office party' }).lean().then((eventDet) => {
                resolve(eventDet)
            })

        })

    },
    getEvent: (eventid) => {
        return new Promise(async (resolve, reject) => {
            let event = await Event.find({ $and: [{ eventtype: eventid }, { eventname: 'marriage' }] }).lean()
            resolve(event)
        })



    },
    getEventBirth: (eventid) => {
        return new Promise(async (resolve, reject) => {
            let event = await Event.find({ $and: [{ eventtype: eventid }, { eventname: 'birthday' }] }).lean()
            resolve(event)
        })



    },
    getEventOfficeParty: (eventid) => {
        return new Promise(async (resolve, reject) => {
            let event = await Event.find({ $and: [{ eventtype: eventid }, { eventname: 'office party' }] }).lean()
            resolve(event)
        })



    },
    cartFood: (foodId, userId) => {
        return new Promise(async (resolve, reject) => {
            let userdt = await Selected_Food.findOne({ user: userId }).lean()
            let name = await Food.findById(foodId).lean()
            console.log('food name', name);
            //    console.log(userdt+"456778888")
            if (userdt) {



                Selected_Food.updateOne({ user: userId }, {
                    // $push:{food:foodId}
                    $push: { fooditem: [{ foodname: name.foodname, amount: name.amount, image: name.image }] }
                    // ,{food:foodId}]}



                    //$push:{cartItems:[{products:proId,quantity}]}
                }).then(() => {
                    resolve()
                })
                // }
            } else {

                let cartObj = {
                    user: userId,
                    fooditem: [{
                        foodname: name.foodname,
                        amount: name.amount,
                        image: name.image
                    }]
                    // ,{food:foodId}] 
                    //    food:[foodId]

                }
                Selected_Food(cartObj).save().then((response) => {
                    // console.log('dffvg');
                    resolve()
                })
            }

        })
    },
    findFood: (user) => {
        return new Promise(async (resolve, reject) => {
            // let userId=mongoose.Types.ObjectId(user)
            // let getFood =
            let selfood = await Selected_Food.findOne({ user: user }).lean()

            if (selfood) {
                if (selfood.fooditem != 0) {
                    resolve(selfood.fooditem)
                }
                else {
                    resolve()

                }
            } else {
                resolve()
            }


            // ({path:'food',
            // populate:{
            //     path:'foodname'}
            // })
            // console.log(getFood)
        })
    },
    deleteSelectedFood: (fId, userId) => {
        return new Promise(async (resolve, reject) => {
            // let ID=mongoose.Types.ObjectId(userId)
            console.log(userId, 'userrr');

            const deleteselfood = await Selected_Food.updateOne({ 'fooditem._id': fId }, {
                $pull: { fooditem: { _id: fId } }
            }).then((deleteselfood) => {
                console.log('deletefood==========', deleteselfood);
                //    const findfood=await Selected_Food.aggregate([
                //     {
                //         $unwind:"$fooditem"
                //     },
                //     {
                //         $match:{user: ID}
                //     },
                // ])
                // console.log('findfood',findfood[0]);
                // if(findfood!=undefined){
                resolve(deleteselfood)
                // }else{
                //     const deletefooood=Selected_Food.deleteOne({user:userId})
                //     resolve(deletefooood)
                // }
            })
            // console.log(result);

        })
    },
    addBooking: (bookData, userId) => {
        return new Promise(async (resolve, reject) => {
            // let ID=mongoose.Types.ObjectId(userId)
            // const findfood=await Selected_Food.aggregate([
            //     {
            //         $unwind:"$fooditem"
            //     },
            //     {
            //         $match:{user: ID}
            //     },
            // ])
            // console.log('findfood',findfood[0]);
            // if(findfood[0]==undefined){
            //     const deletefooood=Selected_Food.deleteOne({user:userId})
            //     console.log(deletefooood),'dellllll';
            // }
            console.log(bookData, '111111111');
            console.log(bookData.username, 'username body');
            let bookdet = await booking.findOne({ customername: bookData.username })
            console.log(bookdet, 'db details');
            // console.log(bookdet.customername, 'db username');

            console.log('event name 1', bookData.eventname);
            console.log('event type 1', bookData.eventtype);

            if (bookdet) {
                console.log('database user');
                if (bookdet.customername == bookData.username) {
                    console.log('users are equal');
                    if (bookdet.eventname == bookData.eventname && bookdet.eventtype == bookData.eventtype) {
                        console.log('event name and type equal');
                        await booking.updateOne({ eventname: bookData.eventname, eventtype: bookData.eventtype }, {
                            $set: {
                                eventlocation: bookData.location,
                                eventdate: bookData.eventdate,
                                noofguest: bookData.guestcount,
                                starttime: bookData.starttime,
                                endtime: bookData.endtime,
                            }
                        })
                        let upbook = await booking.findOne({ customername: bookData.username })
                        console.log(upbook, 'updated booking');
                        resolve(upbook)
                    } else {
                        const newebooking = await new booking({
                            customername: bookData.username,
                            eventname: bookData.eventname,
                            eventtype: bookData.eventtype,
                            eventlocation: bookData.location,
                            eventdate: bookData.eventdate,
                            noofguest: bookData.guestcount,
                            starttime: bookData.starttime,
                            endtime: bookData.endtime,

                        })
                        await newebooking.save().then((data) => {
                            resolve(data)
                        })
                    }
                }
            } else {
                console.log('elese case');
                //         const customer=await User.findOne({ name:bookData.username})
                //         const selecteventname=await Event_name.findOne({eventname:bookData.eventname})
                // const selecteventtype=await Event_Type.findOne({eventtype:bookData.eventtype})
                const newebooking = await new booking({
                    customername: bookData.username,
                    eventname: bookData.eventname,
                    eventtype: bookData.eventtype,
                    eventlocation: bookData.location,
                    eventdate: bookData.eventdate,
                    noofguest: bookData.guestcount,
                    starttime: bookData.starttime,
                    endtime: bookData.endtime,

                })
                await newebooking.save().then((data) => {
                    resolve(data)
                })
                console.log(newebooking, '++++++sssss');

            }

        })
        // getValue:(value)=>{
        //     return new Promise(async(resolve,reject)=>{
        //             resolve(value)
        //         })
    },
    // foodTotal:(fId)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let food=await Food.findOne({_id:fId})
    //         let foodamount=food.amount
    //         let foodtotal=foodtotal+foodamount
    //         console.log('amout2222',foodtotal);
    //                     })
    // },
    findTotal: (eventId, userId, evamount, guest) => {
        return new Promise(async (resolve, reject) => {
            let select = await Selected_Food.findOne({ user: userId })
            console.log('====', select);

            let id = mongoose.Types.ObjectId(userId)
            console.log('userid111', userId);
            console.log('objectid', id);
            if (select == null || select.fooditem != 0) {
                if (select) {
                    let foodarray = await Selected_Food.aggregate([
                        {
                            $match: { user: id }
                        },
                        {
                            $unwind: '$fooditem'
                        },
                        {
                            $project: {
                                foodname: '$fooditem.foodname',
                                amount: '$fooditem.amount'
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: '$amount' }

                            }
                        }

                    ])

                    // console.log(foodarray[0].totalAmount,"======dfgh");
                    //     let fname=await Food.findOne({foodname:foodarray})
                    // console.log(fname,'ppppp');

                    let total = (guest * foodarray[0].totalAmount) + evamount
                    console.log(total);
                    resolve(total)

                } else {
                    let total = evamount
                    console.log('123', total)
                    resolve(total)

                }
            }
        })


    },
    updateBooking: (userid, userName, eventvalue, ename, etype) => {
        return new Promise(async (resolve, reject) => {
            console.log('updatebooking1111111111', eventvalue);
            // console.info(('updatebooking1111111111',eventvalue)['toString']); 
            // const selFood=await Selected_Food.findOne(userName)
            let uid = mongoose.Types.ObjectId(userid)
            console.log('user id5555555555', uid);
            let arrayfoodname = await Selected_Food.aggregate([
                {
                    $match: { user: uid }
                },
                {
                    $unwind: '$fooditem'
                },

                {
                    $project: {
                        foodname: '$fooditem.foodname'
                    }
                },
                {
                    $project: {
                        image: '$fooditem.image'
                    }
                }





                // {
                //     $project:{
                //         foodname:1
                //     }
                // },
            ])
            console.log('1234567', arrayfoodname)
            const upBooking = await booking.updateOne({ customername: userName, eventname: ename, eventtype: etype }, {
                $set: {
                    selectedFood: arrayfoodname,
                    totalAmount: eventvalue.total,
                    status: 'Pending'
                }
            },
                { upsert: true }).then((response) => {
                    resolve()
                })
            console.log('55555555555', upBooking);
        })

    },
    getBookingDetails: (userName) => {
        return new Promise(async (resolve, reject) => {
            const bookid = await booking.findOne({ customername: userName })
            resolve(bookid._id)
            console.log('@@@@@@@@@@@@@@@@', bookid._id);
        })

    },
    getBookingEvent: (userName, bookid) => {
        return new Promise(async (resolve, reject) => {
            const bookevent = await booking.findOne({ customername: userName }).lean()
            console.log('66666666', bookevent);
            resolve(bookevent)
        })

    },

    changePaymentStatus: (bookingId, paymentData) => {

        console.log(paymentData, "----paymentDaataaaaaaa");

        return new Promise(async (resolve, reject) => {

            const bookings = await booking.updateMany({ _id: bookingId }, {
                $set: { status: "Booked", paymentId: paymentData['payment[razorpay_payment_id]'] }


            }).then(() => {
                resolve()
            })
        })

    },
    getEventImage: (uname) => {
        return new Promise(async (resolve, reject) => {
            const evntdetbooking = await booking.findOne({ customername: uname })
            // const etypeid = await Event_Type.findById(event.eventtype)
            console.log(evntdetbooking.eventname, '11111111111')
            const edata = await Event.findOne({ eventname: evntdetbooking.eventname, eventtype: evntdetbooking.eventtype }).lean()
            console.log('image11111111111111', edata.image);
            resolve(edata.image)
        })
    },
    selectedEventname: (sId) => {
        return new Promise(async (resolve, reject) => {
            await Event_name.findById({ _id: sId }).then((response) => {
                resolve(response)
            })
        })

    },
    selectedEvent: (EName) => {
        return new Promise(async (resolve, reject) => {
            await Event.find({ eventname: EName }).lean().then((response) => {
                resolve(response)
            })
        })

    },
    getOrderList: (user) => {
        console.log('getorderlist', user);
        return new Promise(async (resolve, reject) => {
            const buser = await booking.find({ customername: user }).lean()
            console.log('buser', buser);
            if (buser != null) {
                resolve(buser)
            } else {
                resolve()
            }

        })
    }

}


