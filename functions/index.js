const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const FBAuth = require('./util/fbAuth');



config =  {
    apiKey: "AIzaSyBUUHLwQ1HGkRcvjSJ72NwDTnndfo2ZE9E",
    authDomain: "chicagoroommates.firebaseapp.com",
    databaseURL: "https://chicagoroommates.firebaseio.com",
    projectId: "chicagoroommates",
    storageBucket: "chicagoroommates.appspot.com",
    messagingSenderId: "956960994302",
    appId: "1:956960994302:web:655ab1c74db02c2fbac6af",
    measurementId: "G-Q6KGMBKQKE"
  };

const { getAllScreams } = require('./handlers/screams');
const { postOneScream } = require('./handlers/screams');
const { signUp, login, uploadImage } = require('./handlers/users');

/*admin.initializeApp({
    credential: admin.credential.cert(require('../key/admin.json'))
});*/

app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);

//SignUp route

//https://baseurl.com/api/

 exports.api = functions.https.onRequest(app);