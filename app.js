
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

// Close views and view engine.
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');

//app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// connect to db
mongoose.connect('mongodb://admin:123qwe@ds037768.mongolab.com:37768/todolist');

// Define schemes
var SpaceSchema = mongoose.Schema({
    title: String
});

var NoteSchema = mongoose.Schema({
    desc: String,
    reminder: Number,
    spaceId: Number
});

// Define models
var SpacesModel = mongoose.model('Spaces', SpaceSchema);
var NotesModel = mongoose.model('Notes', NoteSchema);

app.get('/space/list', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    SpacesModel.find(null, null, null, function(err, docs) {
        res.end(JSON.stringify(docs));
    });
});

app.post('/space/create', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (req.body.title) {
        var space = new SpacesModel();
        space.title = req.body.title;

        space.save(function(err, recorded) {
            res.end(JSON.stringify(recorded));
        });

    }
});

app.get('/note/list', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    var spaceId = Number(req.param('spaceId'));

    if (spaceId && !isNaN(spaceId)) {
        NotesModel.find({
            spaceId: spaceId
        }, null, null, function(err, docs) {
            res.end(JSON.stringify(docs));
        });
    }
});

app.post('/note/create', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (req.body.desc && req.body.spaceId) {

        var note = new NotesModel();

        note.desc = req.body.desc;
        note.spaceId = req.body.spaceId;
        note.reminder = req.body.reminder || 0;

        note.save(function(err, recorded) {
            res.end(JSON.stringify(recorded));
        });
    }
});

app.put('/note/update', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    var noteId = Number(req.body.noteId);
    if (noteId) {
        NotesModel.findById(noteId, null, null, function(err, result) {
            res.end(JSON.stringify(result));
        });
    }
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
