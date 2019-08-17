import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.get("/viewer", /* { schema }, */ ({}, reply) => {
    reply.code(200).send({
      status: 200,
      message: "getViewer",
    });
  });
  next();
});