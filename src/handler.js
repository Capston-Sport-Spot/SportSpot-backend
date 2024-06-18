const admin = require("firebase-admin");
const axios = require('axios');
const serviceAccount = require("../sportspot-d0d68-firebase-adminsdk-i7wnv-d8563c7c4e.json");
const Inert = require('@hapi/inert');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');



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
//Registrasi User baru
const registerHandler = async (request, h) => {
    const { email, password, displayName, alamat, kota, hp } = request.payload;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
        });

        await db.collection('users').doc(userRecord.uid).set({
            email: email,
            displayName: displayName,
            alamat: alamat,
            kota: kota,
            hp: hp,
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
//Login menggunakan akun yang sudah diregistrasi dan mengembalikan token
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
//Menampilkan profile user menggunakan token dari login
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


//updateProfileHandler
//Untuk update profile milik user
const updateProfileHandler = async (request, h) => {
    const userId = request.user.uid;
    const { displayName, email, alamat, kota, hp } = request.payload;

    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            console.error('User not found:', userId);
            return h.response({ message: 'User not found' }).code(404);
        }

        await admin.auth().updateUser(userId, { displayName: displayName, email: email });
        await admin.firestore().collection('users').doc(userId).update({
            displayName: displayName,
            email: email,
            alamat: alamat,
            kota: kota,
            noHp: hp
        });

        console.log('User profile updated successfully');
        return h.response({ message: 'User profile updated successfully' }).code(200);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return h.response({ message: 'Error updating user profile', error: error.message }).code(500);
    }
}












//LAPANGAN
//addlapangan handler
//Untuk menambahkan  lapangan baru ke database 
const addFieldHandler = async (request, h) => {
    const { lapanganName, lapanganType, alamat, kota, subFields } = request.payload;
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
            alamat: alamat,
            kota: kota,
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
//Untuk mendapatkan data lapangan yang ada di database.
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
//Untuk mendapatkan data lapangan by ID
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


//Update fieldHandler
//Untuk melakukan update data pada database
const updateFieldHandler = async (request, h) => {
    const lapanganId = request.params.id;
    const { lapanganName, lapanganType, alamat, kota , subFields, openingHours } = request.payload;
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
            alamat : alamat,
            kota : kota,
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



// End Point get Field by Kota and Type Lapangan
//Endpoint untuk mencari lapangan berdasarkan kota pengguna dan jenis lapangan 
const getFieldByKotaAndType = async (request, h) => {
    const { lapanganType } = request.query;
    const userId = request.user.uid;

    try {
        // Mendapatkan data pengguna dari Firestore
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const userKota = userDoc.data().kota;

        // Mendapatkan lapangan berdasarkan kota dan jenis lapangan
        const lapanganSnapshot = await admin.firestore().collection('lapangans')
            .where('kota', '==', userKota)
            .where('lapanganType', '==', lapanganType)
            .get();

        const lapanganResults = [];
        lapanganSnapshot.forEach(doc => {
            lapanganResults.push({ id: doc.id, ...doc.data() });
        });

        return h.response(lapanganResults).code(200);
    } catch (error) {
        console.error('Error searching lapangans:', error);
        return h.response({ message: 'Error searching lapangans', error: error.message }).code(500);
    }
}






//Search Lapangan Handler
//Melakukan search Lapangan pada data.
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










//RESERVATION
//reservation handler
//Untuk menambahkan reservation baru ke database.
const reservationHandler = async (request, h) => {
    const { lapanganId, subFieldName, date, startTime, endTime } = request.payload;
    const userId = request.user.uid;

    try {
        const lapanganDoc = await admin.firestore().collection('lapangans').doc(lapanganId).get();

        if (!lapanganDoc.exists) {
            return h.response({ message: 'Lapangan not found' }).code(404);
        }

        // Periksa apakah tanggal dan waktu reservasi berada di masa depan
        const now = new Date();
        const reservationStartDateTime = new Date(`${date}T${startTime}:00`);
        const reservationEndDateTime = new Date(`${date}T${endTime}:00`);

        if (reservationStartDateTime < now) {
            return h.response({ message: 'Reservasi tidak dapat dilakukan di masa lalu' }).code(400);
        }

        if (reservationStartDateTime >= reservationEndDateTime) {
            return h.response({ message: 'Waktu mulai harus lebih awal dari waktu selesai' }).code(400);
        }

        const lapanganData = lapanganDoc.data();
        const { openingHours, subFields } = lapanganData;

        // Periksa apakah waktu reservasi dalam jam operasional
        const reservationStartTime = reservationStartDateTime.getHours() * 60 + reservationStartDateTime.getMinutes();
        const reservationEndTime = reservationEndDateTime.getHours() * 60 + reservationEndDateTime.getMinutes();
        const [openingHoursStart, openingMinutesStart] = openingHours.open.split(':').map(Number);
        const [openingHoursEnd, openingMinutesEnd] = openingHours.close.split(':').map(Number);
        const openingTime = openingHoursStart * 60 + openingMinutesStart;
        const closingTime = openingHoursEnd * 60 + openingMinutesEnd;

        if (reservationStartTime < openingTime || reservationEndTime > closingTime) {
            return h.response({ message: 'Reservation time outside operating hours' }).code(400);
        }

        // Periksa apakah sub lapangan sudah dipesan pada rentang waktu yang diminta
        const existingReservations = await admin.firestore().collection('reservations')
            .where('lapanganId', '==', lapanganId)
            .where('subFieldName', '==', subFieldName)
            .where('date', '==', date)
            .get();

        const conflicts = existingReservations.docs.some(doc => {
            const existingReservation = doc.data();
            const existingStartTime = new Date(`${date}T${existingReservation.startTime}:00`);
            const existingEndTime = new Date(`${date}T${existingReservation.endTime}:00`);
            return (reservationStartDateTime < existingEndTime && reservationEndDateTime > existingStartTime);
        });

        if (conflicts) {
            return h.response({ message: `${subFieldName} sudah dipesan pada rentang waktu yang diminta` }).code(400);
        }

        // Hitung total harga
        const subField = subFields.find(field => field.fieldName === subFieldName);
        if (!subField) {
            return h.response({ message: 'Sub lapangan tidak ditemukan' }).code(404);
        }
        const { pricePerSession } = subField;
        const durationInHours = (reservationEndDateTime - reservationStartDateTime) / (1000 * 60 * 60); // Durasi dalam jam
        const totalPrice = pricePerSession * durationInHours;

        // Sub lapangan belum dipesan pada rentang waktu yang diminta, buat reservasi baru
        const reservationRef = admin.firestore().collection('reservations').doc();
        await reservationRef.set({
            userId: userId,
            lapanganId: lapanganId,
            subFieldName: subFieldName,
            date: date,
            startTime: startTime,
            endTime: endTime,
            endDateTime: reservationEndDateTime, // Simpan waktu akhir reservasi
            totalPrice: totalPrice,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return h.response({ message: 'Reservation created successfully', totalPrice: totalPrice }).code(201);
    } catch (error) {
        console.error('Error creating reservation:', error);
        return h.response({ message: 'Error creating reservation', error: error.message }).code(400);
    }
}


//See User reservation

const getUserReservationHandler = async (request, h) => {
    const userId = request.user.uid;

    try {
        const reservationsSnapshot = await admin.firestore().collection('reservations').where('userId', '==', userId).get();
        const reservations = reservationsSnapshot.docs.map(doc => doc.data());

        return h.response(reservations).code(200);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return h.response({ message: 'Error fetching reservations', error: error.message }).code(500);
    }
}


//See Subfield Reservation
//Melihat reservasi yang ada pada subfield lapangan.
const getReservationbBySubFieldHandler = async (request, h) => {
    const { lapanganId, subFieldName } = request.params;

    try {
        const reservationsSnapshot = await admin.firestore().collection('reservations')
            .where('lapanganId', '==', lapanganId)
            .where('subFieldName', '==', subFieldName)
            .get();

        const reservations = reservationsSnapshot.docs.map(doc => doc.data());

        return h.response(reservations).code(200);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return h.response({ message: 'Error fetching reservations', error: error.message }).code(500);
    }
}

//see History user handler
//Melihat riwayat pemesanan reservasi pengguna
const historyReservationHandler =  async (request, h) => {
    const userId = request.user.uid;

    try {
        const historySnapshot = await admin.firestore().collection('reservationHistory').where('userId', '==', userId).get();
        const history = historySnapshot.docs.map(doc => doc.data());

        return h.response(history).code(200);
    } catch (error) {
        console.error('Error fetching reservation history:', error);
        return h.response({ message: 'Error fetching reservation history', error: error.message }).code(500);
    }
}

  //Cron untuk menjalankan 
  //Dimana data dari document reservation yang harusnya sudah kadal luarsa akan secara otomatis berpindah ke document reservation history.
  const moveCompletedReservationsToHistory = async () => {
    const now = new Date();
    try {
        const completedReservationsSnapshot = await admin.firestore().collection('reservations')
            .where('endDateTime', '<=', now)
            .get();

        const batch = admin.firestore().batch();
        completedReservationsSnapshot.forEach(doc => {
            const data = doc.data();
            batch.set(admin.firestore().collection('reservationHistory').doc(doc.id), data);
            batch.delete(admin.firestore().collection('reservations').doc(doc.id));
        });

        await batch.commit();
        console.log('Completed reservations moved to history');
    } catch (error) {
        console.error('Error moving completed reservations to history:', error);
    }
};

setInterval(moveCompletedReservationsToHistory, 60 * 60 * 1000); // Jalankan setiap jam






//EVENT
//addEvent Handler
//Untuk menambahkan event olahraga
const addEventHandler = async (request, h) => {
    const { title, organizer, contactInfo, eventType, description, location, date } = request.payload;
    const file = request.payload.file;

    try {
        let imageUrl = '';
        if (file) {
            const urls = await uploadImageToFirebase(file, 'events'); // Mengunggah gambar ke folder 'events'
            imageUrl = urls[0];
        }

        const docRef = admin.firestore().collection('events').doc();
        await docRef.set({
            title: title,
            organizer: organizer,
            contactInfo: contactInfo,
            eventType: eventType,
            description: description,
            location: location,
            date: new Date(date), // Simpan sebagai objek Date
            imageUrl: imageUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return h.response({ message: 'Event added successfully' }).code(201);
    } catch (error) {
        console.error('Error adding event:', error);
        return h.response({ message: 'Error adding event', error: error.message }).code(400);
    }
}


//getEvent handler
//Untuk mendapat semua Event yang ada didatabase
const getEventHandler = async (request, h) => {
    try {
        const eventsSnapshot = await admin.firestore().collection('events').get();
        const events = [];
        eventsSnapshot.forEach(doc => {
            events.push({ id: doc.id, ...doc.data() });
        });

        return h.response(events).code(200);
    } catch (error) {
        console.error('Error fetching events:', error);
        return h.response({ message: 'Error fetching events', error: error.message }).code(400);
    }
}


//getEvent handler by ID
//Untuk mendapatkan event secara spesifik menggunakan ID
const getEvnetByIdHandler = async (request, h) => {
    const eventId = request.params.id;

    try {
        const eventDoc = await admin.firestore().collection('events').doc(eventId).get();

        if (!eventDoc.exists) {
            return h.response({ message: 'Event not found' }).code(404);
        }

        return h.response({ id: eventDoc.id, ...eventDoc.data() }).code(200);
    } catch (error) {
        console.error('Error fetching event:', error);
        return h.response({ message: 'Error fetching event', error: error.message }).code(400);
    }
}

//updateEvent handler by ID
//Untuk melakukan update pada event yang ada pada database sesuai dengan ID
const updateEventHandler = async (request, h) => {
    const eventId = request.params.id;
    const { title, organizer, contactInfo, eventType, description, location, date } = request.payload;
    const file = request.payload.file;

    try {
        // Periksa apakah event dengan ID tersebut ada dalam database
        const eventDoc = await admin.firestore().collection('events').doc(eventId).get();
        if (!eventDoc.exists) {
            console.error('Event not found:', eventId);
            return h.response({ message: 'Event not found' }).code(404);
        }

        // Update informasi event
        const updatedData = {
            title: title,
            organizer: organizer,
            contactInfo: contactInfo,
            eventType: eventType,
            description: description,
            location: location,
            date: new Date(date) // Simpan sebagai objek Date
        };

        // Jika ada file gambar yang diunggah, upload dan simpan URL gambar baru, lalu hapus gambar lama
        let imageUrl = eventDoc.data().imageUrl;
        if (file) {
            const urls = await uploadImageToFirebase(file, 'events');
            const newImageUrl = urls[0];

            // Hapus gambar lama jika ada
            if (imageUrl) {
                await deleteImageFromFirebase(imageUrl);
            }

            imageUrl = newImageUrl;
        }

        // Memperbarui data event di Firestore
        await admin.firestore().collection('events').doc(eventId).update({
            ...updatedData,
            imageUrl: imageUrl
        });

        console.log('Event updated successfully');
        return h.response({ message: 'Event updated successfully' }).code(200);
    } catch (error) {
        console.error('Error updating event:', error);
        return h.response({ message: 'Error updating event', error: error.message }).code(500);
    }
}


//Search Event Handler
//Untuk mendapatkan event yang ada melalui seach.
const searchEventHandler = async (request, h) => {
    const { keyword } = request.query;

    try {
        const eventSnapshot = await admin.firestore().collection('events')
            .where('title', '>=', keyword)
            .where('title', '<=', keyword + '\uf8ff')
            .get();

        const eventResults = [];
        eventSnapshot.forEach(doc => {
            eventResults.push({ id: doc.id, ...doc.data() });
        });

        return h.response(eventResults).code(200);
    } catch (error) {
        console.error('Error searching events:', error);
        return h.response({ message: 'Error searching events', error: error.message }).code(500);
    }
}







//COMMUNITY
//add Community handler
//Untuk menambahkan community ke database.
const addCommunityHandler = async (request, h) => {
    const { name, description, location, contact, sportType } = request.payload;
    const file = request.payload.file;

    try {
        let imageUrl = '';
        if (file) {
            const urls = await uploadImageToFirebase(file, 'communities');
            imageUrl = urls[0];
        }

        const docRef = admin.firestore().collection('communities').doc();
        await docRef.set({
            name: name,
            description: description,
            location: location,
            contact: contact,
            sportType: sportType,
            imageUrl: imageUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return h.response({ message: 'Community added successfully' }).code(201);
    } catch (error) {
        console.error('Error adding community:', error);
        return h.response({ message: 'Error adding community', error: error.message }).code(400);
    }
}


//get community handler
//Untuk mendapatkan data keseluruhan comunity yang ada.
const getCommunityHandler =  async (request, h) => {
    try {
        const communitiesSnapshot = await admin.firestore().collection('communities').get();
        const communities = communitiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return h.response(communities).code(200);
    } catch (error) {
        console.error('Error fetching communities:', error);
        return h.response({ message: 'Error fetching communities', error: error.message }).code(500);
    }
}

//get community handler by ID
//Untuk mendapatkan data community secara spesifik dengan ID dari database.
const getCommunityByIdHandler = async (request, h) => {
    const { id } = request.params;

    try {
        const communityDoc = await admin.firestore().collection('communities').doc(id).get();

        if (!communityDoc.exists) {
            return h.response({ message: 'Community not found' }).code(404);
        }

        return h.response(communityDoc.data()).code(200);
    } catch (error) {
        console.error('Error fetching community information:', error);
        return h.response({ message: 'Error fetching community information', error: error.message }).code(500);
    }
}

//update community handler by ID
//Untuk update data community di database dengan ID
const updateCommunityHandler = async (request, h) => {
    const communityId = request.params.id;
    const { name, description, location, contact, sportType } = request.payload;
    const file = request.payload.file;

    try {
        // Periksa apakah komunitas dengan ID tersebut ada dalam database
        const communityDoc = await admin.firestore().collection('communities').doc(communityId).get();
        if (!communityDoc.exists) {
            console.error('Community not found:', communityId);
            return h.response({ message: 'Community not found' }).code(404);
        }

        // Update informasi komunitas
        const updatedData = {
            name: name,
            description: description,
            location: location,
            contact: contact,
            sportType: sportType
        };

        // Jika ada file gambar yang diunggah, upload dan simpan URL gambar baru, lalu hapus gambar lama
        let imageUrl = communityDoc.data().imageUrl;
        if (file) {
            const urls = await uploadImageToFirebase(file, 'communities');
            const newImageUrl = urls[0];

            // Hapus gambar lama jika ada
            if (imageUrl) {
                await deleteImageFromFirebase(imageUrl);
            }

            imageUrl = newImageUrl;
        }

        // Memperbarui data komunitas di Firestore
        await admin.firestore().collection('communities').doc(communityId).update({
            ...updatedData,
            imageUrl: imageUrl
        });

        console.log('Community updated successfully');
        return h.response({ message: 'Community updated successfully' }).code(200);
    } catch (error) {
        console.error('Error updating community:', error);
        return h.response({ message: 'Error updating community', error: error.message }).code(500);
    }
}

// Search Community Handler
const searchCommunityHandler = async (request, h) => {
    const { keyword } = request.query;

    try {
        const communitySnapshot = await admin.firestore().collection('communities')
            .where('name', '>=', keyword)
            .where('name', '<=', keyword + '\uf8ff')
            .get();

        const communityResults = [];
        communitySnapshot.forEach(doc => {
            communityResults.push({ id: doc.id, ...doc.data() });
        });

        return h.response(communityResults).code(200);
    } catch (error) {
        console.error('Error searching communities:', error);
        return h.response({ message: 'Error searching communities', error: error.message }).code(500);
    }
}




//Untuk artikel
//Import Artikel
const importArticle = async (request, h) => {
    const file = request.payload.file;

    if (!file || !file.hapi.filename.endsWith('.csv')) {
        return h.response({ message: 'Invalid CSV file' }).code(400);
    }

    const articles = [];

    try {
        // Membaca file CSV dengan csv-parser
        const readableStream = new Readable();
        readableStream.push(file._data);
        readableStream.push(null);

        await new Promise((resolve, reject) => {
            readableStream.pipe(csv())
                .on('data', (data) => {
                    // Memproses setiap baris dari CSV
                    articles.push({
                        link: data.link.trim(),
                        title: data.title.trim(),
                        imageLink: data.image_link.trim(),
                        time: data.time.trim()
                    });
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        // Menyimpan data artikel ke Firestore
        const batch = db.batch();
        const articlesCollection = db.collection('articles');

        articles.forEach(article => {
            const docRef = articlesCollection.doc(); // Membuat dokumen baru dengan ID otomatis
            batch.set(docRef, article);
        });

        await batch.commit();

        return h.response({ message: 'Articles imported successfully' }).code(200);
    } catch (error) {
        console.error('Error importing articles:', error);
        return h.response({ message: 'Error importing articles', error: error.message }).code(500);
    }
}



//Get Artikel
//Untuk mendapatkan semua daftar artikel yang ada 

const getArticle =  async (request, h) => {
    try {
        const articlesSnapshot = await db.collection('articles').get();
        const articles = [];

        articlesSnapshot.forEach(doc => {
            articles.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return h.response({ articles }).code(200);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return h.response({ message: 'Error fetching articles', error: error.message }).code(500);
    }
}




//Get article by ID
//Untuk mendapatkan artikel by ID dan mereka jejak user saat memilih artikel tersebut yang akan diberikan di colection userHistory
const getArticlebyId = async (request, h) => {
    const { articleId } = request.params;

    try {
        // Mengambil detail artikel dari Firestore
        const articleDoc = await admin.firestore().collection('articles').doc(articleId).get();

        if (!articleDoc.exists) {
            return h.response({ message: 'Article not found' }).code(404);
        }

        const articleData = articleDoc.data();

        // Merekam history pengguna jika pengguna terautentikasi
        if (request.user) {
            const userId = request.user.uid;
            const historyRef = admin.firestore().collection('userHistory').doc();

            // Menambahkan data history pengguna
            await historyRef.set({
                userId: userId,
                articleId: articleId,
                timestamp: new Date().toISOString()
            });
        }

        return h.response(articleData).code(200);
    } catch (error) {
        console.error('Error fetching article:', error);
        return h.response({ message: 'Error fetching article', error: error.message }).code(500);
    }
}

//Get History user Article
//Untuk mendapatkan history user berdasarkan artikel yang pernah mereka buka.
const getHistoryArticleUser = async (request, h) => {
    try {
        // Mendapatkan userId dari token autentikasi
        const userId = request.user.uid;

        // Mengambil history artikel dari Firestore berdasarkan userId
        const historySnapshot = await admin.firestore().collection('userHistory')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc') // Mengurutkan berdasarkan timestamp secara menurun
            .get();

        if (historySnapshot.empty) {
            return h.response({ message: 'No history found for user' }).code(404);
        }

        // Mengambil data artikel berdasarkan history
        const historyData = [];
        for (const doc of historySnapshot.docs) {
            const articleId = doc.data().articleId;
            const articleDoc = await admin.firestore().collection('articles').doc(articleId).get();

            if (articleDoc.exists) {
                const articleData = articleDoc.data();
                historyData.push({ articleId, ...articleData });
            }
        }

        return h.response(historyData).code(200);
    } catch (error) {
        console.error('Error fetching user history:', error);
        return h.response({ message: 'Error fetching user history', error: error.message }).code(500);
    }
}



//Get Recomendation Aticle
//Untuk mendapatkan recomendasi artikel dari model ML learning yang dideploy menggunakan API flask
const getRecomendationArticle = async (request, h) => {
    const userId = request.user.uid;
    
    try {
        const response = await axios.post('http://127.0.0.1:5000/recommend_articles', {
            userId: userId
        });
        return h.response(response.data).code(200);
    } catch (error) {
        console.error('Error in Flask API call:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}




// Protected route handler
const protectedHandler = async (request, h) => {
  return h.response({ message: "You have access to this route" }).code(200);
};

module.exports = {
//USER
  registerHandler,
  loginHandler,
  profileHandler,
  updateProfileHandler,

//FIELD
  addFieldHandler,
  getFieldHandler,
  getFieldByidHandler,
  searchFieldHandler,
  updateFieldHandler,
  getFieldByKotaAndType,

//RESERVATION
  reservationHandler,
  getUserReservationHandler,
  getReservationbBySubFieldHandler,
  historyReservationHandler,

//EVENT
  addEventHandler,
  getEventHandler,
  getEvnetByIdHandler,
  updateEventHandler,
  searchEventHandler, 

//Community
addCommunityHandler,
getCommunityHandler,
getCommunityByIdHandler,
updateCommunityHandler,
searchCommunityHandler,

//Article
importArticle,
getArticle,
getArticlebyId,
getHistoryArticleUser,
getRecomendationArticle,

  protectedHandler,
};
