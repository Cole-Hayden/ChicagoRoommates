const admin = require('firebase-admin');

var d = {
    "type": "service_account",
    "project_id": "chicagoroommates",
    "private_key_id": "31f3ca1c6fa3ef05d672f71fc2a2b924deb73098",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDnfEaSLEOPPttD\nVM8UA16bUFgCSjMkw3YBVUon+UU8kU+mam6NQUAxFZADk6JPvtmmktevSZM3kdhz\nMNzsbRAGLIJK0kcEBIvpxrl1h4xwZOmfCcYqxpID6jE289doAndPzghRHgbSGrjl\nKjNrlONQXlkntSWZ+AOgyr5b31tnfKYzDcEkTiBbGp2nrDV3eUXim4qfNmeikmLk\nBiOIsiRf5stB8z6Clf62Gp6zjGsaclwMP50VJm6Wib849oz6xosrjNV+RbfFRZ/e\nw1N4diPiH96nuYkjz78ARLSvm0jAYOssXo34XtK3+8wgOlWbeutLXIJSo1vRiYYl\nVNDZpOn9AgMBAAECggEAFvOpg6DD6hYPY3OrPI7A+KFUuJVm0MRYlPVB7wi2JrU5\nsoRnBbZsiPFcYB5pP4LqzatNm2GuKRpa3cEAhqihqBsNqCGFTQ6uWLWNeevArvwy\ndcRgU6lwnNbBnnM67mMgNVd2V6SkhHyFzKMMiiQvDa7tJBS/7645nd28VhulUnNH\nOB6KQcbL8V1aVkz3n0im5pOhtQf4tfKqPg/2LFPxu5CA8FeMBr6v4sv/TYpjCAWh\ngpXSR+wmw0rnaLndKZTZeW4+W8dDnHCGzYvY/DTD228adAYjhhrNujRrf5Qq8ds0\nXkzGFVRM6qbvinSGGXYQqSjbCX7WV5FBhHWK+p0UOQKBgQD2uhF1Lj3GFxWBdaVc\n1Y9TKgnt2E9ejx28y0rE5zNyKx/AN6QycIS4UeA4nS3A9SCCtiqQBq5JWTV3Note\nJb57LMRxddXER/LX8iYGSUbHrQhDCcHyQhP+wc+fL8CFmV4aDnjryh+Dgpcm/dKt\nLE/gv2hYD9GW9aRqCJltAJniFwKBgQDwL487UsMlY5CqRhFUK7Z9HNoXWn7NRmF+\nl6kAYedpBsC4RhgI6EdhmHkJIRkRRTR6OVlUsJv4MQzyD3LAYrOiETtHqpvxIy2e\nyozQDuO3SOkLnfGeb7TS4NhL8h5Eh8N1Q1uSfycwXN/e1dCq9MueFCDBIv3mVIsp\n6Y2iFqhFCwKBgQCcbUYKRGIYCKSy6rMIE8KGGL4o1R8lNZnGDCIAixFcDilYRi7N\nZ/dNoWOGoWjT0NZm6TY9EG9Jw8yZI7Ti4Q1OrQhzYyFAC9nUvgsLq0O772Gwlywm\n+2wP9jM7mxv12FIINSrHW+P1DkPlDcKX1uNh/Bkc1BKvIli2fXNA38OwywKBgF81\nyyZuAVOB62fEDLx784QW+tEFG3zN6HnhLqorJSt59M1XY9GsGhey9E/NIf25nDrT\nHvk2ZS12bDZML2XZ+nFFOWWIWPa2xi/LBRS4wkX2jgL/4ja2+0wYu0Unvh3WX4HN\naLBi3SsLtebEhUovbcPFINLOxy0V2HCN14ooRx3PAoGAOxuOALkihR4fY7a1pibf\nEJB7YfM75MpbO8rm4lA+GQ6lq34b4T5QL0KuENmfmsUyGxRvKgqeeVhlArrBQ1YR\nGqQhHas1COaigWi1zwdV+hmcU4O2vGstH9pExtQI3LuP4y3IDeKlBTKMmT/eWpnB\n/iFf0dNn6b8KbjmEgbD/xwc=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ed0gt@chicagoroommates.iam.gserviceaccount.com",
    "client_id": "100784429691411041185",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ed0gt%40chicagoroommates.iam.gserviceaccount.com"
  }

admin.initializeApp({
    credential: admin.credential.cert(d)
});
const db = admin.firestore();

module.exports = { admin, db };