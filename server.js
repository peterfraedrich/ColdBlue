//// server.js
//// PETER CHRISTIAN FRAEDRICH

// ================ SETUP ========================== // 

    var connect = require('connect');
    var application_root = __dirname,
        express = require('express'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        errorhandler = require('errorhandler'),
            path = require('path');
            var databaseUrl = 'db.asti-usa.com:27017/stv2';
    var collections = ['hosts'];
    var db = require('mongojs').connect(databaseUrl, collections);
        var app = express();
  
// ================ CONFIG ========================= //
   
        app.use(bodyParser());
        app.use(methodOverride());
        app.use(errorhandler());
        app.use(express.static(path.join(application_root, "public")));

// ================ API ================== //

    app.get('/api', function (req, res) {
        res.send('Our Sample API is up...');

    });

//// GET HOSTS
    app.get('/get', function (req, res) {
        console.log("GET: ");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        db.hosts.find('', function(err, ipaddr) { 
        if( err || !ipaddr) console.log("No hostnames found");
          else 
        {
            res.writeHead(200, {'Content-Type': 'application/json'}); 
            //str='[';
            str='['
            ipaddr.forEach( function(row) {
                str = str + '{ "ipaddr" : "' + row.ipaddr + '", "hostname" : "' + row.hostname + '", "reserved" : "' + row.reserved + '", "user" : "' + row.user + '", "added" : "' + row.added + '", "health" : "' + row.health + '", "lastalive" : "' + row.lastalive + '", "login" : "' + row.login + '", "subnet" : "' + row.subnet + '", "vlan" : "' + row.vlan + '", "services" : "' + row.services+ '", "vp" : "' + row.vp + '", "virthost" : "' + row.virthost + '", "location" : "' + row.location + '"}' + ',\n';
            });
            str = str.trim();
            str = str.substring(0,str.length-1);
            str = str + ']';
            res.end( str);
            }
        });
    });

//// ADD
    app.post('/add', function (req, res) {
      console.log("POST: ");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "*");
      // console.log(req.body);
      // console.log(req.body.mydata);
      var jsonData = JSON.parse(req.body.mydata);
      db.hosts.save({hostname: jsonData.hostname, ipaddr: jsonData.ipaddr, subnet: jsonData.subnet, vlan: jsonData.vlan, vp: jsonData.vp, virthost: jsonData.virthost, location: jsonData.location, login: jsonData.login, services: jsonData.services, user: jsonData.user, reserved: jsonData.reserved, alive: jsonData.alive, added: jsonData.added, health: jsonData.health, ping: jsonData.ping, pingfail: jsonData.pingfail, lastscan: jsonData.lastscan, tidyflag: jsonData.tidyflag, lastalive: jsonData.lastalive},
           function(err, saved) {
               if( err || !saved ) res.end( "server not saved"); 
               else res.end( "server saved");
           });
    });

//// SAVE
    app.post('/save', function (req, res){
        console.log("EDIT: ");
        res.header("Access-Control-Allow-Origin", "*");
           res.header("Access-Control-Allow-Methods", "*");
           // console.log(req.body);
           // console.log(req.body.mydata);
           var jsonData = JSON.parse(req.body.mydata);
           var query = jsonData.oip;
           console.log(query);
           console.log(jsonData);
           db.hosts.update({ipaddr:query}, {$set : {hostname: jsonData.hostname, ipaddr: jsonData.ipaddr, subnet: jsonData.subnet, vlan: jsonData.vlan, vp: jsonData.vp, virthost: jsonData.virthost, location: jsonData.location, login: jsonData.login, services: jsonData.services, user: jsonData.user, reserved: jsonData.reserved} },
                function(err, saved) {
                    if( err || !saved ) res.end( "server not saved"); 
                    else res.end( "server saved");
                });

    });

//// RESET STATS
    app.post('/reset', function (req, res){
        console.log("RESET: ");
        res.header("Access-Control-Allow-Origin", "*");
           res.header("Access-Control-Allow-Methods", "*");
           // console.log(req.body);
           // console.log(req.body.mydata);
           var jsonData = JSON.parse(req.body.mydata);
           var query = jsonData.ipaddr;
           db.hosts.update({ipaddr:query}, {$set: {alive: jsonData.alive, health: jsonData.health, ping: jsonData.ping, pingfail: jsonData.pingfail, lastscan: jsonData.lastscan, tidyflag: jsonData.tidyflag, lastalive: jsonData.lastalive} },
                function(err, saved) {
                    if( err || !saved ) res.end( "server not saved"); 
                    else res.end( "server saved");
                });
    });

//// DELETE
    app.post('/delete', function (req, res) {
        console.log("DELETE: ");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        console.log(req.body.mydata);
        var row = JSON.parse(req.body.mydata);
        // console.log(row);
        db.hosts.remove(row);
        //console.log("row deleted")
    });

//// LOOKUP
    app.post('/lookup', function (req, res) {
        console.log('LOOKUP: ');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        var lookup = req.body.mydata;
        var jsonData = JSON.parse(req.body.mydata);
        console.log(jsonData);
        db.hosts.find(jsonData).toArray(function(err, result) { 
            console.log(result);
            len = result.length;
            console.log(len);
            
                if (len === 0) {
                    console.log("Nothing found!");
                    res.writeHead(200, {'Content-Type': 'application/json'}); 
                    stra='[{"response":"0"}]'; 
                    res.end( stra);
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'}); 
                    //str='[';
                    strb='[{"response":"1"}]';                
                    res.end( strb);
                };
            len = 0;
        });
    });

// ============= LISTEN ==================== //

connect().use(connect.static(__dirname)).listen(80);
console.log('Server listening on port 80');
app.listen(666);
console.log('API listening on port 666');
