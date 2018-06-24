require('dotenv').config();
var express  = require('express');
var cors = require('cors');
var app      = express();

var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(cors());

app.options('*', cors());

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.post('/api/sendmail',cors(),function(req,res){
  //console.log(req.body);
  var email = req.body;
  // using SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require('@sendgrid/mail');
  if(process.env.SENDGRID_API_KEY){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email.to,
      from: email.from,
      subject: email.subject,
      html: email.html
    };
    sgMail.send(msg);
    res.sendStatus(200);
  }else{
    console.log('error',"SendGrid API KEY not set");
  }
});

app.listen(8081);
console.log("App listening on port 8081");