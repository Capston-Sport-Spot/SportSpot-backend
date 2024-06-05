const admin = require("firebase-admin");

const checkRole = (role) => {
  return async (request, h) => {
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return h.response({ message: "Unauthorized" }).code(401);
    }

    const idToken = authorization.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.role !== role) {
        return h.response({ message: "Access denied" }).code(403);
      }
      return h.continue;
    } catch (error) {
      return h.response({ message: "Unauthorized" }).code(401);
    }
  };
};

module.exports = {
  checkRole,
};
