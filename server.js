var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var mongoose = require("mongoose");
var mongoOp = require("./model/mongo");
mongoose.connect('mongodb://localhost:27017/userDB');
var cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));


router.get("/", function (req, res) {
    res.json({ "error": false, "message": "Hello World" });
});

router.route("/user/getAll")
    .get(function (req, res) {
        mongoOp.find(function (err, users){
            if(err){
              console.log(err);
            }
            else {
              res.json(users);
            }
          });
    });
router.route("/user/create")
    .post(function (req, res) {
        var db = new mongoOp(req.body);
        console.log("fsdfsdfsdf" + req.body)
        db.save()
            .then(db => {
                console.log(db);
                res.status(200).json({ 'db': 'Data added successfully' });
            })
            .catch(err => {
                res.status(400).send("unable to save the data into database");
            });
    });

router.route("/user/update/:id")
    .put(function (req, res) {
        var response = {};
        console.log(req.params)
        // first find out record exists or not
        // if it does then update the record
        mongoOp.findById(req.params.id, function (err, data) {
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                // we got data from Mongo.
                // change it accordingly.
                if (req.body.email !== undefined) {
                    // case where email needs to be updated.
                    data.email = req.body.email;
                }
                if (req.body.password !== undefined) {
                    // case where password needs to be updated
                    data.password = req.body.password;
                }
                // save the data
                data.save(function (err) {
                    if (err) {
                        response = { "error": true, "message": "Error updating data" };
                    } else {
                        response = { "error": false, "message": "Data is updated for " + req.params.id };
                    }
                    res.json(response);
                })
            }
        });
    });

router.route("/user/delete")
    .delete(function (req, res) {
        var response = "";
        console.log(req.body.password);
        var db = new mongoOp(req.body);
        // find the data
        mongoOp.find({password: req.body.password}, function (err, data) {
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                // data exists, remove it.
                mongoOp.remove({ password: req.body.password }, function (err) {
                    if (err) {
                        response = { "error": true, "message": "Error deleting data" };
                    } else {
                        response = { "error": true, "message": "Data associated with " + req.body.password + "is deleted" };
                    }
                    res.json(response);
                });
            }
        });
    })


app.use('/', router);

app.listen(3000);
console.log("Listening to PORT 3000");