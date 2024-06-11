const admin = require("firebase-admin");

// const checkRole = (role) => {
//   return async (request, h) => {
//     const authorization = request.headers.authorization;
//     if (!authorization || !authorization.startsWith("Bearer ")) {
//       return h.response({ message: "Unauthorized" }).code(401);
//     }

//     const idToken = authorization.split("Bearer ")[1];
//     try {
//       const decodedToken = await admin.auth().verifyIdToken(idToken);
//       if (decodedToken.role !== role) {
//         return h.response({ message: "Access denied" }).code(403);
//       }
//       return h.continue;
//     } catch (error) {
//       return h.response({ message: "Unauthorized" }).code(401);
//     }
//   };
// };


// Middleware untuk memeriksa token autentikasi
const checkAuth = async (request, h) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return h.response({ message: 'Unauthorized' }).code(401).takeover();
  }

  const idToken = authorizationHeader.split('Bearer ')[1];
  try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      request.user = decodedToken;
      return h.continue;
  } catch (error) {
      console.error('Error verifying token:', error);
      return h.response({ message: 'Unauthorized' }).code(401).takeover();
  }
};



// Middleware untuk memeriksa kunci API
const checkApiKey = (request, h) => {
  const apiKey = request.headers['x-api-key'];
  if (apiKey !== '1111') {
      return h.response({ message: 'Invalid API key' }).code(403).takeover();
  }
  return h.continue;
};




module.exports = {
  checkAuth,
  checkApiKey,
};
