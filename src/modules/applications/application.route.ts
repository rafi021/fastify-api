import { FastifyInstance } from "fastify";
import { createApplicationHandler } from "./application.controllers";
import { createApplicationJsonSchema } from "./application.schemas";

export async function applicationRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createApplicationJsonSchema,
    },
    createApplicationHandler
  );
  app.get("/", () => {});
}
