import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.get("/config/:channelId", /* { schema }, */ (request, reply) => {
    const { channelId } = request.params;
    reply.code(200).send({
      status: 200,
      message: "getConfig",
      channelId,
    });
  });
  next();
});
