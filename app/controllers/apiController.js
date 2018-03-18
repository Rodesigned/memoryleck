const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

// Middleware
// =============================================================
app.use(bodyParser.json());
const parseUrlencoded = bodyParser.urlencoded({extended: false});


// ORM / DB Connection
// =============================================================
const connection = require("../config/connection");
const ORM = require("../models/orm");
const orm = new ORM(connection);

// Routes
// =============================================================

// GET all properties + images
router.route("/property")
.get(function(req, res) {
  console.log('getting api/property');
  orm.getVacantProperty((data)=>{
    res.json(data);
  })
})
.post(function(req, res) {
  if(!req.body.property){return res.send("Bad request")}
   orm.postProperty(req.body.property, function(){
    res.redirect('/landlord-home');
   });
});

// PUT property
router.route("/property/:id")
.put(function(req, res) {
  if(!req.body.property){return res.send("Bad request")}
   orm.postProperty(req.body.property, function(){
    // res.redirect('/landlord-home');
    res.send('got it');
   });
});

// GET properties for a tenant + payments + requests
router.route("/property/tenant/:id")
.get(function(req, res) {  
  orm.getTenantProperties(req.params.id, (data)=>{
    res.json(data);
  });
});

// GET properties for an landlord + payments + requests 
router.route("/property/landlord/:id")
.get(function(req, res) { 
  orm.getLandlordProperties(req.params.id, (data)=>{
    res.json(data);
  });
});

// POST payment
router.route("/payment")
.post(function(req, res) {
  if(!req.body.payment){return res.send("Bad request")}
   orm.postPayment(req.body.payment, function(){
    res.redirect('/tenant-home');
   });
});

/*// POST request 
app.post("/api/request", function(req, res) {
  if(!req.body.request){return res.send("Bad request")}
  let redirectto = req.body.user.type === 'landlord' ? '/landlord-home' : '/tenant-home';
  
  orm.postRequest(req.body.request, function(){
    res.redirect(redirectto);
  });
});

// PUT request 
app.put("/api/request/:id", function(req, res) {
  if(!req.body.request){return res.send("Bad request")}
  let redirectto = req.body.user.type === 'landlord' ? '/landlord-home' : '/tenant-home';
  
  orm.postRequest(req.body.request, function(){
    res.redirect(redirectto);
  });
});

// POST a user 
app.post("/api/user", function(req, res) {
  if(!req.body.user){return res.send("Bad request")}
  let redirectto = req.body.user.type === 'landlord' ? '/landlord-home' : '/tenant-home';
  
  orm.postUser(user, function(){
    res.redirect(redirectto);
  });
});*/


// Export
// ===========================================================

module.exports = router;