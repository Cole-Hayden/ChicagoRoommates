const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const nodemailer = require('nodemailer');
const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');




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


const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
  } = require('./handlers/screams');
const { signUp, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

/*admin.initializeApp({
    credential: admin.credential.cert(require('../key/admin.json'))
});*/

app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image',  FBAuth, uploadImage);
app.post('/user',FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

app.delete('/scream/:screamId', FBAuth, deleteScream);


app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
//TODO: delete scream
// TODO: like a scream
// TODO: unlike a scream
// TODO: comment on a scream


//SignUp route

//https://baseurl.com/api/

 exports.api = functions.https.onRequest(app);

 exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
 .onCreate((snpashot) => {
     db.doc(`/screams/${snapshot.data().screamId}`).get().then(doc => {
         if(doc.exists){
             return db.doc(`/notifications/${snapshot.id}`).set({
                 createdAt: new Date().toISOString(),
                 recipient: doc.data().userHandle,
                 sender: snapshot.data().userHandle,
                 type: 'like',
                 read: false,
                 screamId: doc.id
             });
         }
     })
     .then(() => {
         return;
     })
     .catch(err => {
         console.error(err);
         return;
     });
 });

exports.deleteNotificationOnUnLike = functions.region('europe-west1')
.firestore.document('likes/{id}').onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .then(()=> {
        return;
    })
    .catch(err => {
        console.error(err);
        return;
    })
});

 exports.createNotificationOnComment = functions.region('europe-west1')
 .firestore.document('likes/{id}')
 .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`).get().then(doc => {
        if(doc.exists){
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'comment',
                read: false,
                screamId: doc.id
            });
        }
    })
    .then(() => {
        return;
    })
    .catch(err => {
        console.error(err);
        return;
    });
 });