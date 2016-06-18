var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var engines = require('consolidate');
var mongodbURL = 'mongodb://localhost:27017/socailcops';
var nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
    auth: {
        user: "abhinitrkl475@@gmail.com",
        pass: "hak31893jan@"
    }
});


mongoose.connect(mongodbURL);
// create a user model
var User = mongoose.model('User', {
  name: String,
  email:String,
  role: Number
});


var socketio = require('./notify.js');

app.set('port',process.env.port || 8080);


app.use(express.static(__dirname + '/app/public/admin'));
app.set('views',path.resolve('.')+'/app/public');
app.engine('html', engines.mustache);
app.set('view engine','html');
// request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var admin = io.of('/');

app.post('/api/insert',function(req,res){
  User.create({
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  },function(err,users){
      if(err){
        res.send(err);
      }
      User.find(function(err,users){
        if(err){
          res.send(err);
        }

        for(i=0;i<users.length;i++){
          if(users[i].email != 'undefined'){
            var mailOptions = {
                from: "abhinitrkl475@gmail.com", // sender address
                to: users[i].email, // list of receivers
                subject: "Welcome "+req.body.name, // Subject line
                text: "A New User inserted into the database "+req.body.email+' '+req.body.role, // plaintext body
                html: "<h1> Welcoming"+req.body.name+"</h1>" // html body
            }

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }

                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
            });
          }
        }

        res.json(users);
      });
  });
});


app.get('/new',function(req,res){
  res.render('admin/index2.html')
});

app.get('/getstarted',function(req,res){
  res.render('admin/getstarted.html')
});

app.get('/prac',function(req,res){
  res.render('admin/practice.html')
})

app.post('/api/update',function(req,res){

});

app.post('/api/delete',function(req,res){

});

app.get('/api/select',function(req,res){
  User.find(function(err,users){
    if(err){
      console.log(err);
    }
    res.json(users)
  });
});

app.get('/user',function(req,res){
  res.render('user/index.html');
});

app.get('/admin',function(req,res){
  res.render('admin/index.html')
})


server.listen(app.get('port'),function(){
  console.log('SocialCops is listening on ',app.get('port'));
});
