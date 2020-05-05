const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

const { getAllScreams } = require('./handlers/screams');
const { postOneScream } = require('./handlers/screams');
const { signUp } = require('./handlers/users');
const { login } = require('./handlers/users');

const config = {
    apiKey: "AIzaSyBUUHLwQ1HGkRcvjSJ72NwDTnndfo2ZE9E",
    authDomain: "chicagoroommates.firebaseapp.com",
    databaseURL: "https://chicagoroommates.firebaseio.com",
    projectId: "chicagoroommates",
    storageBucket: "chicagoroommates.appspot.com",
    messagingSenderId: "956960994302",
    appId: "1:956960994302:web:655ab1c74db02c2fbac6af",
    measurementId: "G-Q6KGMBKQKE"
  };

admin.initializeApp({
    credential: admin.credential.cert(require('../key/admin.json'))
});

const firebase = require('firebase');
firebase.initializeApp(config);

//Scream route


const FBAuth = (req, res, next) => {

    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'});
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        console.log(decodedToken);
        return db.collection('users')
        .where('user','==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
        req.user.handle = data.docs[0].data().handle;
        return next();
    })
    .catch(err => {
        console.error('Error while verifying token', err);
        return res.status(403).json(err);
    })
}

app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.post('/signup', signUp);
app.post('/login', login);


const isEmail = (email) => {
   // const regEx = 
    //if(email.match(regEx)) return true;
    //else return false;
    return true;
}

const isEmpty = (string) => {
    if(string.trim() === ''){ return true;}
    else{ return false;}
}

//SignUp route

//https://baseurl.com/api/

 exports.api = functions.https.onRequest(app);