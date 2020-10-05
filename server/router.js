const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const uri = 'mongodb+srv://Hari:Harikishore@cluster0.bjl2j.mongodb.net/register?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const {cloudinary} = require('./cloudinary')
const ObjectID = require('mongodb').ObjectID;
client.connect((err, dbInstance) => {
    if (err) {
        console.log(err)
    }
    else {

        console.log('connected to db')
    }
    const dbObject = dbInstance.db('register');
    const dbCollection = dbObject.collection('project');
    // SIGN UP USER
    router.post('/signup',(req,res)=>{
      const error = {};
      let data = {};
        //   FIND THE USERNAME ALREADY EXISTS
       dbCollection.findOne({email:req.body.email},(err,result)=>{
          if (err) {
            console.log(err);
          }
          // USER ALREADY EXISTS
          else if (result) {
            error.message = "This email is already registered";
            res.status(401).send(error);
          }
          else{
            dbCollection.findOne({username:req.body.username},(_err1,_result1)=>{
              if(_err1) console.log(_err1)
              else if(_result1){
                 error.message = "This username is already taken";
                 res.status(401).send(error);
              }
              else{
                // HASHING THE PASSWORD
                bcrypt.genSalt(10, (err, salt) => {
                  if (err) console.log(err);
                  bcrypt.hash(req.body.password, salt, (err, hash) => {
                    data = {
                      email: req.body.email,
                      username: req.body.username,
                      hashPassword: hash,
                      images: [],
                      profile: "",
                    };
                    // INSERT USER INFO
                    dbCollection.insertOne(data, (_err, _result) => {
                      if (_err) console.log(err);
                      else {
                        console.log(_result.ops);
                        res.send("success");
                      }
                    });
                  });
                });
              }
            })
          
          }

      })
    })
    router.post('/signin',(req,res)=>{
        console.log(req.body)
        const data = req.body
        let error = ""
        dbCollection.findOne({ email: data.email }, (err, result) => {
           console.log(result);
           if (err) {
             console.log(err);
           }
           // CHECK NAME IS EXIST
           else if (!result) {
              error = "This email is not registered";
              res.status(401).send(error);
           }
             // CHECK PASSWORD IS CORRECT USING BCRYPT
            bcrypt.compare(data.password,result.hashPassword,(err,results)=>{
                 if(!results){
                   error = "Password is not valid"
                   res.status(401).send(error);
                 }
                 else{
                     res.send(JSON.stringify({username:result.username,profile:result.profile}))
                     console.log("success")
                 }
             });
        
         });
    });
    // GOOGLE USER
    router.post('/google',(req,res)=>{
      console.log(req.body)
      let items = req.body
      dbCollection.findOne({email:req.body.email},(err,result)=>{
        if(err) console.log(err)
        else if(!result){
          items.images=[]
          dbCollection.insertOne(items,(_err,_result)=>{
              if(_err) console.log(_err)
              else{
                console.log("Inserted")
              }
          })
        }
        else{
          res.send("succes")
        }
      })
    })    





    //HOME PAGE
    router.post('/home',async (req,res)=>{
          let pic = ""
          const objectId = new ObjectID()
    try{
          let items = req.body.image;
          // console.log(items);
          const uploadedResponse = await cloudinary.uploader.upload(items,(err,res)=> {
            if(err){
              console.log(err)
            }
            else{
              console.log("success")
            }
            // upload_preset: "dev_setups",
          });
          console.log(uploadedResponse.public_id);
          pic = uploadedResponse.public_id;
    }
    catch(err){
      console.log(err)
    }
    
      dbCollection.findOne({username:req.body.username},(err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          // delete result._id
          // console.log(result)
          result.id = objectId
          let items = result
          items.images.unshift(pic);
          dbCollection.updateOne({username:items.username},{$set:items},(err,result)=>{
            if(err){
              console.log(err)
            }
            else{
              console.log("updated")
            }
          })
        }
      })
    })
    router.get('/home',(req,res)=>{
      // console.log(objectId.getTimestamp());
      dbCollection
        .find()
        .sort({ id: -1 })
        .toArray((err, result) => {
          if (err) console.log(err);
          else {
            res.send(result);
            // console.log(res)
          }
        });
    })
    // FOR DISPLAY MY IMAGES
    router.get('/photos/:name',(req,res)=>{
      console.log(req.params.name)
      dbCollection.findOne({username:req.params.name},(err,result)=>{
        if(err) console.log(err)
        else{
          res.send(result)
        }
      })
    })

});


module.exports = router





