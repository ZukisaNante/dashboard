const express = require('express');
const bodyparser = require('body-parser');
const jwtLogin = require('jwt-parser');
const roles = require('user-groups-roles');
const httpMsgs = require('http-msgs');

const app = express();
app.listen(8000);
console.log('server started at port 8000');

app.use(bodyparser.urlencoded({extended : false}));

// login router rendering
app.get('/login', function(req, res){
res.sendFile(__dirname  + '/html/login.html');
})
// post router rendering
app.get('/post', function(req, res){
res.sendFile(__dirname  + '/html/post.html');
})
// put router rendering
app.get('/put', function(req, res){
res.sendFile(__dirname  + '/html/put.html');
})
// delete router rendering
app.get('/delete', function(req, res){
res.sendFile(__dirname  + '/html/delete.html');
})

// login router
app.post('/login', function(req, res){
    try {
        var data = req.body;
        var user = data.user;
        var password = data.password;
        if(user == password){
            jwtLogin.sign(req, res, user, 'topsecrete', 1, false); //for https set it to true
        } else {
            throw "invalid login"
        }

    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
})

// logout router
app.get('/logout', function(req, res){
    jwtLogin.signout(req, res, false);
})

// middleware
var valid_login = function(req, res, next){
    try {
      req.jwt =  jwtLogin.validate_login(req, res);
      next();
    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
}

// article router
app.get('/article',  valid_login, function(req, res){

   try {
        httpMsgs.sendJSON(req, res, {
        from : 'GET'
    })
   
   } catch (error) {
       httpMsgs.send500(req, res, error);
   }
})