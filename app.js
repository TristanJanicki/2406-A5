var express           = require('express');
var path              = require('path');
var favicon           = require('serve-favicon');
var logger            = require('morgan');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
var hbs               = require('express-handlebars');
var expressValidator  = require('express-validator');
var flash             = require('connect-flash');
var paypal            = require('paypal-rest-sdk');
var Handlebars        = require("handlebars");
var MomentHandler     = require("handlebars.moment");
var session           = require('express-session');
var passport          = require('passport');
var MongoStore        = require('connect-mongo')(session);
var mongoose          = require('mongoose');
var PORT              = 3000

// connection string to free mongodb.Atlas hosting.
// 
mongoose.connect("mongodb+srv://ecommerceAdmin:ecommerceAdminPw1@comp2406a5-nj8mr.mongodb.net/yardAndGarage?retryWrites=true", { useNewUrlParser: true, useCreateIndex: true, });

var index = require('./routes/index');
var users = require('./routes/users');
var checkout = require('./routes/checkout');
var dashboard = require('./routes/dashboard');


// PayPal Configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AWwgBTMB1MdtTmMRnwZa9yNV_2ZRnrM_nFUq_MqqIWTVf_UY8aq-LXe14ENurK31UJ8oyb8YX-yvpaVj',
  'client_secret': 'EO7yM1sRrAGJk2WSm_PTGVdWZIy2p6hokUIeQZC_jZzABjQRXLHN1qQBfF56IeBSbz8Y9YIF6ga8c8Le'
});

// Moment Configuration -- For dates
MomentHandler.registerHelpers(Handlebars);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
  secret            : 'secret',
  saveUninitialized : false,
  resave            : false,
  store             : new MongoStore({mongooseConnection: mongoose.connection}),
  cookie            : {maxAge: 120 * 60 * 1000} // 2 hours later experies the session
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root          = namespace.shift(),
    formParam     = root;

    while(namespace.lenght) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Flass Configuration for messages
app.use(flash());

// Flash - Global variables
app.use(function(req, res, next){
  res.locals.success_msg  = req.flash('success_msg');
  res.locals.error_msg    = req.flash('error_msg');
  res.locals.error        = req.flash('error'); // Pasport error message
  res.locals.user         = req.user || null;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/checkout', checkout);
app.use('/dashboard', dashboard);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var e = new Error('Not Found');
  e.status = 404;
  next(e);
});

// error handler
app.use(function(e, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = e.message;
  res.locals.error = req.app.get('env') === 'development' ? e : {};

  // render the error page
  res.status(e.status || 500);
  res.render('error', {
    title: 'Something went wrong',
    customNavbar: 'registration-navbar',
    containerWrapper: 'container',
    errorStatus: e.status
  });
});

module.exports = app;


//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log('https://tristanzon.herokuapp.com/')
  }
})