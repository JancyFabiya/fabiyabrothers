var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')
const adminHelpers = require('../helpers/admin-helpers')
const Event = require('../models/Events')
const User = require('../models/User');
const res = require('express/lib/response');

const Razorpay = require('razorpay');
const { render } = require('express/lib/response');



let userValue
let admin
/* GET home page. */
router.get('/', async function (req, res, next) {
 
  const eventresult = await userHelpers.getAllEventDetails()
  // const name = await adminHelpers.getEventName()
  // console.log(name)
  
  // const evntname=Object.values(name)
  // const evntname2=Object.values(name)[1]
  // console.log("++++",evntname)


  if (req.session.user) {
    res.redirect('/logged');
  } else if (req.session.admin) {
    res.redirect("/logged")
  } else {
    res.render('home', {eventresult })
    // req.session.loginErr=false

    // res.render('user/booking_page',{layout:false})
  }

});

/* Render home page */
router.get('/home', (req, res) => {
  if (req.session.user) {
    userValue = req.session.user
    res.render('home', { userValue })

  }

  else {
    res.render('home')
  }
})

/* user registration */

router.get('/signup', (req, res) => {
  signUpError=req.session.loggErr2
  res.render('signup', { layout: false,signUpError })
})
router.get('/otp', (req, res) => {
  res.render('otp_signup', { layout: false })
})
router.post('/signup', (req, res) => {
 
  userHelpers.doSignup(req.body).then((response) => {
    // console.log(response);
    req.session.otp = response.otp
    req.session.userdetails = response
    
    res.redirect('/otp')
  })
  .catch((err)=>{
    req.session.loggErr2=err.msg
    res.redirect("/signup")
  })
  //}

})

/* OTP */
router.post('/otpverify', async (req, res) => {
  if (req.session.otp == req.body.otp) {
    let userData = req.session.userdetails
    // console.log('hgdfdgfds');
    // console.log(userData);
    const adduser = await new User({
      name: userData.name,
      address: userData.address,
      phonenumber: userData.phonenumber,
      email: userData.email,
      password: userData.password
    })
    // console.log(adduser);
    await adduser.save()
    res.redirect('/login')
  }
  else {
    res.redirect('/signup')
  }
})

/* login */

router.get('/login', (req, res) => {
  if (req.session.user) {

    res.redirect('/logged')

  }

  else if (req.session.admin) {
    // res.redirect('/logged')
    res.redirect('/admin')

  }
  else {

    res.render('login', {

      signUpErr:req.session.loggErr2,
      logginError: req.session.logginError,
       layout: false })
    req.session.logginError=null
    req.session.loginErr=null
  }
})


router.get('/logged', async function (req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0');

  if (req.session.user) {
    userValue = req.session.user
    const eventresult = await userHelpers.getAllEventDetails()
    const EventName=await adminHelpers.getEventName()
    req.session.EventName=EventName
    console.log(eventresult,'111111111');
    // req.session.eventresult=eventresult
    res.render('user/user_booking', { userValue, eventresult,EventName})
  }
  else if (req.session.admin) {
    //admin= req.session.admin
    // res.render("admin/add_eventlist",{admin})
    res.redirect("/admin")

  }
  else {
    res.redirect("/login")
  }

});




router.post('/logged', (req, res) => {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0');
  userHelpers.doLogin(req.body).then((response) => {
    if (response.user) {
      req.session.user = response.user
      console.log(req.session.user);
      req.session.loggedIn = true
      res.redirect("/logged")

    }
    else if (response.admin) {
      req.session.admin = response.admin
      req.session.admin.loggedIn = true
      //res.redirect('/logged')
      res.redirect('/admin')

    }
    else {
      req.session.loginErr = 'invalid email or password'
      res.redirect('/login')
    }
  }).catch((err)=>{
    req.session.logginError = err.msg
    res.redirect('/login')
  })
})


/* forgot password */
router.get('/forgot_password', function (req, res, next) {

  //  if(req.session.user ){
  //     userValue = req.session.user
  //    res.render('user/user_booking',{userValue})
  //   }
  //    else if(req.session.admin){
  //      //admin= req.session.admin
  //      // res.render("admin/add_eventlist",{admin})
  //      res.redirect("/admin")

  //  }
  //  else{
  // res.render("set_conformpassword",{layout:false})

  res.render("forgot_password", { layout: false })
  //}

});

/*set conformpassword */
router.get('/set_conformpassword', (req, res) => {
  res.render('set_conformpassword')

})

router.post("/forgot_password", async (req, res) => {
  userHelpers.doresetPasswordOtp(req.body).then((response) => {
    console.log(response);
    req.session.otp = response.otp;
    req.session.userdetails = response;
    req.session.userRID = response._id;
    console.log(req.session.userRID+'hhhhh');
    // res.redirect("/otpReset");
    function myFunction() {
      alert("Link for resetting password has been sended");
    }
    res.redirect("/login");
  })
  
    .catch((err) => {
      req.session.loggErr2 = err.msg;
      res.redirect("/login");
    });
});

router.post("/set_conformpassword", (req, res) => {
  // console.log(req.body);
  if (req.body.password == req.body.con_password) {
    console.log(req.session.userRID);
    userHelpers.doresetPass(req.body, req.session.userRID).then((response) => {
      // console.log(response);
      req.session.message = "Password changed succesfully! Please login with new password";
      res.redirect("/login");
      console.log("Password updated");
    });
  } else {
    console.log("password mismatch");
    req.session.passErr = "Password mismatch";
    res.redirect("/set_conformpassword");
  }
});


/* verify login */

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* View event detailed list */
router.get('/view_eventdetails/:id',verifyLogin, async (req, res) => {
  userValue = req.session.user
  const eventview = await userHelpers.getSelectedEventDetails(req.params.id)
  // console.log('detail value',eventview);
  EventName=req.session.EventName

  res.render('user/event_detailview', { userValue, eventview,EventName })
})

/* All Order List */
router.get('/All-orderlist',async(req,res)=>{
  userValue = req.session.user
const orderlist=await userHelpers.getOrderList(userValue.name)
console.log('order list',orderlist)
EventName=req.session.EventName

res.render('user/all_orderlist',{userValue,orderlist,EventName})
})


/* un user click event(for login) */

router.get('/addcart_event/:id', verifyLogin, (req, res, next) => {
  // let eventid=req.params.id
  // let eventtype=await adminHelpers.getEventType()

  // let typeevent= await userHelpers.getEvent(eventid)
  // console.log('add to list',req.params.id);
  // console.log('add to list session',req.session.user._id);

  userHelpers.cartEvent(req.params.id, req.session.user._id)
  //res.redirect('/marriage')

  // if(req.session.user ){

  // res.render('marriage_Typeview',{eventtype,typeevent,user:true})
  // }
  // else{
  //   res.render('marriage_Typeview',{typeevent,eventtype})

  // }
})

/* Booking Page */

router.get('/booking/:id', verifyLogin, async (req, res, next) => {
  userValue = req.session.user
  let bookevent = await userHelpers.getSelectedEventDetails(req.params.id)
  console.log(bookevent.eventname,'event details 111');
  req.session.eventnamE=bookevent.eventname
  req.session.eventtypE=bookevent.eventtype

  req.session.EventId = req.params.id
  req.session.eventamount = bookevent.amount
  console.log('selected event amount aaaa=', bookevent.amount);
  console.log('start', bookevent, 'event detail');
  EventName=req.session.EventName

  res.render('user/booking_page', {userValue, bookevent,EventName })

})

router.post('/booking/:id', verifyLogin, async (req, res, next) => {


  console.log("qwertyuio",req.params);

  await userHelpers.addBooking(req.body,req.session.user._id).then((response) => {
    console.log('222',response);
    req.session.guestcount = response.noofguest
    console.log('guest000000',);
    console.log('booking add', response.noofguest);
    console.log('saadfg1111111111', req.session.EventId);
    res.redirect(`/booking_secondpage/${req.session.EventId}`)
    // res.redirect("/qwertyu")

  })
  // .catch((err) => {
  //   req.session.bookinger ="Sorry...Your event is already booked !";
  //   res.redirect("/booking/:req.session.EventId",{logginError:req.session.bookinger });
  // });
})

/* Selected Events display */

router.get('/selected_event/:id',verifyLogin,async(req,res)=>{
  console.log('event id 111',req.params.id);
  userValue = req.session.user
  console.log('66666666',userValue);
let ENamE=await userHelpers.selectedEventname(req.params.id)
console.log('0000',ENamE.eventname);
let Evalue =await userHelpers.selectedEvent(ENamE.eventname)
console.log('3333',Evalue);
EventName=req.session.EventName

  res.render('user/selected_event',{userValue,Evalue,EventName})

})

/* second booking page and add to booking  */

router.get('/booking_secondpage/:id', verifyLogin, async (req, res) => {

  // let booking=await userHelpers.addBooking(req.body).then(async(response)=>{
  req.session.event = req.params.id
  bookevent=req.session.EventId
  userValue = req.session.user
  console.log('Not workinggggg');
  let selectedFood = await userHelpers.findFood(req.session.user._id)
  // console.log('selected food====', selectedFood);
  console.log('Not workinggggg123');
  let Total = await userHelpers.findTotal(req.params.id, req.session.user._id, req.session.eventamount, req.session.guestcount)
  console.log('Not workinggggg567');
  req.session.Total = Total
  // let total=userHelpers.findTotal()
  // console.log('booking add',booking);
  EventName=req.session.EventName

  
  res.render('user/booking_secondpage_copy', {userValue,selectedFood,Total,bookevent,EventName})
  console.log('logged user 99999', req.session.user.name);
  //})

  // console.log(Total, 'total12345666666');

})

/*  second page condent add to booking schema */

router.post('/booking-second', verifyLogin, async (req, res, next) => {
  // const { id } = req.params;
  // const event_Id=userHelpers.getEventId()
  // console.log("the event id is ",event_Id) 
  // console.log(req.body,'lllllaaaa');
  // Total=req.session.Total
  let eventId = req.session.EventId
  console.log('event id 22222222222', eventId);
 
  await userHelpers.updateBooking(req.session.user._id, req.session.user.name, req.body,req.session.eventnamE,req.session.eventtypE).then((response) => {
    // res.render('user/payment_page',{Total})
    res.redirect('/payment')
  })
})

/* payment process */

router.get('/payment', verifyLogin,async (req, res) => {
  Total = req.session.Total
  userValue = req.session.user

  const idevent = req.session.EventId
  // console.log(req.session.user.name,'11111111111');
  await userHelpers.getBookingDetails(req.session.user.name).then((bookid) => {
    console.log(bookid, "***************");
    // req.session.bookid=bookid
    res.render('user/payment_page', { Total, bookid ,userValue})


  })


})

router.post('/payment', (req, res) => {
  console.log("qertyuio");
  const totalAmount = req.session.Total
  const bookingid = req.body.id
  userHelpers.generateRazorPay(bookingid, totalAmount).then((response) => {
    console.log(response, 'generaterazorrrrr');
    res.json(response)
  })
  console.log(req.body.id, 'payment processing');
})



router.post('/verify-payment', (req, res) => {


  userHelpers.verifyPayment(req.body).then((response) => {
   
    userHelpers.changePaymentStatus(req.body['order[receipt]'], req.body).then(() => {

      console.log("payment Sucessful");
      res.json({ status: true })
    }).catch((err) => {
      console.log(err.message, "second then error");

    })
  }).catch((err) => {
    console.log("first then errorr======");
    res.json({ status: false, errMsg: '' })
  })
})

/* Successful Pay */
router.get('/user/order-success',verifyLogin,(req,res)=>{
  userValue = req.session.user
  // userHelpers.getBookingDetails(req.session.user.name).then((bookid) => {

  res.render('user/order-success',{userValue})
  // })
})

/* order list view */
router.get('/order-list',verifyLogin,async(req,res)=>{
//  const bookEvent= userHelpers.getBookingEvent(req.session.user.name,req.session.bookid)
  const bookdet= await userHelpers.getBookingEvent(req.session.user.name)
  console.log(bookdet,'rrrrrrrrr');
const evntimg= await userHelpers.getEventImage(req.session.user.name)
console.log(evntimg,'abbbbbbbbb');
userValue = req.session.user

res.render('user/order-list',{bookdet,evntimg,userValue})

})


/* food view */

router.get('/food_view', verifyLogin, async (req, res, next) => {
  userValue = req.session.user
  bookevent = req.session.event
  const fooddisp = await adminHelpers.getFoodDetails()
  EventName=req.session.EventName

  res.render('user/food_view', { userValue, fooddisp, bookevent,EventName })
})



/* add selected food into database(ajax) */

router.get('/add-selectedfood/:id', verifyLogin, async (req, res) => {
  console.log('api call')
  // req.session.selectedfood=req.params.id
  // console.log('selected food id',req.session.selectedfood);
  userHelpers.cartFood(req.params.id, req.session.user).then((response) => {
    // res.redirect('/food_view')
    // if(response.error){
    //   res.status(500).send({error: 'The food is already exist'}); 
    // }

  })
  // await userHelpers.foodTotal(req.params.id)

})

/*   delete selected food */

router.get('/delete-selectedfood/:id', verifyLogin, (req, res) => {
  userHelpers.deleteSelectedFood(req.params.id, req.session.user._id).then((response) => {
    //  id=req.session.event
    res.redirect('/booking_secondpage/:req.session.event')

  })
})


/*  Selected Event View  */

router.get('/select_event/:id', async (req, res) => {
  const carousalimage = await adminHelpers.getCarousel()
  const name = await adminHelpers.getEventName()

  // let eventid=req.params.id
  // if('/select_event/:id'){
  console.log('selected event working');
  console.log(req.params.id);
  const selectedEvent = await userHelpers.getSelectedEvent(req.params.id)
  console.log('fgh', selectedEvent);
  res.render('marriage', { carousalimage, selectedEvent, name })

  // }

})












































// delete selected food (ajax)
// router.get('/delete-selectedfood/:id',(req,res)=>{
//   console.log('deletedfood++++++',req.params.id);
//   userHelpers.deleteSelectedFood(req.params.id,req.session.user).then((response)=>{
//     // res.redirect('/admin/booking_secondpage')
// console.log('delete one item');
//   })
// })

// router.get('/booking/view/:id',async(req,res)=>{
// const{id}=req.params;
// const event_id= await Event.findById(id)
// console.log(event_id)
// })
//add to booking schema
// router.post('/booking_secondpage/:id',verifyLogin,async(req,res,next)=>{
//   await userHelpers.addBooking(req.body)

// })

//marriage
// router.get('/marriage',async(req,res)=>{
//   if(req.session.user ){
//     userValue = req.session.user
//     const marriage=await userHelpers.getMarriageDetails()
//    res.render('marriage',{userValue,marriage})
//   }
// })
//marriage view
//   router.get('/marriage', async(req, res) => {
//     let eventtype=await adminHelpers.getEventType()
// let eventresult=await userHelpers.getMarriageDetails()
// // console.log('marriage view');
// // console.log('userlogin',req.session.user);
// if(req.session.user ){
//   // console.log('userlogin123',req.session.user);

//   res.render('marriage',{eventtype,eventresult,userValue})
// }else{
//   res.render('marriage',{eventtype,eventresult})

// }
//   })

//birthday
//   router.get('/birthday', async(req, res) => {
//     let eventtype=await adminHelpers.getEventType()
// let eventresult=await userHelpers.getBirthdayDetails()
// // console.log('marriage view');
// // console.log('userlogin',req.session.user);
// if(req.session.user ){
//   // console.log('userlogin123',req.session.user);

//   res.render('marriage',{eventtype,eventresult,userValue})
// }else{
//   res.render('marriage',{eventtype,eventresult})

// }
//   })
//office party
//   router.get('/officeparty', async(req, res) => {
//     let eventtype=await adminHelpers.getEventType()
// let eventresult=await userHelpers.getOfficePartyDetails()
// // console.log('marriage view');
// // console.log('userlogin',req.session.user);
// if(req.session.user ){
//   // console.log('userlogin123',req.session.user);

//   res.render('marriage',{eventtype,eventresult,userValue})
// }else{
//   res.render('marriage',{eventtype,eventresult})

// }
//   })
//Select event Type
router.get('/select_marriage/:id', async (req, res) => {
  let eventid = req.params.id
  let eventtype = await adminHelpers.getEventType()
  console.log('select event type');

  console.log('user selesct', req.session.user);
  let typeevent = await userHelpers.getEvent(eventid)
  if (req.session.user) {
    console.log('user selesct  1233', req.session.user);

    res.render('marriage_Typeview', { eventtype, typeevent, userValue })
  }
  else {
    res.render('marriage_Typeview', { typeevent, eventtype })

  }
})

//select Birthday type

router.get('/select_marriage/:id', async (req, res) => {
  let eventid = req.params.id
  console.log('birthday id', eventid);
  let eventtype = await adminHelpers.getEventType()
  console.log('select event type', eventtype);

  console.log('user selesct', req.session.user);
  let typebirth = await userHelpers.getEventBirth(eventid)
  if (req.session.user) {
    console.log('user selesct  1233', req.session.user);

    res.render('birthday_typeview', { eventtype, typebirth, userValue })
  }
  else {
    res.render('birthday_typeview', { eventtype, typebirth })

  }
})
//select OfficeParty type
router.get('/select_marriage/:id', async (req, res) => {
  let eventid = req.params.id
  let eventtype = await adminHelpers.getEventType()
  console.log('select event type');

  console.log('user selesct', req.session.user);
  let typeevent = await userHelpers.getEventOfficeParty(eventid)
  if (req.session.user) {
    console.log('user selesct  1233', req.session.user);

    res.render('marriage_Typeview', { eventtype, typeevent, userValue })
  }
  else {
    res.render('marriage_Typeview', { typeevent, eventtype })

  }
})


router.get('/logout', (req, res) => {
  req.session.user = null
  // req.session.admin = null
  res.redirect('/')
})


module.exports = router;
