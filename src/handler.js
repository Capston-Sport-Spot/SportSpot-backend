const admin = require("firebase-admin");

// Fungsi untuk mendapatkan daftar booking
exports.getBookings = async (request, h) => {
  try {
    const bookingsRef = admin.firestore().collection("bookings");
    const snapshot = await bookingsRef.get();
    const bookings = snapshot.docs.map((doc) => doc.data());

    return h.response(bookings).code(200);
  } catch (error) {
    return h
      .response({
        message: "Gagal mendapatkan booking",
        error: error.message,
      })
      .code(500);
  }
};

// Fungsi untuk membuat booking baru
exports.createBooking = async (request, h) => {
  const booking = request.payload;

  try {
    const bookingRef = admin.firestore().collection("bookings").doc();
    await bookingRef.set(booking);

    return h
      .response({
        message: "Booking berhasil dibuat",
        booking: booking,
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        message: "Gagal membuat booking",
        error: error.message,
      })
      .code(500);
  }
};

// Fungsi untuk registrasi pengguna baru
exports.registerUser = async (request, h) => {
  const { email, password, displayName, role } = request.payload;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    return h
      .response({
        message: "Pengguna berhasil dibuat",
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          role: role,
        },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        message: "Pembuatan pengguna gagal",
        error: error.message,
      })
      .code(400);
  }
};

// Fungsi untuk login pengguna
exports.loginUser = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const user = await admin.auth().getUserByEmail(email);

    // Catatan: Firebase Admin SDK tidak mendukung verifikasi password.
    // Verifikasi password harus dilakukan di sisi klien menggunakan Firebase Authentication SDK.
    // Di sini, kami hanya mensimulasikan login yang berhasil untuk tujuan demonstrasi.

    return h
      .response({
        message: "Login berhasil",
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        message: "Login gagal",
        error: error.message,
      })
      .code(401);
  }
};
