const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

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

/*admin.initializeApp({
    credential: admin.credential.cert(require('../key/admin.json'))
});*/

const firebase = require('firebase');
firebase.initializeApp(config);

app.get('/screams', (req, res) => {
    admin.firestore().collection('screams').orderBy('createdAt', 'desc').get().then(data => {
        let screams = [];
        data.forEach(doc => 
        {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(screams);
    })
    .catch(err =>
        { console.log('here'); console.error(err);});
});

app.post('/scream', (req, res) => {

    if(req.method !== 'POST'){
        return res.status(400).json({ error: 'Method not allowed'});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

   console.log(req.body.body);

    admin.firestore().collection('screams')
    .add(newScream)
    .then(doc => {
       res.json({message: `document ${doc.id} created successfully`});
    })
    .catch(err => {
        res.status(500).json({ error: 'something went wrong'});
        console.error(err);
    });

});

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };


    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201).json({message: `user ${data.user.uid} signed up successfully`});
    }).catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
});

//https://baseurl.com/api/

 exports.api = functions.https.onRequest(app);