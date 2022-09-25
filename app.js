var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

const nocache = require("nocache");


var hbs=require('express-handlebars')
var app = express();

var db=require('./config/connection')
// var userModel=require('./models/User')

var session=require('express-session')


app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'secretkey',
  cookie:{maxAge:1200000}
}))
app.use((req,res,next)=>{
  res.set('Cache-Control','no-store')
  next()
})


// const e=(req,res,next)=>{
    
//   const {error}=camgroundSchema.validate(req.body)
//   if(error){
//       const msg=error.details.map(el=>el.message).join(',')
//       throw new ExpressError(msg,400)
//   }else{
//       next()
//   }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/admin', adminRouter);

app.use(nocache());


// SET STORAGE

// var storage = multer.diskStorage({
//   destination: (req,file,cb)=>{
//     cb(null,"./images")
//   },
//   filename:(req, file, cb)=> {
//     cb(null, Date.now() + "--"+ file.originalname)
//   },
//   //filename: function (req, file, cb) {
//   //   cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
//   // }
// })
//var upload = multer({ 
//   storage: storage
//  })

// app.post("/upload",upload.single("image"),(req,res)=>{
//   console.log(req.file);
//   res.send("single file upload success")
// })

// app.get("/",(req,res)=>{
//   res.render("index");
// })
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
