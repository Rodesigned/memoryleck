const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

// Middleware
// =============================================================
app.use(bodyParser.json());
const parseUrlencoded = bodyParser.urlencoded({extended: false});

// multer for image upload
const multer = require('multer');
const upload = multer({
  dest: 'app/public/uploads/' // this configures multer to save your files into a directory called "uploads"
}); 


// ORM / DB Connection
// =============================================================
const connection = require("../config/connection");
const ORM = require("../config/orm");
const orm = new ORM(connection);


// Property
// =============================================================
// GET = get all vacant properties

router.route("/property")
.get(function(req, res) {
  orm.getVacantProperty((data)=>{
    res.json(data);
  })
});

router.post("/updateproperty", upload.single('img_1'), function(req, res) {
  // if(!req.body.property){return res.send("Bad request")}
  console.log('multer run', req.file);
  console.log(req.body);
  let property = {};
  for(let i in req.body){
    property[i] = req.body[i];
  }
  if(req.file){
    property.img_1 = req.file.path;
  }
   orm.upsertDB('property', property, function(){
    res.send('/landlord/home/' + property.landlord_id);
   });
});

// Tenant & Landlord Properties
// =============================================================

router.route("/property/tenant/:id")
.get(function(req, res) {  
  orm.getTenantProperties(req.params.id, (data)=>{
    res.json(data);
  });
});

router.route("/property/landlord/:id")
.get(function(req, res) { 
  orm.getLandlordProperties(req.params.id, (data)=>{
    res.json(data);
  });
});


// Payment
// =============================================================

router.route("/payment")
.post(function(req, res) {
  if(!req.body.payment){return res.send("Bad request")} 
  // console.log(JSON.parse(req.body.payment));
  orm.upsertDB('payment', JSON.parse(req.body.payment), function(){
    res.send('success');
   });
})
.delete(function(req, res) {
  if(!req.body.id){return res.send("Bad request")} 
  orm.deleteDB('payment', req.body.id, function(){
    res.send('success');
   });
});

// Request
// =============================================================

router.route("/request")
.post(function(req, res) {
  if(!req.body.request){return res.send("Bad request")}
  orm.upsertDB('request', JSON.parse(req.body.request), function(data){
    res.send('success');
  });
});

// User
// =============================================================

router.route("/user")
.post(function(req, res) {
  if(!req.body.uid || !req.body.email){return res.send("Bad request")}
  let redirectto = req.body.type === 'landlord' ? `/landlord/home/${req.body.uid}` : `/tenant/home/${req.body.uid}`;
  // console.log(req.body);
  orm.upsertDB('user', {
    uid: req.body.uid,
    email: req.body.email,
    name: req.body.name, 
    type: req.body.type
  }, function(err, data){
    res.send(redirectto);
  });
});


// Export
// ===========================================================

module.exports = router;