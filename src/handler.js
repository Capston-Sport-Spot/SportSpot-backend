const admin = require("firebase-admin");
const axios = require('axios');
const serviceAccount = require("../sportspot-d0d68-firebase-adminsdk-i7wnv-d8563c7c4e.json");
const Inert = require('@hapi/inert');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyAums4aGVXVkIudolgOaxfclOeVipSLePQ",

};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://sportspot-2024.appspot.com' // Ganti dengan bucket Firebase Storage Anda

});

const db = admin.firestore();



//UPLOAD
 //UPload Imange
 const uploadImageToFirebase = async (file, folder = 'lapangans') => {
    const bucket = admin.storage().bucket();
    const filename = path.basename(file.path);
    const fileRef = bucket.file(`${folder}/${filename}`);
    await bucket.upload(file.path, {
        destination: fileRef,
        metadata: {
            contentType: file.headers['content-type']
        }
    });
    return fileRef.getSignedUrl({ action: 'read', expires: '03-01-2500' });
};


// Fungsi untuk menghapus gambar dari Firebase Storage
async function deleteImageFromFirebase(imageUrl) {
try {
    const bucket = admin.storage().bucket();
    const filePath = decodeURIComponent(imageUrl.split('/').pop().split('?')[0]);
    await bucket.file(filePath).delete();
    console.log(`Successfully deleted old image: ${filePath}`);
} catch (error) {
    console.error('Error deleting old image:', error);
}
}


//USER
// Registration handler
const registerHandler = async (request, h) => {
    const { email, password, displayName } = request.payload;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
        });

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




// Login handler
const loginHandler = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
            email: email,
            password: password,
            returnSecureToken: true,
        });

        const user = await admin.auth().getUser(response.data.localId);

        const idToken = response.data.idToken;

        return h.response({
            message: 'Login successful',
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            },
            token: idToken,
        }).code(200);
    } catch (error) {
        console.error('Error logging in:', error.response.data);
        return h.response({
            message: 'Login failed',
            error: error.response.data.error.message,
        }).code(401);
    }
}



//Profile Handler
const profileHandler =async (request, h) => {
    const userId = request.user.uid;

    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();

        if (!userDoc.exists) {
            console.error('User not found:', userId);
            return h.response({ message: 'User not found' }).code(404);
        }

        console.log('User data fetched successfully:', userDoc.data());
        return h.response(userDoc.data()).code(200);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return h.response({ message: 'Error fetching user data', error: error.message }).code(500);
    }
}


// Endpoint untuk mengupdate informasi profil pengguna
//updateProfileHandler
const updateProfileHandler = async (request, h) => {
    const userId = request.user.uid;
    const { displayName, email } = request.payload; // Mendapatkan data yang diperbarui dari payload

    try {
        // Periksa apakah pengguna ada dalam database
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            console.error('User not found:', userId);
            return h.response({ message: 'User not found' }).code(404);
        }

        // Update informasi profil pengguna
        await admin.auth().updateUser(userId, { displayName: displayName, email: email });
        await admin.firestore().collection('users').doc(userId).update({ displayName: displayName, email: email });

        console.log('User profile updated successfully');
        return h.response({ message: 'User profile updated successfully' }).code(200);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return h.response({ message: 'Error updating user profile', error: error.message }).code(500);
    }
}






//LAPANGAN
//addlapangan handler
const addFieldHandler = async (request, h) => {
    const { lapanganName, lapanganType, location, subFields } = request.payload;
    const openingHours = JSON.parse(request.payload.openingHours); // Parse openingHours dari JSON string
    const file = request.payload.file;

    try {
        // Periksa apakah lapangan dengan nama yang sama sudah ada
        const lapanganSnapshot = await admin.firestore().collection('lapangans')
            .where('lapanganName', '==', lapanganName)
            .get();

        if (!lapanganSnapshot.empty) {
            return h.response({ message: 'Lapangan dengan nama tersebut sudah ada' }).code(400);
        }

        let imageUrl = '';
        if (file) {
            const urls = await uploadImageToFirebase(file, 'lapangans'); // Mengunggah gambar ke folder 'lapangans'
            imageUrl = urls[0];
        }

        const docRef = admin.firestore().collection('lapangans').doc();
        await docRef.set({
            lapanganName: lapanganName,
            lapanganType: lapanganType,
            location: location,
            openingHours: {
                open: openingHours.open,
                close: openingHours.close
            },
            subFields: JSON.parse(subFields),
            imageUrl: imageUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return h.response({ message: 'Lapangan and sub-fields added successfully' }).code(201);
    } catch (error) {
        console.error('Error adding lapangan and sub-fields:', error);
        return h.response({ message: 'Error adding lapangan and sub-fields', error: error.message }).code(400);
    }
}


//Malihat daftar lapangan
//getfield handler
const getFieldHandler =  async (request, h) => {
    try {
        const lapangansSnapshot = await admin.firestore().collection('lapangans').get();
        const lapangans = lapangansSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return h.response(lapangans).code(200);
    } catch (error) {
        console.error('Error fetching lapangans:', error);
        return h.response({ message: 'Error fetching lapangans', error: error.message }).code(500);
    }
}



//Melihat lapangan by id
//getfieldbyid handler
const getFieldByidHandler = async (request, h) => {
  const { id } = request.params;

  try {
      const lapanganDoc = await admin.firestore().collection('lapangans').doc(id).get();

      if (!lapanganDoc.exists) {
          return h.response({ message: 'Lapangan not found' }).code(404);
      }

      return h.response(lapanganDoc.data()).code(200);
  } catch (error) {
      console.error('Error fetching lapangan:', error);
      return h.response({ message: 'Error fetching lapangan', error: error.message }).code(500);
  }
}


//Update fieldHnadler
const updateFieldHandler = async (request, h) => {
    const lapanganId = request.params.id;
    const { lapanganName, lapanganType, location, subFields, openingHours } = request.payload;
    const file = request.payload.file;

    try {
        // Periksa apakah lapangan dengan ID tersebut ada dalam database
        const lapanganDoc = await admin.firestore().collection('lapangans').doc(lapanganId).get();
        if (!lapanganDoc.exists) {
            console.error('Lapangan not found:', lapanganId);
            return h.response({ message: 'Lapangan not found' }).code(404);
        }

        // Update informasi lapangan
        const updatedData = {
            lapanganName: lapanganName,
            lapanganType: lapanganType,
            location: location,
            openingHours: JSON.parse(openingHours),
            subFields: JSON.parse(subFields)
        };

        // Jika ada file gambar yang diunggah, upload dan simpan URL gambar baru, lalu hapus gambar lama
        let imageUrl = lapanganDoc.data().imageUrl;
        if (file) {
            const urls = await uploadImageToFirebase(file, 'lapangans');
            const newImageUrl = urls[0];

            // Hapus gambar lama jika ada
            if (imageUrl) {
                await deleteImageFromFirebase(imageUrl);
            }

            imageUrl = newImageUrl;
        }

        // Memperbarui data lapangan di Firestore
        await admin.firestore().collection('lapangans').doc(lapanganId).update({
            ...updatedData,
            imageUrl: imageUrl
        });

        console.log('Lapangan updated successfully');
        return h.response({ message: 'Lapangan updated successfully' }).code(200);
    } catch (error) {
        console.error('Error updating lapangan:', error);
        return h.response({ message: 'Error updating lapangan', error: error.message }).code(500);
    }
}

//Search Lapangan Handler
const searchFieldHandler = async (request, h) => {
    const { keyword } = request.query;

    try {
        const lapanganSnapshot = await admin.firestore().collection('lapangans')
            .where('lapanganName', '>=', keyword)
            .where('lapanganName', '<=', keyword + '\uf8ff')
            .get();

        const lapanganResults = [];
        lapanganSnapshot.forEach(doc => {
            lapanganResults.push({ id: doc.id, ...doc.data() });
        });

        return h.response(lapanganResults).code(200);
    } catch (error) {
        console.error('Error searching lapangan:', error);
        return h.response({ message: 'Error searching lapangan', error: error.message }).code(500);
    }
}





// Protected route handler
const protectedHandler = async (request, h) => {
  return h.response({ message: "You have access to this route" }).code(200);
};

module.exports = {
  registerHandler,
  loginHandler,
  profileHandler,
  updateProfileHandler,
  addFieldHandler,
  getFieldHandler,
  getFieldByidHandler,
  searchFieldHandler,
  updateFieldHandler,
  protectedHandler,
};
