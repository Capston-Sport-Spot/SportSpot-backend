const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
  });

  server.route(routes);

  // Protected route example
  // server.route({
  //   method: "GET",
  //   path: "/protected",
  //   options: {
  //     pre: [{ method: checkRole("admin"), assign: "authorization" }],
  //   },
  //   handler: protectedHandler,
  // });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
