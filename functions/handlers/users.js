/*const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
*/
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
  const admin = require('firebase-admin');
  const db = admin.firestore();

const firebase = require('firebase');
firebase.initializeApp(config);
//const db = firebase.firestore();


const { validateSignUpData, validateLoginData, reduceUserDetails } = require('../util/validators');

exports.signUp = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
   // console.log(req.body.email);
   // console.log(req.body.password);
   // console.log(req.body.confirmPassword);
   // console.log(req.body.handle);
   // console.log(newUser);
  //  let errors = {};
    
    //const { valid, errors } = validateSignUpData(newUser);

    //if(!valid) return res.status(400).json(errors);

    let token, userId;
    const noImg = 'no-img.png';
    db.doc(`/users/${newUser.handle}`).get().then(doc => {
        if(doc.exists){
            return res.status(400).json({ handle: 'this handle is already taken'});
        } else {
           return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    }).then(data => {
        userId = data.user.uid;
       return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/chicagoroommates.appspot.com/o/${noImg}?alt=media`,
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use')
        {
            return res.status(400).json({ email: 'Email is already in use'});
        } else {
            return res.status(500).json({ error: err.code});
        }
    });
}
//Log in users
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

   // let errors = {};

    const { valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({ general: 'Wrong credentials, please try again'});
        }
        return res.status(500).json({error: err.code});
    })
}

//Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() => {
        return res.json({ message: 'Details added successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });

};
// Get own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get().then(doc => {
        if(doc.exists){
            userData.credentials = doc.data();
            return db.collection('likes').where('userHandle', '==', req.user.handle).get()
        }
    })
    .then(data => {
        userData.likes = [];
        data.forEach(doc => {
            userData.likes.push(doc.data());
        });
        return db.collection('notifications').where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc').limit(10).get();
    })
    .then(data => {
        userData.notifications = [];
        data.forEach(doc => {
            userData.notifications.push({
                recipient: doc.data().recipient,
                sender: doc.data().sender,
                createdAt: doc.data().createdAt,
                screamId: doc.data().screamId,
                type: doc.data().type,
                read: doc.data().read,
                notificationId: doc.id
            })
        });
        return res.json(userData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
}
// UPload a profile image for user
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({error: 'Wrong file type submitted'});
        }
        // image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];

        imageFileName = `${Math.round(Math.random()*10000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
      admin.storage().bucket().upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
              metadata : {
                  contentType: imageToBeUploaded.mimetype
              }
          }
      }).then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/chicagoroommates.appspot.com/o/${imageFileName}?alt=media`
          return db.doc(`/users/${req.user.handle}`).update({ imageUrl})
      })
      .then(() => {
          return res.json({ message: 'Image uploaded successfully'});
      }).catch(err => {
          console.error(err);
          return res.status(500).json({error: err.code});
      });
    });
    busboy.end(req.rawBody);
};