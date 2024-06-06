const admin = require('firebase-admin');
const serviceAccount = require('../sportspot-d0d68-firebase-adminsdk-i7wnv-d8563c7c4e.json');


// Middleware untuk memeriksa kunci API
const checkApiKey = (request, h) => {
    const apiKey = request.headers['x-api-key'];
    if (apiKey !== '1111') {
        return h.response({ message: 'Invalid API key' }).code(403).takeover();
    }
    return h.continue;
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


routes = [
  {
    //Endpoint Register
    method: 'POST',
        path: '/register',
        handler: async (request, h) => {
            const { email, password, displayName } = request.payload;

            try {
                const userRecord = await admin.auth().createUser({
                    email: email,
                    password: password,
                    displayName: displayName,
                });

                // Menambahkan data pengguna ke Firestore
                await db.collection('users').doc(userRecord.uid).set({
                    email: email,
                    displayName: displayName,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                return h.response({
                    message: 'User created successfully',
                    user: {
                        uid: userRecord.uid,
                        email: userRecord.email,
                        displayName: userRecord.displayName
                    }
                }).code(201);
            } catch (error) {
                console.error('Error creating user:', error);
                return h.response({
                    message: 'User creation failed',
                    error: error.message,
                }).code(400);
            }
        }
  },

{
    //Login endpoint
    method: 'POST',
    path: '/login',
    handler: async (request, h) => {
        const { email, password } = request.payload;

        try {
            const user = await admin.auth().getUserByEmail(email);
            
            // Firebase Admin SDK does not support password verification.
            // Password verification should be done on the client-side using Firebase Authentication SDK.
            // Here, we're just simulating a successful login for the purpose of demonstration.

            const idToken = await admin.auth().createCustomToken(user.uid);

            return h.response({
                message: 'Login successful',
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
                token: idToken
            }).code(200);
        } catch (error) {
            console.error('Error logging in:', error);
            return h.response({
                message: 'Login failed',
                error: error.message,
            }).code(401);
        }
    }
},

{

    //Lapangan endpoint
    method: 'POST',
    path: '/addLapangan',
    options: {
        pre: [{ method: checkApiKey }],
        handler: async (request, h) => {
            const { lapanganName, lapanganType, location, openingHours, subFields } = request.payload;

            try {
                const docRef = admin.firestore().collection('lapangans').doc();
                await docRef.set({
                    lapanganName: lapanganName,
                    lapanganType: lapanganType,
                    location: location,
                    openingHours: openingHours,
                    subFields: subFields.map(field => ({
                        ...field
                    })),
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                return h.response({ message: 'Lapangan and sub-fields added successfully' }).code(201);
            } catch (error) {
                console.error('Error adding lapangan and sub-fields:', error);
                return h.response({ message: 'Error adding lapangan and sub-fields', error: error.message }).code(400);
            }
        }
    }
}




];

module.exports = routes;