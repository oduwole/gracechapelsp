var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'); // ,
    // multer = require('multer'); //,
//request = require('request'),
//cors = require('cors');
var passport = require('passport');
var   Strategy = require('passport-twitter');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var compression = require('compression');

// var auth = require('app/config/auth');
// var Service =  require('app/helper/Service');


var app = express();

var staticRoot = __dirname + '/';

/** Application Insight */
var appInsights = require("applicationinsights");
appInsights.setup("99c1ed13-5c10-4faa-8076-0b6a7ee67c51")
.setAutoDependencyCorrelation(true)
    //.setAutoCollectRequests(true)
    //.setAutoCollectPerformance(true)
    //.setAutoCollectExceptions(true)
    //.setAutoCollectDependencies(true)
    //.setAutoCollectConsole(true)
    //.setUseDiskRetryCaching(true);
//appInsights.start();

app.set('port', (process.env.PORT || 3020));

app.use(express.static(staticRoot));
//app.use(express.static(__dirname + '/public'));

//app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression())
    //app.use(cors());

    var configDB = require('./server/config/database.js');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./server/passport')(passport); // pass passport for configuration

//app.configure(function () {

    // set up our express application
    //app.use(express.logger('dev')); // log every request to the console
    //app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(cookieParser()); 
    //app.use(express.bodyParser()); // get information from html forms

    //app.set('view engine', 'ejs'); // set up ejs for templating

    // required for passport
    //app.use(express.session({ secret: 'slkreatives' })); // session secret
    app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

//});


require('./server/routes.js')(app, passport); 

var json = {
    "name": "Test",
    "email": "test@xxxx.in",
    "phone": "989898xxxx"
};

var options = {
    url: 'https://api-mean.herokuapp.com/api/contacts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    json: json
};

const imageFilter = function(req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
app.get('/', function (req, res) {
    console.log('requesting index page');
    console.log(staticRoot);
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + 'index2.html').pipe(res);
})

app.get('/about', function (req, res) {
    console.log('requesting about page');
    console.log(staticRoot);
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_about.html').pipe(res);
})

app.get('/contact', function (req, res) {
    console.log('requesting contact page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_contactus.html').pipe(res);
});

app.get('/jobs', function (req, res) {
    console.log('requesting portfolio page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_jobs.html').pipe(res);
});

app.get('/services', function (req, res) {
    console.log('requesting portfolio page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_services.html').pipe(res);
});

app.get('/projects', function (req, res) {
    // console.log(req.path);
    console.log('requesting team page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_ourproj.html').pipe(res);
});

app.get('/terms', function (req, res) {
    // console.log(req.path);
    console.log('requesting team page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_terms.html').pipe(res);
});

app.get('/pricing', function (req, res) {
    // console.log(req.path);
    console.log('requesting pricing page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_pricing.html').pipe(res);
});

app.get('/admin/chat', function (req, res) {
    console.log('requesting contact page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_adminchat.html').pipe(res);
});

app.get('/login', function (req, res) {
    // console.log(req.path);
    if (req.query.origin){
        req.session.returnTo = req.query.origin;
    }
    else{
        req.session.returnTo = req.header('Referer');
    }
    console.log('requesting pricing page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_signin.html').pipe(res);
});
app.get('/privacy', function (req, res) {
    console.log('requesting privacy policy page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(staticRoot + '_contactus.html').pipe(res);
});

app.get('/.well-known/acme-challenge/rYOe6CGJpj8-vjcJ7z4n4JqzivtfrcdSoCKt31N7Npc', function (req, res) {
    // conole.log('requesting about page');
    var filePath = path.join(__dirname, 'freessl/rYOe6CGJpj8-vjcJ7z4n4JqzivtfrcdSoCKt31N7Npc');
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
    //fs.createReadStream(staticRoot + '__aboutus.html').pipe(res);
})

app.get('/.well-known/acme-challenge/50EDoALkIIXQCujF-ULW0B0s9VTf6XMtHCuAu2GEAiU', function (req, res) {
    // conole.log('requesting about page');
     var filePath = path.join(__dirname, 'freessl/50EDoALkIIXQCujF-ULW0B0s9VTf6XMtHCuAu2GEAiU');
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
    //fs.createReadStream(staticRoot + '__aboutus.html').pipe(res);
})





var router = express.Router();
/** API path that will upload the files */


app.use(function(req, res, next) {
    /*res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", app.get('port'));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);*/
    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== '') {
        return next();
    }
    console.log(req.originalUrl)
    var url=req.originalUrl;
    switch (url) {
        case '/a-solidarity-letter-to-all-mean-and-scornful-humans-of-nigeria':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/studying-performing-arts-in-nigeria-is-not-a-joke-and-should-be-celebrated':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/who-influences-the-art-is-an-unending-debate-the-artist-or-the-society':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/things-you-should-check-after-submitting-for-a-competition':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/nigerians-see-5-ways-to-kill-yourself-suddenly':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/children-series-tade-and-the-good-charm-of-kindness':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/if-stinginess-is-in-your-hands-poverty-will-never-stray-from-your-fingers':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/lets-live-today-and-tomorrow-we-die-well-maybe-not':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/sunny-nejis-aeroplane-turner-is-the-ideal-song-for-naija-right-now':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/the-day-after-mandela-died-a-memoir':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/some-days-life-happen-to-us-and-other-days-we-happen-to-life':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/just-like-nigerian-foods-we-all-need-embellishment-in-life':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/life-in-transit-the-life-reality-check':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/how-i-began-to-love-scars':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/nigeria-thy-people-are-great':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/tapping-into-the-evolving-art-of-heroic-cartoons':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/we-must-strive-from-the-bottom-to-get-to-the-top-and-dont-quit-in-between':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/an-art-critic-is-not-necessarily-a-pro':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/fiction-shewas-chronicles-tales-of-our-lives-pt1':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/shewas-chronicles-oga-toaster-every-girl-is-not-a-bread':
            res.redirect('http://blog.seekerslocus.com' + req.path);
            break;
        case '/the-praying-mantis-and-tortoise-a-folklore-in-igbo':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/the-praying-mantis-and-tortoise-a-folklore-in-igbo-a-sequel':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/gehenna-in-peace-a-cry-from-the-north':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/shewas-chronicles-an-ugly-encounter-with-an-aladura':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/eavesdrop-the-chronicles-of-a-hawker':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/goodbye-mortar-and-pestle-my-childhood-fantasies':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/nimisola-chronicles-of-a-wanderer':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/my-dream-reality-a-chant-to-spur-me':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/let-our-future-live-today':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/a-case-of-love-and-hate':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/i-make-lives-thrive':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/i-am-the-wind-fire-and-snow':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/how-to-calm-your-temper-in-not-so-cool-situations':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/keke-maruwa-adventures-watch-your-temper':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/my-jollof-rice-convo-with-a-nigerian-kid':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/skin-bleaching-and-how-it-affects-teenagers-in-nigeria':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/reasons-why-you-should-smile-more-and-kiss-frowning-goodbye':
        console.log(url);
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        case '/what-does-it-take-to-forgive-a-stranger':
                res.redirect('http://blog.seekerslocus.com' + req.path);
                break;
        default:
            fs.createReadStream(staticRoot + 'index2.html').pipe(res);
            break;
    }
    
    fs.createReadStream(staticRoot + 'index2.html').pipe(res);

});


//app.all('/*', function(req, res, next) {
//    res.sendFile('index.html', { root: __dirname + '/' });
//});


var redis = require("redis");
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//var sio = require("socket.io");
var client = redis.createClient();
//var client = redis.createClient(6380, 'lineament.redis.cache.windows.net', { auth_pass: 'sc/T95+iN1g+eIzhzMExc4YE8IpvHsPf8MfBwzn1MYM=', tls: { servername: 'lineament.redis.cache.windows.net' } });
var ChatMessage = require('./server/model/chatmessage');

// app.listen(app.get('port'), function () {
//     console.log('app running on port', app.get('port'));
// });
server.listen(app.get('port'), function () {
   console.log('app running on port', app.get('port'));
});

var clients = {};
var clientsList=[];

function savechat(req) {
   var newMessage = new ChatMessage();
   var currentDate = new Date();
   console.log(req.message);
   var message = req;

   newMessage.receiver = message.to;
   newMessage.body = message.message,
       newMessage.author = message.username,
       newMessage.deleted = false,
       newMessage.updated_at = currentDate,
       newMessage.created_at = currentDate,
       /*newMessage.save(function (err) {
           if (err) throw err;
           console.log('new chat ' + newMessage.receiver + ' created!');
       });*/
       newMessage.save().then(function (err) {
        if (err) throw err;
        console.log('new chat ' + newMessage.receiver + ' created!');
    }).catch(function(err){

    });
}


client.on("error", function (err) {
   console.log("Error " + err);
});
io.on('connection', function (socket) {
   console.log('user connected');
   socket.on('chat message', function (msg) {
    console.log(msg);
       console.log('clients list are '+  clients[msg.to].socket);
       console.log('message sent is ' + msg.to);
       //io.sockets.connected[clients[msg.to].socket] = io.sockets.connected[socket.id];
       //if (clients[msg.username]) {
           //io.sockets.connected[clients[msg.to].socket].emit("chat message", msg);
            
       //} else {
           //console.log("User does not exist: " + msg.username);
       //}
       //io.emit('chat message', msg);

       client.get("mastersocket", function (err, socketId) {
           if (err) throw err;
           io.sockets.connected[socketId].emit("chat message",msg);
       });
       savechat(msg);
   });
   /*socket.on('disconnect', function () {
       console.log('user disconnected');
   });*/

   var addedUser = false;

 // when the client emits 'new message', this listens and executes
 socket.on('new message', function (data) {
   // we tell the client to execute 'new message'
   socket.broadcast.emit('new message', {
     username: socket.username,
     message: data
   });
 });

 socket.on('list-connected',function(){
     socket.broadcast.emit('list-connected', clientsList);
 });

   socket.on('add-user', function (data) {
       var ccount=0;
       var found = false;
       client.set("mastersocket", socket.id, function (err) {
           if (err) throw err;
           console.log("Master socket is now" + socket.id);

       });
        
       for (var i = 0; i < clientsList.length; i++) {
           if (clientsList[i].username == data.username) {
               ccount=i;
               found = true;
               break;
           }
       }
       if(!found){
           clients[data.username] = {
               "socket": socket.id,
           };
           clientsList.push({
               username: data.username,
               socketId: socket.id
           });
            
       }else{
           var theClient= clientsList[ccount].socketId;
           clients[data.username] = {
               "socket": theClient, //socket.id,
           };
           socket.id=theClient;
       }
        
        
       console.log(data);
       console.log(socket.id);
       socket.broadcast.emit('user joined', clientsList);
       //console.log(socket);
   });

 // when the client emits 'add user', this listens and executes
 socket.on('add user', function (username) {
   if (addedUser) return;

   // we store the username in the socket session for this client
   socket.username = username;
   ++numUsers;
   addedUser = true;
   socket.emit('login', {
     numUsers: numUsers
   });
   // echo globally (all clients) that a person has connected
   socket.broadcast.emit('user joined', {
     username: socket.username,
     numUsers: numUsers
   });
 });

 // when the client emits 'typing', we broadcast it to others
 socket.on('typing', function () {
   socket.broadcast.emit('typing', {
     username: socket.username
   });
 });

 // when the client emits 'stop typing', we broadcast it to others
 socket.on('stop typing', function () {
   socket.broadcast.emit('stop typing', {
     username: socket.username
   });
 });

 // when the user disconnects.. perform this
 socket.on('disconnect', function () {
   if (addedUser) {
     --numUsers;

     // echo globally that this client has left
     socket.broadcast.emit('user left', {
       username: socket.username,
       numUsers: numUsers
     });
   }
});

});
