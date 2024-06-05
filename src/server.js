const Hapi = require("@hapi/hapi");
const admin = require("firebase-admin");
const serviceAccount = require("../sportspot-d0d68-firebase-adminsdk-i7wnv-d8563c7c4e.json");
const {
  registerHandler,
  loginHandler,
  protectedHandler,
} = require("./handlers");
const { checkRole } = require("./middleware");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
  });

  // Registration endpoint
  server.route({
    method: "POST",
    path: "/register",
    handler: registerHandler,
  });

  // Login endpoint
  server.route({
    method: "POST",
    path: "/login",
    handler: loginHandler,
  });

  // Protected route example
  server.route({
    method: "GET",
    path: "/protected",
    options: {
      pre: [{ method: checkRole("admin"), assign: "authorization" }],
    },
    handler: protectedHandler,
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
