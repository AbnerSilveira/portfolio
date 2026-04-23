import Fastify from "fastify";

const server = Fastify({ logger: true });

server.get("/health", () => ({ status: "ok", timestamp: Date.now() }));

const port = Number(process.env.PORT ?? process.env.SANDBOX_PORT ?? 4000);
server.listen({ port, host: "0.0.0.0" }).catch((err) => {
  server.log.error(err);
  process.exit(1);
});
