const admin = require("firebase-admin");

// Registration handler
const registerHandler = async (request, h) => {
  const { email, password, displayName, role } = request.payload;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    // Set custom claims (role)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    return h
      .response({
        message: "User created successfully",
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
        message: "User creation failed",
        error: error.message,
      })
      .code(400);
  }
};

// Login handler
const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const user = await admin.auth().getUserByEmail(email);

    // Note: Firebase Admin SDK does not support password verification.
    // Password verification should be done on the client-side using Firebase Authentication SDK.
    // Here, we're just simulating a successful login for the purpose of demonstration.

    return h
      .response({
        message: "Login successful",
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
        message: "Login failed",
        error: error.message,
      })
      .code(401);
  }
};

// Protected route handler
const protectedHandler = async (request, h) => {
  return h.response({ message: "You have access to this route" }).code(200);
};

module.exports = {
  registerHandler,
  loginHandler,
  protectedHandler,
};
