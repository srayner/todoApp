// server.js

// set up ======================================================================
var express = require('express');
var app = express();                   // create our app with express
var mongoose = require('mongoose');         // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration ===============================================================
mongoose.connect('mongodb://localhost/test');     // connect to local mongoDB database
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(methodOverride());

// define model ================================================================
var Task = mongoose.model('Task', {
    text : String,
    due: String
});

// api (routes) ================================================================

// GET - return all tasks
app.get('/api/tasks', function(req, res) {
    Task.find(function(err, tasks) {
        if (err) {
            res.send(err);
        } else {
            res.json(tasks);
        }
    });
});

// POST - create new task and send back all tasks after creation
app.post('/api/tasks', function(req, res) {
    Task.create({
        text : req.body.text,
        due : req.body.due,
        done : false
    }, function(err, task) {
        if (err) {
            res.send(err);
        } else {
            Task.find(function(err, tasks) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(tasks);
                }
            });
        }
    });
});

// PUT - update a task
app.put('/api/tasks/:task_id', function(req, res) {
    Task.findById(req.params.task_id, function(err, task) {
        if (err) {
            res.send(err);
        } else {
            task.text = req.body.text;
            task.due = req.body.due;
            task.save(function(err) {
                if (err) {
                    res.send(err);
                } else {
                    Task.find(function(err, tasks) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json(tasks);
                        }
                    });
                }
            });
        }
    });
});

// DELETE - remove a task
app.delete('/api/tasks/:task_id', function(req, res) {
    Task.remove({
        _id : req.params.task_id
    }, function(err, task) {
        if (err) {
            res.send(err);
        } else {
            Task.find(function(err, tasks) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(tasks);
                }
            });
        }
    });
 });

// return the client ip
app.get('/api/ip', function(req, res) {
   res.json(req.ip); 
});

// load the single view file (angular will handle the page changes on the front-end)
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});
    
// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");