import { FastifyInstance } from "fastify";
import { createUserJsonSchema } from "./user.schema";
import { createUserHandler } from "./user.controllers";

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );
}
