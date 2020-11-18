const express = require('express')
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require('http');
const app = express();
app.use(express.static("public"));
const SGmail = require('@sendgrid/mail');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
var mongoose = require('mongoose');
/*const path=require('path');
const crypto=require('crypto');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');
app.use(bodyParser.json());
app.use(methodOverride('_method'));*/

mongoose.connect('mongodb://localhost:27017/ambulare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
const patientSchema = new mongoose.Schema({
  email: String,
  password: String,
  confirm_password: String,
  address: String,
  address2: String,
  city: String,
  state: String,
  Zip: Number,
});
const hospitalSchema = new mongoose.Schema({
  _id: String,
  name: String,
  address: String,
  address2: String,
  email: String,
  lat: String,
  long: String,
  password: String,
  cpassword: String,
  name_d1: String,
  spec_d1: String,
  name_d2: String,
  spec_d2: String,
  driv: String,
  amb: String,
});
const ambulanceSchema = new mongoose.Schema({
  _id: String,
  a_no1: String,
  avail_no1: String,
  a_no2: String,
  avail_no2: String,
  a_no3: String,
  avail_no3: String,
});
const driverSchema = new mongoose.Schema({
  _id: String,
  name_dr1: String,
  dr_no1: String,
  avail_dr1: String,
  name_dr2: String,
  dr_no2: String,
  avail_dr2: String,
  name_dr3: String,
  dr_no3: String,
  avail_dr3: String,
});
const answerSchema = new mongoose.Schema({
  name: String,
  password:String,
  ans:String,
});

const patient = mongoose.model("patient", patientSchema);
const ambulance = mongoose.model("ambulance", ambulanceSchema);
const hospital = mongoose.model("hospital", hospitalSchema);
const answer=mongoose.model("answer",answerSchema);
var flat=0;
var flong=0;
var d_name="";

const driver = mongoose.model("driver", driverSchema);
var h_name = "";
app.get("/", function(req, res) {


  check();
  res.render("index.ejs", {
    h_name: h_name
  });
  //res.render("index.ejs");

})
app.get("/hospital", function(req, res) {
  res.render("HOSPITAL.ejs");
})
app.get("/hospital_home", function(req, res) {
res.render("hospital_home.ejs");
})
app.get("/aboutus", function(req, res) {
  res.render("aboutus.ejs");
})
app.get("/after_booking", function(req, res) {
  res.render("after_booking.ejs",{flat:flat,flong:flong,h_name:h_name,d_name:d_name});
})
app.get("/register_patient", function(req, res) {
  res.render("register_patient.ejs");
})
app.get("/register_hospital", function(req, res) {
  res.render("register_hospital.ejs");
})

app.post("/hospital_home", function(req, res) {
  let name = req.body.name;
  let password = req.body.password;
  let ans=req.body.ans;

  answer.findOne({
    name: name,
    password: password,
  }, function(err, result) {
    if(err)
    console.log("error");
    if (result)
      res.redirect("/hospital_home");
    else
      {
      const r=new answer({
        name:name,
        password:password,
        ans:ans,
      })
      r.save();
      res.redirect("/hospital_home");
      }
  })
})
app.post("/register_hospital", function(req, res) {
  let name = req.body.name;
  let address = req.body.address;
  let address2 = req.body.address2;
  let email = req.body.email;
  let lat = req.body.lat;
  let long = req.body.long;
  let pass = req.body.password;
  let cpass = req.body.cpassword;
  let name_d1 = req.body.name_d1;
  let spec_d1 = req.body.spec_d1;
  let name_d2 = req.body.name_d2;
  let spec_d2 = req.body.spec_d2;
  let amb = req.body.name;
  let driv= req.body.name;
  let id1 = req.body.name;
  let a_no1 = req.body.a_no1;
  let avail_no1 = req.body.avail_no1;
  let a_no2 = req.body.a_no2;
  let avail_no2 = req.body.avail_no2;
  let a_no3 = req.body.a_no3;
  let avail_no3 = req.body.avail_no3;
  let id2 = req.body.name;
  let name_dr1 = req.body.name_dr1;
  let dr_no1 = req.body.dr_no1;
  let avail_dr1 = req.body.avail_dr1;
  let name_dr2 = req.body.name_dr2;
  let dr_no2 = req.body.dr_no2;
  let avail_dr2 = req.body.avail_dr2;
  let name_dr3 = req.body.name_dr3;
  let dr_no3 = req.body.dr_no3;
  let avail_dr3 = req.body.avail_dr3;
  hospital.findOne({
    name: name,
    password: pass
  }, function(err, result) {
    if (err)
      console.log(err);
    if (result)
      console.log("already saved");
    else {
      const ye = new hospital({
        _id: name,
        name: name,
        address: address,
        adddress2: address2,
        email: email,
        lat: lat,
        long: long,
        password: pass,
        cpassword: cpass,
        name_d1: name_d1,
        spec_d1: spec_d1,
        name_d2: name_d2,
        spec_d2: spec_d2,
        driv: driv,
        amb: amb,
      });
      const yeah = new ambulance({
        _id: id1,
        a_no1: a_no1,
        avail_no1: avail_no1,
        a_no2: a_no2,
        avail_no2: avail_no2,
      });
      const yeah1 = new driver({
        _id: id2,
        name_dr1: name_dr1,
        dr_no1: dr_no1,
        avail_dr1: avail_dr1,
        name_dr2: name_dr2,
        dr_no2: dr_no2,
        avail_dr2: avail_dr2,
        name_dr3: name_dr3,
        dr_no3: dr_no3,
        avail_dr3: avail_dr3,
      });
      ye.save();
      yeah.save();
      yeah1.save();
      res.redirect("/hospital_home");
    }
  })
})
app.post("/register_patient", function(req, res) {
  let email = req.body.email;
  let pass = req.body.password;
  let cpass = req.body.cpassword;
  let address = req.body.address;
  let address2 = req.body.address2;
  let city = req.body.city;
  let state = req.body.state;
  let zip = req.body.zip;
  patient.findOne({
    email: email
  }, function(err, result) {
    if (err)
      console.log(err);
    if (result)
      console.log("already saved");
    else {
      const res=new answer({
     email:email,
     password:pass,
     cpassword:cpass,
     address:address,
     caddress:caddress,
     city:city,
     state:state,
     zip:zip,
   })
     res.save();
      res.redirect("/hospital");
    }
  })
})
app.post("/", function(req, res) {
  let email = req.body.name;
  let password = req.body.password;
  patient.findOne({
    email: email,
    password: password
  }, function(err, result) {
    if (result)
      res.redirect("/hospital");
    else
      res.redirect("/");
  })
})
app.post("/", function(req, res) {
  let name = req.body.name1;
  let password = req.body.password1;
  hospital.findOne({
    name:name,
    password: password
  }, function(err, result) {
    if (result)
      res.redirect("/hospital_home");
    else
      res.redirect("/");
  })
})

function mail(n)
{
  const sgMail = require('@sendgrid/mail');
 sgMail.setApiKey('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');
const msg = {
to: n,
from: 'shrutimahajan2812@gmail.com',
subject: 'AMBULARE',
text: 'AMBULANCE NEEDED',
html: '<strong>IS THERE ANY AMBULANCE AVAILABLE...THEN REPLY WITH YES ASAP</strong>',
};
sgMail.send(msg).then(() => {
    res.redirect('/');
}).catch((error) => {
    console.log('error', error);
});
}
function check() {

  const https = require('https');

  https.get('https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyCcqGoh3JSwGsopwo81zRXaPr_uQNI4zCM&query=hospital&location=30.903900,75.893560&radius=5000', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var places = new Array();
      for (i = 0; i < 19; i++) {
        places[i] = JSON.parse(data).results[i].name;
      }
      i = 0;
      var m = setInterval(set1, 10000);
      var c = 0;
      var f=0;
      function stop1() {
        console.log("inside stop1")
        clearInterval(m);
        m=0;
        return ;
      }

       function set1(){
         var n = "" + places[i];
         console.log(n);
         hospital.findOne({name:n},function(err,hos){
         if(err)
         console.log("error");
         if(hos){
         var e=hos.email;
         var d=hos.driv;
         var a=hos.amb;
          flat=hos.lat;
          flong=hos.long;
         ambulance.findOne({_id:a},function(err,amb){
         if(err)
         console.log("error");
         if(amb)
         {
         var c=0;
         if(amb.avail_no1=="yes")
         {
         c=1;
         }
         else if(amb.avail_no2=="yes")
         {
         c=2;
         }
         if(c===0)
         {console.log("not found");
         i=i+1;}
         else
         {
         driver.findOne({_id:a},function(err,res){
         if(err)
         console.log("error");
         if(res){
         var p=0;
         if(res.avail_dr1=="yes")
         {
           p=1;
           d_name=res.name_dr1;
         }
         else if(res.avail_dr2=="yes")
         {
         p=2;
         d_name=res.name_dr2;
         }
         else if(res.avail_dr3=="yes")
         {
         p=3;
         d_name=res.name_dr3;
         }
         if(p===0)
         {console.log("not found");
         i=i+1;}
         else
         {
           console.log("inside else");
           mail(n);

          var y = setInterval(set, 500);
          function stop() {
            console.log("inside stop");
             clearInterval(y);
           }
           var q=0;
           function set()
           {
             console.log("inside set");
             console.log("f"+f);
             console.log("q"+q);

           answer.findOne({name:n},function(err,res){
           if(res)
           {
             console.log(res);
             f=1;
             q=20;
             h_name=n;
           }
           else
           q=q+1;
           if(q===19||f===1)
           stop();
         })
           }
         }
         }

         })
         }
         }
         })
         }}
         )
          i=i+1;
         console.log("before stop1");
         console.log(f);
         if(f===1)
         {
           console.log("f == 1");
           stop1();}
       }
})
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
app.listen(process.env.PORT || 3000, function() {
  console.log("port 3000 is on");
})
