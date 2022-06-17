var express = require('express');
var router = express.Router();
const {addEvent,upload} = require('../helpers/admin-helpers')
const adminHelpers = require('../helpers/admin-helpers')

const multer  = require('multer');
const res = require('express/lib/response');
const userHelpers = require('../helpers/user-helpers');



/* Admin After Login */

router.get('/',async(req,res)=>{
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0');

  if(req.session.admin){
    const eventtype=await adminHelpers.getEventType()
const eventname=await adminHelpers.getEventName()
    admin = req.session.admin
    res.render('admin/add_eventlist',{admin,eventtype,eventname})
  }
  else{
    res.redirect('/login')
  }
})

/*view Booking */

router.get('/booking',async(req,res)=>{
  admin = req.session.admin
const allbooking=await adminHelpers.getAllBooking()
const bookId=await adminHelpers.findBookingId(allbooking)
// const efood= await adminHelpers.getSelectedBookingFood(bookId)

req.session.allbooking=allbooking
console.log(allbooking,'qqqqqq');
// console.log(efood,'55555555');
  res.render('admin/booking',{admin,allbooking})

})


/* Delete Booking */

router.get('/delete-booking/:id',(req,res)=>{
  adminHelpers.deleteBooking(req.params.id).then((response)=>{
    res.redirect('/admin/booking')
  })
})


/*Add Event Type */

router.get('/event_type',(req,res)=>{
  admin = req.session.admin

  res.render('admin/event_type',{admin})

})
router.post('/event_type',(req,res)=>{
  adminHelpers.addEventType(req.body).then((response)=>{
    console.log(response);
    res.redirect('/admin/event_Type')
  })
})

/* add event name */

router.get('/add_eventname',(req,res)=>{
  res.render('admin/add_eventname',{admin:true})
})
router.post('/add_eventname',(req,res)=>{
  adminHelpers.addEventName(req.body).then((response)=>{
    console.log(response);
    res.redirect('/admin/add_eventname')
  })
})

/* Add Events */

  router.post('/addEvent', upload.single("image"),(req,res)=>{
    if(req.session.admin){
 console.log('addevent');
addEvent(req.body,req.file).then((Response) => {
  console.log('added');
  res.redirect('/')
    })
  }
   
})
 


 /*view events */

router.get('/event_list',async(req,res)=>{
  console.log('55555555');
 let details=await adminHelpers.getEventDetails()
    res.render('admin/event_list',{admin:true,details})
})


/*Delete Event */

router.get('/delete-event/:id',(req,res)=>{
  let eventId=req.params.id
  adminHelpers.deleteEvent(eventId).then((response)=>{
    res.redirect('/admin/event_list')
  })
})


/* Edit events */

router.get('/edit-event/:id',async(req,res)=>{
  let event=await adminHelpers.findEvent(req.params.id)
  let type=await adminHelpers.getEventType()
  const name=await adminHelpers.getEventName()
  console.log(event, "event");
res.render('admin/edit_event',{admin:true,event,type,name})
})

router.post('/edit-event/:id',upload.single("image"),async(req,res)=>{
  let imageData = await adminHelpers.getEvent();
  
 
       
  var main_img=req.file ? req.file.filename : imageData[0].Image
adminHelpers.updateEvent(req.params.id,req.body,req.file,main_img).then(()=>{
  console.log('success');
  res.redirect('/admin/event_list')
 
})
})

/* food category */

router.get('/food_category',(req,res)=>{
 
    res.render('admin/food_category',{admin:true})

  })
  router.post('/food_category',(req,res)=>{
    adminHelpers.addCategory(req.body).then((response)=>{
      console.log(response);
      res.redirect('/admin')
    })
  })

  /* food sub category */

  router.get('/food_subcategory',async(req,res)=>{
    //const value=await adminHelpers.getCategory()
    // console.log(value+"dfghjkl");
    res.render('admin/food_subcategory',{admin:true})
  })
  router.post('/food_subcategory',(req,res)=>{
    adminHelpers.addSubCategory(req.body).then((response)=>{
      console.log(response);
      res.redirect('/admin')
    })
  })
// router.get('/food_category',(res,req)=>{
//   res.render('admin/food_category')
// })

/*Add food details */
router.get('/add_fooddetails',async(req,res)=>{
  const subcat=await adminHelpers.getSubcategory()
  const catgy=await adminHelpers.getCategory()
  console.log(subcat,"ghhhjdjjshh");
  console.log('======',catgy);
  res.render('admin/add_fooddetails',{admin:true,subcat,catgy})
})

router.post('/add_fooddetails', upload.single("image"), (req,res)=>{
  if(req.session.admin){
console.log(req.session.admin);
adminHelpers.addFoodDetails(req.body,req.file).then((Response) => {
console.log(' food added');
res.redirect('/admin/add_fooddetails')
  })
}
 
})
/* view food details */
router.get('/food_list',(req,res)=>{
  adminHelpers.getFoodDetails().then((food)=>{
    console.log('adminjs:',food);
    res.render('admin/food_list',{admin:true,food})

  })

})

/* Delete food */

router.get('/delete-food/:id',(req,res)=>{
  let foodId=req.params.id
  adminHelpers.deleteFood(foodId).then((response)=>{
    res.redirect('/admin/food_list')
  })
})

/* Edit food */
router.get('/edit-food/:id',async(req,res)=>{
  let findfood=await adminHelpers.findFood(req.params.id)
  let sub=await adminHelpers.getSubcategory()
  let cat=await adminHelpers.getCategory()
  console.log(findfood, "food");
  // const subcategoryvalue= await adminHelpers. listALLsubcategory()
res.render('admin/edit_food',{admin:true,findfood,sub,cat})
})

router.post('/edit-food/:id',adminHelpers.upload.single("image"),async(req,res)=>{
  let imageData = await adminHelpers.getFood();
  
 
       
  var main_img=req.file ? req.file.filename : imageData[0].Image
adminHelpers.updateFood(req.params.id,req.body,req.file,main_img).then(()=>{
  console.log('success');
  res.redirect('/admin/food_list')
  
})
})


//logout

router.get('/logout', (req, res) => {
  //console.log('hi');
  req.session.admin = null
  res.redirect('/')
  // res.redirect('/admin/login')

})

      module.exports = router;

































// var upload = multer({ storage: storage }).single('file')
// const upload = multer({ dest: 'uploads/' })

// const verifyLogin=(req,res,next)=>{
//   if(req.session.admin.loggedIn){
//     next()
//   }else{
//     res.redirect('/admin/login')
//   }
// }

      /* List view of carousal */

// router.get('/carousel_list',async(req,res)=>{
//   admin = req.session.admin
// const carousalimage= await adminHelpers.getCarousel()
//   res.render('admin/carousel_list',{admin,carousalimage})

// })

//delete carousel
// router.get('/delete-carousel/:id',(req,res)=>{
//   //  let eventId=req.params.id
//   adminHelpers.deleteCarousel(req.params.id).then((response)=>{
//     res.redirect('/admin/carousel_list')
//   })
// })


/* View User Selected Foods */

// router.get('/User_Selectedfoods/:id',async(req,res)=>{
//   admin = req.session.admin
// console.log(req.params.id,44444444);
//  const efood= await adminHelpers.getSelectedBooking(req.params.id)
//     res.render('admin/User_Selectedfoods',{admin,efood})
// })